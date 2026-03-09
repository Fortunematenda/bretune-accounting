 const path = require('path');
const PDFDocument = require('pdfkit');

// Brand colors (hex)
const COLORS = {
  primary: '#7c3aed',
  primaryDark: '#6d28d9',
  text: '#1e293b',
  textMuted: '#64748b',
  border: '#e2e8f0',
  bgHeader: '#f8fafc',
};

const MARGIN = 40;
const PAGE_WIDTH = 595.28; // A4 width in points
const PAGE_HEIGHT = 841.89; // A4 height in points
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const SAFE_BOTTOM = 35; // Min distance from bottom for footer

function safeDateISO(value) {
  try {
    const d = value instanceof Date ? value : new Date(value);
    if (!d || Number.isNaN(d.getTime())) return '—';
    return d.toISOString().slice(0, 10);
  } catch {
    return '—';
  }
}

function formatDateDDMMYYYY(value) {
  try {
    const d = value instanceof Date ? value : new Date(value);
    if (!d || Number.isNaN(d.getTime())) return '—';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return '—';
  }
}

function getClientAccountCode(client) {
  if (!client) return '—';
  const name = String(client.companyName || client.contactName || '').trim().toUpperCase();
  const code = name.length >= 3 ? name.slice(0, 3) : (name || 'CUS');
  const seq = String(client.clientSeq != null ? client.clientSeq : 0).padStart(3, '0');
  return `${code}${seq}`;
}

function formatMoney(value) {
  if (value == null || value === '') return '—';
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return 'R ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function statementRowDescription(row) {
  if (row?.type === 'INVOICE') return 'Invoice issued';
  if (row?.type === 'PAYMENT') return `Payment received${row?.method ? ` (${row.method})` : ''}`;
  if (row?.type === 'LOAN') return `Loan issued${row?.borrowerName ? ` (${row.borrowerName})` : ''}`;
  if (row?.type === 'LOAN_REPAYMENT') return `Loan repayment${row?.borrowerName ? ` (${row.borrowerName})` : ''}`;
  return 'Transaction';
}

function docToBuffer(doc) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
}

function getLogoPath() {
  return path.join(__dirname, '..', '..', '..', 'assets', 'bretune-logo.png');
}

async function renderHeader(doc, docType) {
  const logoPath = getLogoPath();
  const fs = require('fs');

  const logoHeight = 100; // Reserved height so badge sits below logo
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, MARGIN, MARGIN, { width: 100 });
  } else {
    doc.fontSize(20).fillColor(COLORS.primary).text('Bretune', MARGIN, MARGIN);
    doc.fontSize(12).fillColor(COLORS.textMuted).text('Accounting', MARGIN, MARGIN + 24);
  }

  doc.fontSize(9).fillColor(COLORS.textMuted);
  const rightX = PAGE_WIDTH - MARGIN;
  doc.text('Professional Accounting', rightX, MARGIN, { align: 'right', width: 180 });
  doc.text('Invoices · Statements · Quotes', rightX, MARGIN + 12, { align: 'right', width: 180 });

  // Document type badge - positioned below logo so it doesn't overlap
  const badgeY = MARGIN + logoHeight + 12;
  doc.rect(MARGIN, badgeY, 120, 22).fillAndStroke(COLORS.primary, COLORS.primary);
  doc.fontSize(12).fillColor('#ffffff').text(docType, MARGIN + 10, badgeY + 5, { width: 100 });

  return badgeY + 32;
}

function hasBankDetails(settings) {
  if (!settings || typeof settings !== 'object') return false;
  const s = (v) => (v && String(v).trim()) || '';
  return !!(s(settings.bankName) || s(settings.accountNumber) || s(settings.accountName));
}

function renderBankDetailsAtBottom(doc, settings, invoiceRef, compact) {
  const s = (v) => (v && String(v).trim()) || '';
  const lines = [];
  if (s(settings?.bankName)) lines.push({ label: 'Bank', value: s(settings.bankName) });
  if (s(settings?.accountName)) lines.push({ label: 'Account Holder', value: s(settings.accountName) });
  if (s(settings?.accountType)) lines.push({ label: 'Account Type', value: s(settings.accountType) });
  if (s(settings?.accountNumber)) lines.push({ label: 'Account Number', value: s(settings.accountNumber) });
  if (s(settings?.branchCode)) lines.push({ label: 'Branch Code', value: s(settings.branchCode) });
  if (invoiceRef) lines.push({ label: 'Reference', value: String(invoiceRef) });
  if (lines.length === 0) return;

  const boxPadding = compact ? 14 : 20;
  const lineH = compact ? 10 : 14;
  const boxX = MARGIN;
  const boxW = CONTENT_WIDTH;
  const titleSize = compact ? 10 : 14;
  const textSize = compact ? 9 : 13;

  doc.font('Helvetica').fontSize(textSize);
  let contentH = compact ? 8 : 12;
  for (const l of lines) {
    contentH += Math.max(doc.heightOfString(`${l.label}: ${l.value}`, { width: boxW - boxPadding * 2 }), lineH);
  }
  const boxH = (compact ? 20 : 28) + contentH;
  const boxY = PAGE_HEIGHT - SAFE_BOTTOM - boxH - (compact ? 8 : 16);

  doc.rect(boxX, boxY, boxW, boxH).fillAndStroke('#111827', '#111827');

  doc.fontSize(titleSize).fillColor('#ffffff').font('Helvetica-Bold').text('Banking Details', boxX + boxPadding, boxY + (compact ? 3 : 5), { width: boxW - boxPadding * 2 });

  let lineY = boxY + (compact ? 18 : 28);
  doc.font('Helvetica').fontSize(textSize).fillColor('#D1D5DB');
  for (const l of lines) {
    const text = `${l.label}: ${l.value}`;
    const h = doc.heightOfString(text, { width: boxW - boxPadding * 2 });
    doc.text(text, boxX + boxPadding, lineY, { width: boxW - boxPadding * 2 });
    lineY += Math.max(h, lineH);
  }
}

function initialsFrom(text) {
  const t = String(text || 'I').trim();
  const parts = t.split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((p) => p[0]).join('').toUpperCase() || 'I';
}

function getCompanyLogoPath(companySettings = {}) {
  const fs = require('fs');
  const customPath = (companySettings.logoPath || companySettings.logoUrl || '').toString().trim();
  if (customPath && fs.existsSync(customPath)) return customPath;
  const defaultPath = getLogoPath();
  return fs.existsSync(defaultPath) ? defaultPath : null;
}

// ─── Invoice PDF ─────────────────────────────────────────────────────────────
async function generateInvoicePdfBuffer(invoice, companySettings = {}) {
  const doc = new PDFDocument({ margin: 0, size: 'A4' });
  const fs = require('fs');

  const invoiceRef =
    (invoice?.invoiceNumber && String(invoice.invoiceNumber).trim()) ||
    (invoice?.invoiceSeq != null ? `INV-${String(invoice.invoiceSeq).padStart(3, '0')}` : null) ||
    (invoice?.id ? String(invoice.id) : null) ||
    '—';
  const companyName = String(invoice?.user?.companyName || '').trim() || 'Company';
  const clientName = String(
    `${invoice?.client?.companyName || ''} ${invoice?.client?.contactName || ''}`.trim()
  ).trim() || '—';
  const clientCode = getClientAccountCode(invoice?.client);
  const s = companySettings || {};
  const vatNumber = (s.vatNumber || s.taxNumber || '').toString().trim();

  // Page background #f5f5f5
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill('#f5f5f5');

  // White invoice container (padding for logo/company spacing)
  const containerPad = 52;
  const containerW = PAGE_WIDTH - containerPad * 2;
  const containerX = containerPad;
  const containerY = containerPad;

  doc.rect(containerX, containerY, containerW, PAGE_HEIGHT - containerPad * 2).fill('#ffffff').stroke('#e0e0e0');
  const left = containerX + containerPad;
  const right = containerX + containerW - containerPad;
  const contentW = containerW - containerPad * 2;

  let y = containerY + containerPad;
  const headerRightW = 220;

  // ─── LEFT: Logo + brand (same row), slogan, company contact ───
  const logoPath = getCompanyLogoPath(s);
  const logoWidth = 72;
  const logoMaxHeight = 40;
  let leftY = y;
  if (logoPath) {
    try {
      doc.image(logoPath, left, leftY, { fit: [logoWidth, logoMaxHeight] });
    } catch { /* ignore */ }
  } else {
    doc.fontSize(14).fillColor('#111827').font('Helvetica-Bold').text(companyName || 'Company', left, leftY);
  }
  leftY += logoMaxHeight + 12;
  const tagline = (s.tagline || s.slogan || '').toString().trim();
  if (tagline) {
    doc.fontSize(8).fillColor('#64748b').font('Helvetica').text(tagline.toUpperCase(), left, leftY);
    leftY += 12;
  }
  if (logoPath) {
    doc.fontSize(10).fillColor('#111827').font('Helvetica-Bold').text(companyName, left, leftY);
    leftY += 12;
  }
  doc.fontSize(9).fillColor('#374151').font('Helvetica');
  const addrParts = [s.addressLine, s.city, s.country].filter(Boolean);
  addrParts.forEach((p) => {
    doc.text(String(p), left, leftY);
    leftY += 11;
  });
  if (vatNumber) {
    doc.text('VAT number: ' + vatNumber, left, leftY);
    leftY += 11;
  }
  if (s.businessPhone) {
    doc.text('Phone: ' + s.businessPhone, left, leftY);
    leftY += 11;
  }
  if (s.businessEmail) {
    doc.text('Email: ' + s.businessEmail, left, leftY);
    leftY += 11;
  }

  // ─── RIGHT: Tax invoice title + invoice details + Total due + Bill To ───
  let rightY = containerY + containerPad;
  doc.fontSize(24).fillColor('#111827').font('Helvetica-Bold').text('Tax invoice', right - headerRightW, rightY, { width: headerRightW, align: 'right' });
  rightY += 28;
  doc.fontSize(9).fillColor('#374151').font('Helvetica');
  doc.text('Invoice #: ' + invoiceRef, right - headerRightW, rightY, { width: headerRightW, align: 'right' });
  rightY += 12;
  doc.text('Date: ' + formatDateDDMMYYYY(invoice?.issueDate), right - headerRightW, rightY, { width: headerRightW, align: 'right' });
  rightY += 12;
  const orderRef = (invoice?.notes && String(invoice.notes).trim()) ? String(invoice.notes).slice(0, 50) : '—';
  doc.text('Order #: ' + orderRef, right - headerRightW, rightY, { width: headerRightW, align: 'right' });
  rightY += 12;
  doc.text('Due date: ' + formatDateDDMMYYYY(invoice?.dueDate), right - headerRightW, rightY, { width: headerRightW, align: 'right' });
  rightY += 32;
  doc.fontSize(10).fillColor('#111827').font('Helvetica-Bold').text(clientName, right - headerRightW, rightY, { width: headerRightW, align: 'right' });
  rightY += 12;
  doc.fontSize(9).fillColor('#374151').font('Helvetica');
  doc.text('Customer Account Code: ' + clientCode, right - headerRightW, rightY, { width: headerRightW, align: 'right' });
  rightY += 12;
  const clientAddr = [invoice?.client?.address, invoice?.client?.city, invoice?.client?.state, invoice?.client?.postalCode, invoice?.client?.country].filter(Boolean);
  clientAddr.forEach((p) => {
    doc.text(String(p), right - headerRightW, rightY, { width: headerRightW, align: 'right' });
    rightY += 11;
  });

  y = Math.max(leftY, rightY) + 28;

  // ─── Table: #, Description, Qty, Excl. price, VAT %, Excl. total, Incl. total ───
  const tableW = contentW;
  const fixedColsW = 24 + 32 + 60 + 36 + 60 + 65; // num, qty, exclPrice, vat, exclTotal, inclTotal
  const colW = {
    num: 24,
    desc: Math.max(100, tableW - fixedColsW),
    qty: 32,
    exclPrice: 60,
    vat: 36,
    exclTotal: 60,
    inclTotal: 65,
  };

  const headerH = 28;
  doc.rect(left, y, tableW, headerH).fill('#f0f0f0');
  doc.rect(left, y, tableW, headerH).stroke('#dddddd');
  doc.fontSize(9).fillColor('#111827').font('Helvetica-Bold');
  let x = left + 8;
  doc.text('#', x, y + 9); x += colW.num;
  doc.text('Description', x, y + 9); x += colW.desc;
  doc.text('Qty', x, y + 9); x += colW.qty;
  doc.text('Excl. price', x, y + 9, { width: colW.exclPrice, align: 'right' }); x += colW.exclPrice;
  doc.text('VAT %', x, y + 9, { width: colW.vat, align: 'right' }); x += colW.vat;
  doc.text('Excl. total', x, y + 9, { width: colW.exclTotal, align: 'right' }); x += colW.exclTotal;
  doc.text('Incl. total', x, y + 9, { width: colW.inclTotal, align: 'right' });
  y += headerH;

  const items = invoice?.items || [];
  const minRowH = 22;
  const cellPad = 8;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const qty = Number(item?.quantity ?? 0);
    const unitPrice = Number(item?.unitPrice ?? 0);
    const discount = Number(item?.discount ?? 0);
    const taxRate = Number(item?.taxRate ?? 0);
    const inclTotal = Number(item?.total ?? 0);
    const exclTotalVal = taxRate > 0 ? inclTotal / (1 + taxRate) : inclTotal;
    const vatPct = (taxRate * 100).toFixed(2);

    const descStr = String(item?.description || item?.product?.name || '—');
    const descOpts = { width: colW.desc - 12, lineGap: 3, ellipsis: true };
    const maxRowH = 36;
    const descH = Math.min(doc.heightOfString(descStr, descOpts), maxRowH - cellPad * 2);
    const rowH = Math.max(minRowH, Math.min(descH + cellPad * 2, maxRowH));

    doc.rect(left, y, tableW, rowH).stroke('#dddddd');
    doc.fontSize(9).fillColor('#111827').font('Helvetica');
    x = left + 8;
    doc.text(String(i + 1), x, y + cellPad); x += colW.num;
    doc.text(descStr, x, y + cellPad, descOpts); x += colW.desc;
    doc.text(String(qty), x, y + cellPad, { width: colW.qty, align: 'right' }); x += colW.qty;
    doc.text(formatMoney(unitPrice), x, y + cellPad, { width: colW.exclPrice, align: 'right' }); x += colW.exclPrice;
    doc.text(String(vatPct), x, y + cellPad, { width: colW.vat, align: 'right' }); x += colW.vat;
    doc.text(formatMoney(exclTotalVal), x, y + cellPad, { width: colW.exclTotal, align: 'right' }); x += colW.exclTotal;
    doc.font('Helvetica-Bold').text(formatMoney(inclTotal), x, y + cellPad, { width: colW.inclTotal, align: 'right' });
    doc.font('Helvetica');
    y += rowH;
  }

  if (items.length === 0) {
    doc.rect(left, y, tableW, minRowH).stroke('#dddddd');
    doc.fontSize(9).fillColor('#9ca3af').font('Helvetica').text('No line items', left + 8, y + 8);
    y += minRowH;
  }

  y += 20;

  // ─── Totals (right-aligned, label and value bold) ───
  const totalsW = 200;
  const totalsX = right - totalsW;
  const lineH = 14;
  doc.fontSize(10).fillColor('#111827').font('Helvetica-Bold');
  doc.text('Total exclusive: ' + formatMoney(invoice?.subtotal), totalsX, y, { width: totalsW, align: 'right' });
  y += lineH;
  doc.text('Total tax: ' + formatMoney(invoice?.taxAmount), totalsX, y, { width: totalsW, align: 'right' });
  y += lineH;
  doc.text('Total: ' + formatMoney(invoice?.totalAmount), totalsX, y, { width: totalsW, align: 'right' });
  y += lineH;
  doc.text('Total due: ' + formatMoney(invoice?.balanceDue ?? invoice?.totalAmount), totalsX, y, { width: totalsW, align: 'right' });

  // ─── Footer: EFT payment instructions (bottom left), Page number (bottom right) ───
  const footerY = PAGE_HEIGHT - SAFE_BOTTOM - 58;
  if (hasBankDetails(s)) {
    doc.fontSize(10).fillColor('#374151').font('Helvetica');
    doc.text('If making an EFT payment, please use your Account Code [', left, footerY, { continued: true });
    doc.font('Helvetica-Bold').text(clientCode, { continued: true });
    doc.font('Helvetica').text('] as payment reference.');
    let fy = footerY + 14;
    if (s.accountNumber) {
      doc.font('Helvetica-Bold').text('Account number: ', left, fy, { continued: true });
      doc.font('Helvetica').text(s.accountNumber);
      fy += 12;
    }
    if (s.bankName) {
      doc.font('Helvetica-Bold').text('Bank: ', left, fy, { continued: true });
      doc.font('Helvetica').text(s.bankName);
      fy += 12;
    }
    if (s.branchCode) {
      doc.font('Helvetica-Bold').text('Branch: ', left, fy, { continued: true });
      doc.font('Helvetica').text(s.branchCode);
    }
  }
  doc.fontSize(9).fillColor('#64748b').font('Helvetica');
  doc.text('Page 1', right, PAGE_HEIGHT - SAFE_BOTTOM, { align: 'right' });

  doc.end();
  return docToBuffer(doc);
}

// ─── Statement PDF ───────────────────────────────────────────────────────────
async function generateStatementPdfBuffer(statement) {
  const doc = new PDFDocument({ margin: 0, size: 'A4' });
  let y = await renderHeader(doc, 'STATEMENT');

  doc.fontSize(10).fillColor(COLORS.text);

  const clientName = String(
    `${statement.client?.companyName || ''} ${statement.client?.contactName || ''}`.trim()
  ).trim() || '—';

  doc.fontSize(9).fillColor(COLORS.textMuted).text('CLIENT', MARGIN, y);
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor(COLORS.text).text(clientName, MARGIN, doc.y, { width: 250 });
  if (statement.client?.email) {
    doc.fontSize(9).fillColor(COLORS.textMuted).text(statement.client.email, MARGIN, doc.y + 2, {
      width: 250,
    });
  }

  const rightX = PAGE_WIDTH - MARGIN - 180;
  doc.fontSize(9).fillColor(COLORS.textMuted).text('Statement Period', rightX, y);
  doc.fontSize(10).fillColor(COLORS.text).text(
    `${statement.range?.from ? safeDateISO(statement.range.from) : 'All'} — ${statement.range?.to ? safeDateISO(statement.range.to) : 'All'}`,
    rightX,
    y + 14,
    { width: 170 }
  );
  doc.fontSize(9).fillColor(COLORS.textMuted).text('Opening Balance', rightX, y + 38);
  doc.fontSize(10).fillColor(COLORS.text).text(
    formatMoney(statement.openingBalance),
    rightX,
    y + 52,
    { width: 170 }
  );
  doc.fontSize(9).fillColor(COLORS.textMuted).text('Loan Balance', rightX, y + 66);
  doc.fontSize(10).fillColor(COLORS.text).text(
    formatMoney(statement.loansSummary?.outstandingLoanBalance || 0),
    rightX,
    y + 80,
    { width: 170 }
  );
  doc.fontSize(9).fillColor(COLORS.textMuted).text('Closing Balance', rightX, y + 94);
  doc.fontSize(11).fillColor(COLORS.primary).text(
    formatMoney(statement.closingBalance),
    rightX,
    y + 108,
    { width: 170 }
  );

  y += 132;

  // Ledger table
  const tableTop = y;
  const headerH = 26;
  const rowH = 20;

  doc.rect(MARGIN, tableTop, CONTENT_WIDTH, headerH).fill(COLORS.bgHeader);
  doc.rect(MARGIN, tableTop, CONTENT_WIDTH, headerH).stroke(COLORS.border);

  const colW = [75, 70, 100, 75, 75, 95];
  let x = MARGIN + 10;
  doc.fontSize(9).fillColor(COLORS.textMuted);
  doc.text('Date', x, tableTop + 8);
  x += colW[0];
  doc.text('Type', x, tableTop + 8);
  x += colW[1];
  doc.text('Reference', x, tableTop + 8);
  x += colW[2];
  doc.text('Debit', x, tableTop + 8);
  x += colW[3];
  doc.text('Credit', x, tableTop + 8);
  x += colW[4];
  doc.text('Balance', x, tableTop + 8);

  const ledger = statement.ledger || [];
  let rowY = tableTop + headerH;

  for (let i = 0; i < ledger.length; i++) {
    const row = ledger[i];
    doc.rect(MARGIN, rowY, CONTENT_WIDTH, rowH).stroke(COLORS.border);
    x = MARGIN + 10;
    const dateStr = row.date ? safeDateISO(row.date) : '—';
    doc.fontSize(9).fillColor(COLORS.text);
    doc.text(safeDateISO(row.date), x, rowY + 7, { width: colW[0] - 8 });
    x += colW[0];
    doc.text(String(row.reference || '—'), x, rowY + 7, { width: colW[1] - 8 });
    x += colW[1];
    const desc = statementRowDescription(row);
    doc.text(desc, x, rowY + 7, { width: colW[2] - 8 });
    x += colW[2];
    doc.text(Number(row.debit || 0) > 0 ? formatMoney(row.debit) : '—', x, rowY + 7, { width: colW[3] - 8, align: 'right' });
    x += colW[3];
    doc.text(Number(row.credit || 0) > 0 ? formatMoney(row.credit) : '—', x, rowY + 7, { width: colW[4] - 8, align: 'right' });
    x += colW[4];
    doc.text(formatMoney(row.runningBalance), x, rowY + 5);
    rowY += rowH;
  }

  doc.rect(MARGIN, rowY, CONTENT_WIDTH, rowH).stroke(COLORS.border);

  // Footer
  doc.fontSize(8).fillColor(COLORS.textMuted);
  doc.text(
    'Generated by Bretune Accounting · Client Statement',
    MARGIN,
    PAGE_HEIGHT - SAFE_BOTTOM,
    { align: 'center', width: CONTENT_WIDTH }
  );

  doc.end();
  return docToBuffer(doc);
}

// ─── Quote PDF ───────────────────────────────────────────────────────────────
async function generateQuotePdfBuffer(quote, companySettings = {}) {
  const doc = new PDFDocument({ margin: 0, size: 'A4' });
  let y = MARGIN;

  const quoteRef = String(quote?.quoteNumber || quote?.quoteSeq || quote?.id || '').trim() || '—';

  const companyName = String(quote?.user?.companyName || '').trim() || 'Company';
  const clientName = String(
    `${quote?.client?.companyName || ''} ${quote?.client?.contactName || ''}`.trim()
  ).trim() || '—';

  const logoSize = 72;
  const logoPath = getLogoPath();
  const fs = require('fs');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, MARGIN, y, { width: logoSize, height: logoSize });
  } else {
    doc.rect(MARGIN, y, logoSize, logoSize).fill('#eeeeee');
  }
  const compNameSize = 12;
  const compDetailSize = 9;
  const compDetailColor = '#6B7280';
  doc.fontSize(compNameSize).fillColor('#111827').font('Helvetica-Bold').text(companyName, MARGIN + logoSize + 14, y + 4);

  doc.fontSize(compDetailSize).fillColor(compDetailColor).font('Helvetica');
  const compTextW = 200;
  const compLineH = 10;
  let compY = y + 18;
  const s = companySettings || {};
  const addrParts = [s.addressLine, s.city, s.country].filter(Boolean);
  if (addrParts.length) {
    addrParts.forEach((p) => {
      doc.text(String(p), MARGIN + logoSize + 14, compY, { width: compTextW });
      compY = doc.y + compLineH;
    });
  }
  if (s.businessPhone) {
    doc.text('Phone: ' + s.businessPhone, MARGIN + logoSize + 14, compY, { width: compTextW });
    compY = doc.y + compLineH;
  }
  if (s.businessEmail) {
    doc.text('Email: ' + s.businessEmail, MARGIN + logoSize + 14, compY, { width: compTextW });
    compY = doc.y + compLineH;
  }

  y = compY + 16;

  doc.moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).stroke('#E5E7EB');
  y += 16;

  doc.fontSize(14).fillColor('#111827').font('Helvetica-Bold').text('QUOTE', MARGIN, y);
  y += 20;

  const gap = 24;
  const sharedWidth = CONTENT_WIDTH - gap;
  const custColW = Math.floor(sharedWidth * 0.65);
  const invColW = sharedWidth - custColW;
  const boxPad = 14;
  const custBoxW = custColW - boxPad * 2;
  const invBoxW = invColW - boxPad * 2;
  const lineSpacing = 10;
  const headerBarH = 20;

  const clientAddr = [quote?.client?.address, quote?.client?.city, quote?.client?.state, quote?.client?.postalCode, quote?.client?.country].filter(Boolean);
  const clientPhone = quote?.client?.phone || quote?.client?.mobile;
  const clientEmails = [quote?.client?.email].filter(Boolean);
  const opts = { width: custBoxW, lineGap: 4 };
  const contactLine = clientPhone && quote?.client?.contactName
    ? `Contact: ${clientPhone} - ${quote.client.contactName}`
    : quote?.client?.contactName
      ? `Contact: ${quote.client.contactName}`
      : clientPhone ? `Contact: ${clientPhone}` : null;

  doc.fontSize(12).font('Helvetica-Bold');
  let contentH = 14 + doc.heightOfString(clientName, opts);
  doc.fontSize(9).font('Helvetica');
  clientAddr.forEach((p) => { contentH += doc.heightOfString(String(p), opts) + lineSpacing; });
  if (contactLine) contentH += doc.heightOfString(contactLine, opts) + lineSpacing;
  if (clientEmails.length) contentH += doc.heightOfString('Email: ' + clientEmails.join(' '), opts) + 6;
  const custBoxH = Math.max(95, headerBarH + contentH);

  doc.rect(MARGIN, y, custColW, custBoxH).fill('#F8F9FB');
  doc.rect(MARGIN, y, custColW, custBoxH).stroke('#E5E7EB');
  doc.rect(MARGIN, y, custColW, headerBarH).fill('#E5E7EB');
  doc.fontSize(9).fillColor('#111827').font('Helvetica-Bold').text('Customer Information', MARGIN + boxPad, y + 5);

  let custY = y + headerBarH + 4;
  doc.fontSize(12).fillColor('#111827').font('Helvetica-Bold').text(clientName, MARGIN + boxPad, custY, opts);
  custY = doc.y + lineSpacing;
  doc.fontSize(9).fillColor('#6B7280').font('Helvetica');
  clientAddr.forEach((p) => {
    doc.text(String(p), MARGIN + boxPad, custY, opts);
    custY = doc.y + lineSpacing;
  });
  if (contactLine) {
    doc.text(contactLine, MARGIN + boxPad, custY, opts);
    custY = doc.y + lineSpacing;
  }
  if (clientEmails.length) {
    doc.text('Email: ' + clientEmails.join(' '), MARGIN + boxPad, custY, opts);
  }

  const invBoxX = MARGIN + custColW + gap;
  doc.rect(invBoxX, y, invColW, custBoxH).fill('#F8F9FB');
  doc.rect(invBoxX, y, invColW, custBoxH).stroke('#E5E7EB');
  doc.rect(invBoxX, y, invColW, headerBarH).fill('#E5E7EB');
  doc.fontSize(9).fillColor('#111827').font('Helvetica-Bold').text('Invoice Information', invBoxX + boxPad, y + 5);
  doc.fontSize(9).fillColor('#6B7280').font('Helvetica');
  let invY = y + headerBarH + 10;
  doc.text('Quote #: ' + quoteRef, invBoxX + boxPad, invY, { width: invBoxW });
  invY += 14;
  doc.text('Date: ' + safeDateISO(quote?.issueDate), invBoxX + boxPad, invY);
  invY += 14;
  doc.text('Expiry: ' + safeDateISO(quote?.expiryDate), invBoxX + boxPad, invY);
  invY += 14;
  doc.text('Status: ' + String(quote?.status || '—').toUpperCase(), invBoxX + boxPad, invY, { width: invBoxW });

  y += custBoxH + 28;

  // Line items table
  const tableW = CONTENT_WIDTH;
  const codeW = 58;
  const unitW = 65;
  const vatW = 38;
  const qtyW = 32;
  const totalW = 68;
  const descW = tableW - codeW - unitW - vatW - qtyW - totalW;

  const headerH = 24;
  const tableStartY = y;
  const totalsRowH = 18;
  const contentBottom = PAGE_HEIGHT - SAFE_BOTTOM - 95;
  const availableTableHeight = contentBottom - tableStartY - headerH - totalsRowH * 3 - 8;

  doc.rect(MARGIN, y, tableW, headerH).fill('#F8F9FB');
  doc.rect(MARGIN, y, tableW, headerH).stroke('#E5E7EB');
  doc.fontSize(9).fillColor('#374151').font('Helvetica-Bold');
  doc.text('Code', MARGIN + 8, y + 8, { width: codeW - 8 });
  doc.text('Description', MARGIN + codeW + 8, y + 8, { width: descW - 16 });
  doc.text('Unit Price', MARGIN + codeW + descW, y + 8, { width: unitW, align: 'right' });
  doc.text('VAT%', MARGIN + codeW + descW + unitW, y + 8, { width: vatW, align: 'right' });
  doc.text('Qty', MARGIN + codeW + descW + unitW + vatW, y + 8, { width: qtyW, align: 'right' });
  doc.text('TOTAL', MARGIN + codeW + descW + unitW + vatW + qtyW, y + 8, { width: totalW, align: 'right' });
  y += headerH;

  const items = quote?.items || [];
  const minRowH = 22;
  const cellPad = 8;

  const naturalHeights = [];
  doc.fontSize(9).font('Helvetica');
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const descStr = String(item?.description || item?.product?.name || '—');
    const desc = descStr.slice(0, 120);
    const descH = doc.heightOfString(desc, { width: descW - 20, lineGap: 4 });
    naturalHeights.push(Math.max(minRowH, descH + cellPad * 2));
  }
  if (items.length === 0) naturalHeights.push(minRowH);

  const totalNaturalH = naturalHeights.reduce((a, b) => a + b, 0);
  const rowsToFill = Math.max(1, naturalHeights.length - 1);
  const extraPerRow = 0;
  void availableTableHeight;
  void totalNaturalH;
  void rowsToFill;

  const displayItems = items.length ? items : [{}];
  for (let i = 0; i < displayItems.length; i++) {
    const item = displayItems[i];
    const sku = item?.product?.sku?.trim();
    const descStr = String(item?.description || item?.product?.name || '—');
    const code = (sku && sku.length <= 12 && !/^[a-z]{7,}$/.test(sku) ? sku : descStr.slice(0, 10).trim()) || '—';
    const desc = descStr.slice(0, 120);
    const vatPct = Math.round((Number(item?.taxRate || 0) * 100));

    const isLastItem = i === displayItems.length - 1;
    const rowH = naturalHeights[i] + (isLastItem ? 0 : extraPerRow);

    const bg = i % 2 === 0 ? '#ffffff' : '#F8F9FB';
    doc.rect(MARGIN, y, tableW, rowH).fill(bg);
    doc.fontSize(9).fillColor('#111827').font('Helvetica');
    doc.text(code, MARGIN + 8, y + cellPad, { width: codeW - 12, ellipsis: true });
    doc.text(desc, MARGIN + codeW + 8, y + cellPad, { width: descW - 20, lineGap: 4 });
    doc.text(formatMoney(item?.unitPrice), MARGIN + codeW + descW, y + cellPad, { width: unitW, align: 'right' });
    doc.text(String(vatPct), MARGIN + codeW + descW + unitW, y + cellPad, { width: vatW, align: 'right' });
    doc.text(String(item?.quantity ?? '—'), MARGIN + codeW + descW + unitW + vatW, y + cellPad, { width: qtyW, align: 'right' });
    doc.text(formatMoney(item?.total), MARGIN + codeW + descW + unitW + vatW + qtyW, y + cellPad, { width: totalW, align: 'right' });
    y += rowH;
  }

  doc.rect(MARGIN, y, tableW, totalsRowH).fill('#F8F9FB');
  doc.rect(MARGIN, y, tableW, totalsRowH).stroke('#E5E7EB');
  doc.fontSize(9).fillColor('#6B7280').font('Helvetica');
  doc.text('Sub Total (Excl. VAT)', MARGIN + codeW + 8, y + 6, { width: descW - 16 });
  doc.text(formatMoney(quote?.subtotal), MARGIN + codeW + descW + unitW + vatW + qtyW, y + 6, { width: totalW, align: 'right' });
  y += totalsRowH;

  doc.rect(MARGIN, y, tableW, totalsRowH).fill('#F8F9FB');
  doc.rect(MARGIN, y, tableW, totalsRowH).stroke('#E5E7EB');
  doc.text('Total VAT', MARGIN + codeW + 8, y + 6, { width: descW - 16 });
  doc.text(formatMoney(quote?.taxAmount), MARGIN + codeW + descW + unitW + vatW + qtyW, y + 6, { width: totalW, align: 'right' });
  y += totalsRowH;

  doc.rect(MARGIN, y, tableW, totalsRowH).fill('#E5E7EB');
  doc.rect(MARGIN, y, tableW, totalsRowH).stroke('#E5E7EB');
  doc.fontSize(10).fillColor('#111827').font('Helvetica-Bold');
  doc.text('Quote Total', MARGIN + codeW + 8, y + 6, { width: descW - 16 });
  doc.text(formatMoney(quote?.totalAmount), MARGIN + codeW + descW + unitW + vatW + qtyW, y + 6, { width: totalW, align: 'right' });
  y += totalsRowH + 16;

  // Bank details - fixed at bottom of page
  renderBankDetailsAtBottom(doc, companySettings, null, true);

  doc.fontSize(9).fillColor('#9CA3AF').font('Helvetica');
  doc.text(
    'Thank you for your business',
    MARGIN,
    PAGE_HEIGHT - SAFE_BOTTOM - 4,
    { align: 'center', width: CONTENT_WIDTH }
  );

  doc.end();
  return docToBuffer(doc);
}

module.exports = {
  generateStatementPdfBuffer,
  generateInvoicePdfBuffer,
  generateQuotePdfBuffer,
};
