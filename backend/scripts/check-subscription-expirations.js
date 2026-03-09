#!/usr/bin/env node
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const expired = await prisma.companySubscription.findMany({
    where: { status: 'TRIAL', trialEndsAt: { lt: now } },
    include: { company: true },
  });

  for (const sub of expired) {
    await prisma.$transaction([
      prisma.company.update({
        where: { id: sub.companyId },
        data: { subscriptionStatus: 'EXPIRED' },
      }),
      prisma.companySubscription.update({
        where: { id: sub.id },
        data: { status: 'EXPIRED' },
      }),
    ]);
    console.log(`Expired trial: ${sub.company.name} (${sub.companyId})`);
  }

  console.log(`Done. Expired ${expired.length} subscription(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
