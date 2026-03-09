const {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { taskCreatedByCompanyFilter, ownerCompanyFilter, userCompanyFilter, clientOwnerCompanyFilter } = require('../../common/utils/company-scope');

function cleanString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

function toOptionalDate(v, fieldName) {
  if (v == null || String(v).trim() === '') return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) throw new BadRequestException(`${fieldName} must be a valid date`);
  return d;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addFrequency(date, frequency, intervalValue) {
  const d = new Date(date);
  const i = Number(intervalValue || 1);

  switch (frequency) {
    case 'DAILY':
      d.setDate(d.getDate() + i);
      break;
    case 'WEEKLY':
      d.setDate(d.getDate() + 7 * i);
      break;
    case 'BI_WEEKLY':
      d.setDate(d.getDate() + 14 * i);
      break;
    case 'MONTHLY':
      d.setMonth(d.getMonth() + i);
      break;
    case 'QUARTERLY':
      d.setMonth(d.getMonth() + 3 * i);
      break;
    case 'YEARLY':
      d.setFullYear(d.getFullYear() + i);
      break;
    default:
      throw new BadRequestException('Invalid recurring frequency');
  }

  return d;
}

@Injectable()
class TasksService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async ensureUser(id, fieldName) {
    if (!id) return null;
    const u = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!u) throw new BadRequestException(`${fieldName} is invalid`);
    return id;
  }

  async ensureEmployee(id, fieldName) {
    if (!id) return null;
    const e = await this.prisma.employee.findUnique({ where: { id }, select: { id: true } });
    if (!e) throw new BadRequestException(`${fieldName} is invalid`);
    return id;
  }

  async ensureClient(id, fieldName, currentUser) {
    if (!id) return null;
    const where = { id, ...ownerCompanyFilter(currentUser) };
    const c = await this.prisma.client.findFirst({ where, select: { id: true } });
    if (!c) throw new BadRequestException(`${fieldName} is invalid`);
    return id;
  }

  async ensureInvoice(id, fieldName, currentUser) {
    if (!id) return null;
    const where = { id, ...userCompanyFilter(currentUser) };
    const inv = await this.prisma.invoice.findFirst({ where, select: { id: true } });
    if (!inv) throw new BadRequestException(`${fieldName} is invalid`);
    return id;
  }

  async ensureBill(id, fieldName, currentUser) {
    if (!id) return null;
    const where = { id, ...userCompanyFilter(currentUser) };
    const bill = await this.prisma.bill.findFirst({ where, select: { id: true } });
    if (!bill) throw new BadRequestException(`${fieldName} is invalid`);
    return id;
  }

  async ensureProject(id, fieldName, currentUser) {
    if (!id) return null;
    const where = { id, ...clientOwnerCompanyFilter(currentUser) };
    const p = await this.prisma.project.findFirst({ where, select: { id: true } });
    if (!p) throw new BadRequestException(`${fieldName} is invalid`);
    return id;
  }

  async create(userId, dto, { currentUser } = {}) {
    const title = String(dto.title || '').trim();
    if (!title) throw new BadRequestException('title is required');

    const dueDate = toOptionalDate(dto.dueDate, 'dueDate');

    const reminderEnabled = dto.reminderEnabled != null ? Boolean(dto.reminderEnabled) : false;
    const reminderAt = toOptionalDate(dto.reminderAt, 'reminderAt');
    if (reminderEnabled && !reminderAt) {
      throw new BadRequestException('reminderAt is required when reminderEnabled is true');
    }

    const assignedUserId = cleanString(dto.assignedUserId);
    const assignedEmployeeId = cleanString(dto.assignedEmployeeId);
    if (assignedUserId && assignedEmployeeId) {
      throw new BadRequestException('Only one of assignedUserId or assignedEmployeeId can be set');
    }

    await this.ensureUser(assignedUserId, 'assignedUserId');
    await this.ensureEmployee(assignedEmployeeId, 'assignedEmployeeId');

    const clientId = cleanString(dto.clientId);
    const address = cleanString(dto.address);
    const invoiceId = cleanString(dto.invoiceId);
    const billId = cleanString(dto.billId);
    const projectId = cleanString(dto.projectId);

    await this.ensureClient(clientId, 'clientId', currentUser);
    await this.ensureInvoice(invoiceId, 'invoiceId', currentUser);
    await this.ensureBill(billId, 'billId', currentUser);
    await this.ensureProject(projectId, 'projectId', currentUser);

    const type = dto.type || 'GENERAL';
    const priority = dto.priority || 'MEDIUM';
    const status = dto.status || 'PENDING';
    const isTemplate = dto.isTemplate != null ? Boolean(dto.isTemplate) : false;

    const recurrencePayload = dto.recurrence && typeof dto.recurrence === 'object' ? dto.recurrence : null;

    if (recurrencePayload && !isTemplate) {
      throw new BadRequestException('Recurring tasks must be created as templates (isTemplate=true)');
    }

    return this.prisma.$transaction(async (tx) => {
      let recurrenceId = null;

      if (recurrencePayload) {
        const frequency = String(recurrencePayload.frequency || '').trim();
        const intervalValue = recurrencePayload.intervalValue != null ? Number(recurrencePayload.intervalValue) : 1;
        const startDate = toOptionalDate(recurrencePayload.startDate, 'recurrence.startDate') || (dueDate ? startOfDay(dueDate) : startOfDay(new Date()));
        const endDate = toOptionalDate(recurrencePayload.endDate, 'recurrence.endDate');

        if (!['DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'].includes(frequency)) {
          throw new BadRequestException('recurrence.frequency is invalid');
        }
        if (!Number.isFinite(intervalValue) || intervalValue < 1) {
          throw new BadRequestException('recurrence.intervalValue must be at least 1');
        }
        if (endDate && endDate < startDate) {
          throw new BadRequestException('recurrence.endDate must be on or after recurrence.startDate');
        }

        const nextRunDate = startOfDay(startDate);

        const r = await tx.taskRecurrence.create({
          data: {
            frequency,
            intervalValue,
            startDate,
            endDate,
            nextRunDate,
            isActive: true,
          },
          select: { id: true },
        });

        recurrenceId = r.id;
      }

      const task = await tx.task.create({
        data: {
          title,
          description: cleanString(dto.description),
          type,
          priority,
          status,
          dueDate,
          reminderEnabled,
          reminderAt,
          isTemplate,
          recurrenceId,
          assignedUserId,
          assignedEmployeeId,
          clientId,
          address,
          invoiceId,
          billId,
          projectId,
          createdByUserId: userId,
          ...(status === 'COMPLETED' ? { completedAt: new Date() } : {}),
          ...(status === 'CANCELLED' ? { cancelledAt: new Date() } : {}),
        },
        include: this.defaultInclude(),
      });

      await tx.taskActivity.create({
        data: {
          taskId: task.id,
          actorUserId: userId,
          action: 'CREATED',
          meta: { title },
        },
      });

      if (reminderEnabled && reminderAt && assignedUserId) {
        await tx.taskNotification.create({
          data: {
            taskId: task.id,
            userId: assignedUserId,
            type: 'REMINDER',
            scheduledAt: reminderAt,
          },
        });
      }

      return task;
    });
  }

  defaultInclude() {
    return {
      createdByUser: { select: { id: true, firstName: true, lastName: true, email: true } },
      assignedUser: { select: { id: true, firstName: true, lastName: true, email: true } },
      assignedEmployee: { select: { id: true, firstName: true, lastName: true, email: true, title: true } },
      client: { select: { id: true, companyName: true, contactName: true } },
      invoice: { select: { id: true, invoiceNumber: true, status: true, dueDate: true } },
      bill: { select: { id: true, billNumber: true, vendorName: true, status: true, dueDate: true } },
      project: { select: { id: true, name: true, status: true } },
      recurrence: true,
    };
  }

  async findAll(query, { currentUser } = {}) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;

    const where = { ...taskCreatedByCompanyFilter(currentUser) };

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.type) where.type = query.type;

    if (query.isTemplate != null && query.isTemplate !== '') {
      where.isTemplate = String(query.isTemplate).toLowerCase() === 'true';
    }

    if (query.assignedUserId) where.assignedUserId = query.assignedUserId;
    if (query.assignedEmployeeId) where.assignedEmployeeId = query.assignedEmployeeId;

    if (query.clientId) where.clientId = query.clientId;
    if (query.invoiceId) where.invoiceId = query.invoiceId;
    if (query.billId) where.billId = query.billId;
    if (query.projectId) where.projectId = query.projectId;

    if (query.dueFrom || query.dueTo) {
      const dueFrom = query.dueFrom ? new Date(query.dueFrom) : null;
      const dueTo = query.dueTo ? new Date(query.dueTo) : null;
      if (dueFrom && Number.isNaN(dueFrom.getTime())) throw new BadRequestException('dueFrom must be a valid date');
      if (dueTo && Number.isNaN(dueTo.getTime())) throw new BadRequestException('dueTo must be a valid date');

      where.dueDate = {
        ...(dueFrom ? { gte: dueFrom } : {}),
        ...(dueTo ? { lte: dueTo } : {}),
      };
    }

    if (query.overdue != null && query.overdue !== '') {
      const overdue = String(query.overdue).toLowerCase() === 'true';
      if (overdue) {
        where.dueDate = { lt: new Date() };
        where.status = { in: ['PENDING', 'IN_PROGRESS'] };
      }
    }

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.paginate('task', {
      page,
      limit,
      where,
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      include: this.defaultInclude(),
    });
  }

  async calendar({ start, end, assignedUserId, assignedEmployeeId, includeCompleted } = {}, { currentUser } = {}) {
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;

    if (!startDate || Number.isNaN(startDate.getTime())) {
      throw new BadRequestException('start is required and must be a valid date');
    }
    if (!endDate || Number.isNaN(endDate.getTime())) {
      throw new BadRequestException('end is required and must be a valid date');
    }
    if (endDate < startDate) {
      throw new BadRequestException('end must be on or after start');
    }

    const where = {
      ...taskCreatedByCompanyFilter(currentUser),
      dueDate: { gte: startDate, lte: endDate },
      isTemplate: false,
    };

    if (assignedUserId) where.assignedUserId = assignedUserId;
    if (assignedEmployeeId) where.assignedEmployeeId = assignedEmployeeId;

    if (String(includeCompleted).toLowerCase() !== 'true') {
      where.status = { in: ['PENDING', 'IN_PROGRESS'] };
    }

    const items = await this.prisma.task.findMany({
      where,
      orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
      include: this.defaultInclude(),
      take: 1000,
    });

    return { data: items };
  }

  async dashboardSummary(userId, { currentUser } = {}) {
    const now = new Date();
    const todayStart = startOfDay(now);
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const baseWhere = {
      ...taskCreatedByCompanyFilter(currentUser),
      isTemplate: false,
      status: { in: ['PENDING', 'IN_PROGRESS'] },
    };

    const [
      overdueCount,
      todayCount,
      upcomingCount,
      highPriorityCount,
      overdueTasks,
      todayTasks,
      upcomingTasks,
      highPriorityTasks,
    ] = await Promise.all([
      this.prisma.task.count({
        where: {
          ...baseWhere,
          dueDate: { lt: now },
          OR: [{ assignedUserId: userId }, { createdByUserId: userId }],
        },
      }),
      this.prisma.task.count({
        where: {
          ...baseWhere,
          dueDate: { gte: todayStart, lt: tomorrow },
          OR: [{ assignedUserId: userId }, { createdByUserId: userId }],
        },
      }),
      this.prisma.task.count({
        where: {
          ...baseWhere,
          dueDate: { gte: tomorrow },
          OR: [{ assignedUserId: userId }, { createdByUserId: userId }],
        },
      }),
      this.prisma.task.count({
        where: {
          ...baseWhere,
          priority: { in: ['HIGH', 'CRITICAL'] },
          OR: [{ assignedUserId: userId }, { createdByUserId: userId }],
        },
      }),
      this.prisma.task.findMany({
        where: {
          ...baseWhere,
          dueDate: { lt: now },
          OR: [{ assignedUserId: userId }, { createdByUserId: userId }],
        },
        orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
        take: 5,
        include: this.defaultInclude(),
      }),
      this.prisma.task.findMany({
        where: {
          ...baseWhere,
          dueDate: { gte: todayStart, lt: tomorrow },
          OR: [{ assignedUserId: userId }, { createdByUserId: userId }],
        },
        orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
        take: 5,
        include: this.defaultInclude(),
      }),
      this.prisma.task.findMany({
        where: {
          ...baseWhere,
          dueDate: { gte: tomorrow },
          OR: [{ assignedUserId: userId }, { createdByUserId: userId }],
        },
        orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
        take: 5,
        include: this.defaultInclude(),
      }),
      this.prisma.task.findMany({
        where: {
          ...baseWhere,
          priority: { in: ['HIGH', 'CRITICAL'] },
          OR: [{ assignedUserId: userId }, { createdByUserId: userId }],
        },
        orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
        take: 5,
        include: this.defaultInclude(),
      }),
    ]);

    return {
      overdue: { count: overdueCount, items: overdueTasks },
      today: { count: todayCount, items: todayTasks },
      upcoming: { count: upcomingCount, items: upcomingTasks },
      highPriority: { count: highPriorityCount, items: highPriorityTasks },
    };
  }

  async findOne(id, { currentUser } = {}) {
    const task = await this.prisma.task.findFirst({
      where: { id, ...taskCreatedByCompanyFilter(currentUser) },
      include: {
        ...this.defaultInclude(),
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: {
            actor: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(actorUserId, id, dto, { currentUser } = {}) {
    const current = await this.findOne(id, { currentUser });

    const title = dto.title != null ? String(dto.title).trim() : null;
    if (dto.title != null && !title) throw new BadRequestException('title cannot be empty');

    const dueDate = dto.dueDate !== undefined ? toOptionalDate(dto.dueDate, 'dueDate') : undefined;

    const reminderEnabled = dto.reminderEnabled !== undefined ? Boolean(dto.reminderEnabled) : undefined;
    const reminderAt = dto.reminderAt !== undefined ? toOptionalDate(dto.reminderAt, 'reminderAt') : undefined;

    const assignedUserId = dto.assignedUserId !== undefined ? cleanString(dto.assignedUserId) : undefined;
    const assignedEmployeeId = dto.assignedEmployeeId !== undefined ? cleanString(dto.assignedEmployeeId) : undefined;
    if (assignedUserId && assignedEmployeeId) {
      throw new BadRequestException('Only one of assignedUserId or assignedEmployeeId can be set');
    }

    if (assignedUserId !== undefined) await this.ensureUser(assignedUserId, 'assignedUserId');
    if (assignedEmployeeId !== undefined) await this.ensureEmployee(assignedEmployeeId, 'assignedEmployeeId');

    const clientId = dto.clientId !== undefined ? cleanString(dto.clientId) : undefined;
    const address = dto.address !== undefined ? cleanString(dto.address) : undefined;
    const invoiceId = dto.invoiceId !== undefined ? cleanString(dto.invoiceId) : undefined;
    const billId = dto.billId !== undefined ? cleanString(dto.billId) : undefined;
    const projectId = dto.projectId !== undefined ? cleanString(dto.projectId) : undefined;

    if (clientId !== undefined) await this.ensureClient(clientId, 'clientId', currentUser);
    if (invoiceId !== undefined) await this.ensureInvoice(invoiceId, 'invoiceId', currentUser);
    if (billId !== undefined) await this.ensureBill(billId, 'billId', currentUser);
    if (projectId !== undefined) await this.ensureProject(projectId, 'projectId', currentUser);

    const nextStatus = dto.status != null ? dto.status : null;

    if (dto.isTemplate === false && current.recurrenceId) {
      throw new ConflictException('Cannot convert a recurring template to a non-template. Remove recurrence first.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id, ...taskCreatedByCompanyFilter(currentUser) },
        data: {
          ...(title != null ? { title } : {}),
          ...(dto.description !== undefined ? { description: cleanString(dto.description) } : {}),
          ...(dto.type != null ? { type: dto.type } : {}),
          ...(dto.priority != null ? { priority: dto.priority } : {}),
          ...(nextStatus != null
            ? {
                status: nextStatus,
                ...(nextStatus === 'COMPLETED' ? { completedAt: new Date(), cancelledAt: null } : {}),
                ...(nextStatus === 'CANCELLED' ? { cancelledAt: new Date(), completedAt: null } : {}),
                ...(nextStatus === 'PENDING' || nextStatus === 'IN_PROGRESS'
                  ? { completedAt: null, cancelledAt: null }
                  : {}),
              }
            : {}),
          ...(dueDate !== undefined ? { dueDate } : {}),
          ...(reminderEnabled !== undefined ? { reminderEnabled } : {}),
          ...(reminderAt !== undefined ? { reminderAt } : {}),
          ...(dto.isTemplate != null ? { isTemplate: Boolean(dto.isTemplate) } : {}),
          ...(assignedUserId !== undefined ? { assignedUserId } : {}),
          ...(assignedEmployeeId !== undefined ? { assignedEmployeeId } : {}),
          ...(clientId !== undefined ? { clientId } : {}),
          ...(address !== undefined ? { address } : {}),
          ...(invoiceId !== undefined ? { invoiceId } : {}),
          ...(billId !== undefined ? { billId } : {}),
          ...(projectId !== undefined ? { projectId } : {}),
        },
        include: this.defaultInclude(),
      });

      await tx.taskActivity.create({
        data: {
          taskId: id,
          actorUserId,
          action: nextStatus && nextStatus !== current.status ? 'STATUS_CHANGED' : 'UPDATED',
          fromStatus: nextStatus && nextStatus !== current.status ? current.status : undefined,
          toStatus: nextStatus && nextStatus !== current.status ? nextStatus : undefined,
          meta: {},
        },
      });

      // Maintain reminder notifications for assigned users only
      if (updated.reminderEnabled && updated.reminderAt && updated.assignedUserId) {
        await tx.taskNotification.deleteMany({ where: { taskId: id, type: 'REMINDER' } });
        await tx.taskNotification.create({
          data: {
            taskId: id,
            userId: updated.assignedUserId,
            type: 'REMINDER',
            scheduledAt: updated.reminderAt,
          },
        });
      } else {
        await tx.taskNotification.deleteMany({ where: { taskId: id, type: 'REMINDER' } });
      }

      return updated;
    });
  }

  async complete(actorUserId, id, dto = {}, { currentUser } = {}) {
    const current = await this.findOne(id, { currentUser });
    if (current.status === 'COMPLETED') return current;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id, ...taskCreatedByCompanyFilter(currentUser) },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          cancelledAt: null,
        },
        include: this.defaultInclude(),
      });

      await tx.taskNotification.deleteMany({ where: { taskId: id } });

      await tx.taskActivity.create({
        data: {
          taskId: id,
          actorUserId,
          action: 'COMPLETED',
          fromStatus: current.status,
          toStatus: 'COMPLETED',
          meta: { comment: cleanString(dto?.comment) },
        },
      });

      return updated;
    });
  }

  async cancel(actorUserId, id, { currentUser } = {}) {
    const current = await this.findOne(id, { currentUser });
    if (current.status === 'CANCELLED') return current;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id, ...taskCreatedByCompanyFilter(currentUser) },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          completedAt: null,
        },
        include: this.defaultInclude(),
      });

      await tx.taskActivity.create({
        data: {
          taskId: id,
          actorUserId,
          action: 'CANCELLED',
          fromStatus: current.status,
          toStatus: 'CANCELLED',
        },
      });

      return updated;
    });
  }

  async reschedule(actorUserId, id, body = {}, { currentUser } = {}) {
    const current = await this.findOne(id, { currentUser });
    const nextDue = toOptionalDate(body?.dueDate, 'dueDate');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id, ...taskCreatedByCompanyFilter(currentUser) },
        data: { dueDate: nextDue },
        include: this.defaultInclude(),
      });

      await tx.taskActivity.create({
        data: {
          taskId: id,
          actorUserId,
          action: 'RESCHEDULED',
          meta: {
            from: current.dueDate,
            to: nextDue,
          },
        },
      });

      return updated;
    });
  }

  async remove(actorUserId, id, { currentUser } = {}) {
    await this.findOne(id, { currentUser });

    return this.prisma.$transaction(async (tx) => {
      await tx.taskActivity.create({
        data: {
          taskId: id,
          actorUserId,
          action: 'DELETED',
        },
      });

      await tx.taskNotification.deleteMany({ where: { taskId: id } });
      await tx.task.delete({ where: { id, ...taskCreatedByCompanyFilter(currentUser) } });
      return { ok: true };
    });
  }

  async runDueRecurrences() {
    const now = new Date();

    const due = await this.prisma.taskRecurrence.findMany({
      where: {
        isActive: true,
        nextRunDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
    });

    let tasksCreated = 0;

    for (const r of due) {
      await this.prisma.$transaction(async (tx) => {
        const templates = await tx.task.findMany({
          where: {
            recurrenceId: r.id,
            isTemplate: true,
          },
        });

        for (const t of templates) {
          // Avoid duplicates if job runs twice on same day
          const existing = await tx.task.findFirst({
            where: {
              generatedFromTaskId: t.id,
              dueDate: r.nextRunDate,
            },
            select: { id: true },
          });
          if (existing) continue;

          const created = await tx.task.create({
            data: {
              title: t.title,
              description: t.description,
              type: t.type,
              priority: t.priority,
              status: 'PENDING',
              dueDate: r.nextRunDate,
              reminderEnabled: t.reminderEnabled,
              reminderAt: t.reminderAt,
              isTemplate: false,
              generatedFromTaskId: t.id,
              recurrenceId: r.id,
              assignedUserId: t.assignedUserId,
              assignedEmployeeId: t.assignedEmployeeId,
              clientId: t.clientId,
              invoiceId: t.invoiceId,
              billId: t.billId,
              projectId: t.projectId,
              createdByUserId: t.createdByUserId,
            },
          });

          await tx.taskActivity.create({
            data: {
              taskId: created.id,
              actorUserId: t.createdByUserId,
              action: 'CREATED',
              meta: { generatedFromTaskId: t.id, recurrenceId: r.id },
            },
          });

          tasksCreated += 1;

          if (created.reminderEnabled && created.reminderAt && created.assignedUserId) {
            await tx.taskNotification.create({
              data: {
                taskId: created.id,
                userId: created.assignedUserId,
                type: 'REMINDER',
                scheduledAt: created.reminderAt,
              },
            });
          }
        }

        const nextRunDate = startOfDay(addFrequency(r.nextRunDate, r.frequency, r.intervalValue));

        await tx.taskRecurrence.update({
          where: { id: r.id },
          data: {
            lastGenerated: now,
            nextRunDate,
          },
        });
      });
    }

    return { recurrencesProcessed: due.length, tasksCreated };
  }
}

module.exports = { TasksService };
