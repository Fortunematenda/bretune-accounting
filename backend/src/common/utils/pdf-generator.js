 const path = require('path');
const PDFDocument = require('pdfkit');

// Modern Brand Colors
const COLORS = {
  primary: '#6366f1',      // Indigo 500 - modern primary
  primaryDark: '#4f46e5',  // Indigo 600
  primaryLight: '#e0e7ff', // Indigo 100
  text: '#1e293b',         // Slate 800
  textMuted: '#64748b',    // Slate 500
  textLight: '#94a3b8',    // Slate 400
  border: '#e2e8f0',       // Slate 200
  borderLight: '#f1f5f9',  // Slate 100
  bg: '#f8fafc',           // Slate 50
  white: '#ffffff',
  success: '#10b981',      // Emerald 500
  accent: '#f59e0b',       // Amber 500
};

const MARGIN = 50;
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const SAFE_BOTTOM = 60;

// Modern Typography
const FONTS = {
  heading: 'Helvetica-Bold',
  body: 'Helvetica',
  bodyBold: 'Helvetica-Bold',
  light: 'Helvetica-Oblique',
};

const SIZES = {
  title: 28,
  subtitle: 16,
  heading: 11,
  body: 9,
  small: 8,
  tiny: 7,
};

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

function formatDateFriendly(value) {
  try {
    const d = value instanceof Date ? value : new Date(value);
    if (!d || Number.isNaN(d.getTime())) return '—';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('en-GB', options);
  } catch {
    return '—';
  }
}

function formatMoney(value, currency = 'R') {
  if (value == null || value === '') return '—';
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return currency + ' ' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

function hasBankDetails(settings) {
  if (!settings || typeof settings !== 'object') return false;
  const s = (v) => (v && String(v).trim()) || '';
  return !!(s(settings.bankName) || s(settings.accountNumber) || s(settings.accountName));
}

// Modern rounded rectangle helper
function drawRoundedRect(doc, x, y, width, height, radius, options = {}) {
  const r = Math.min(radius, width / 2, height / 2);
  doc.save();
  
  if (options.fill) {
    doc.fillColor(options.fill);
  }
  if (options.stroke) {
    doc.strokeColor(options.stroke);
    doc.lineWidth(options.lineWidth || 1);
  }

  doc.moveTo(x + r, y);
  doc.lineTo(x + width - r, y);
  doc.quadraticCurveTo(x + width, y, x + width, y + r);
  doc.lineTo(x + width, y + height - r);
  doc.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  doc.lineTo(x + r, y + height);
  doc.quadraticCurveTo(x, y + height, x, y + height - r);
  doc.lineTo(x, y + r);
  doc.quadraticCurveTo(x, y, x + r, y);
  doc.closePath();

  if (options.fill && options.stroke) {
    doc.fillAndStroke();
  } else if (options.fill) {
    doc.fill();
  } else if (options.stroke) {
    doc.stroke();
  }
  
  doc.restore();
}

// Draw subtle separator line
function drawSeparator(doc, x, y, width, color = COLORS.border) {
  doc.save();
  doc.strokeColor(color);
  doc.lineWidth(0.5);
  doc.moveTo(x, y);
  doc.lineTo(x + width, y);
  doc.stroke();
  doc.restore();
}

// ─── Modern Invoice PDF ────────────────────────────────────────────────────
async function generateInvoicePdfBuffer(invoice, companySettings = {}) {
  const doc = new PDFDocument({ 
    margin: 0, 
    size: 'A4',
    info: {
      Title: `Invoice ${invoice?.invoiceNumber || ''}`,
      Author: companySettings?.companyName || 'Bretune Accounting',
    }
  });
  
  const fs = require('fs');
  const s = companySettings || {};
  
  // Header band with primary color
  doc.rect(0, 0, PAGE_WIDTH, 140).fill(COLORS.primary);
  doc.rect(0, 140, PAGE_WIDTH, 3).fill(COLORS.primaryLight);
  
  let y = MARGIN;
  
  const logoPath = getCompanyLogoPath(s);
  const leftCol = MARGIN;
  const rightCol = PAGE_WIDTH - MARGIN - 200;
  
  // Left: Logo + Company
  if (logoPath) {
    try {
      doc.image(logoPath, leftCol, y - 20, { width: 70, height: 70 });
    } catch { 
      doc.fontSize(SIZES.title).fillColor(COLORS.white).font(FONTS.heading).text(s.companyName || 'Bretune', leftCol, y);
    }
  } else {
    doc.fontSize(SIZES.title).fillColor(COLORS.white).font(FONTS.heading).text(s.companyName || 'Bretune', leftCol, y);
  }
  
  // Company details under logo
  let companyY = y + 50;
  doc.fontSize(SIZES.small).fillColor('rgba(255,255,255,0.9)').font(FONTS.body);
  if (s.tagline || s.slogan) {
    doc.text(s.tagline || s.slogan, leftCol, companyY);
    companyY += 12;
  }
  if (s.businessEmail) {
    doc.text(s.businessEmail, leftCol, companyY);
    companyY += 12;
  }
  if (s.businessPhone) {
    doc.text(s.businessPhone, leftCol, companyY);
  }
  
  // Right: Document Type
  const invoiceRef = invoice?.invoiceNumber || `INV-${String(invoice?.invoiceSeq || 0).padStart(4, '0')}`;
  doc.fontSize(32).fillColor(COLORS.white).font(FONTS.heading).text('INVOICE', rightCol, y - 10, { align: 'right' });
  doc.fontSize(SIZES.subtitle).fillColor('rgba(255,255,255,0.85)').font(FONTS.body).text(`#${invoiceRef}`, rightCol, y + 30, { align: 'right' });
  
  // Main content area
  y = 170;
  
  // Two column layout: Bill To | Invoice Details
  const colWidth = (CONTENT_WIDTH - 30) / 2;
  
  // Bill To Section
  drawRoundedRect(doc, MARGIN, y, colWidth, 110, 8, { fill: COLORS.bg, stroke: COLORS.border });
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight).font(FONTS.bodyBold).text('BILL TO', MARGIN + 15, y + 12);
  drawSeparator(doc, MARGIN + 15, y + 26, colWidth - 30, COLORS.border);
  
  const clientName = `${invoice?.client?.companyName || ''} ${invoice?.client?.contactName || ''}`.trim() || '—';
  doc.fontSize(SIZES.heading).fillColor(COLORS.text).font(FONTS.heading).text(clientName, MARGIN + 15, y + 35);
  
  doc.fontSize(SIZES.body).fillColor(COLORS.textMuted).font(FONTS.body);
  let clientY = y + 55;
  const clientCode = getClientAccountCode(invoice?.client);
  doc.text(`Account: ${clientCode}`, MARGIN + 15, clientY);
  clientY += 14;
  
  if (invoice?.client?.email) {
    doc.text(invoice.client.email, MARGIN + 15, clientY);
    clientY += 14;
  }
  const clientAddr = [invoice?.client?.address, invoice?.client?.city].filter(Boolean);
  if (clientAddr.length) {
    doc.text(clientAddr.join(', '), MARGIN + 15, clientY);
  }
  
  // Invoice Details Section
  const detailsX = MARGIN + colWidth + 30;
  drawRoundedRect(doc, detailsX, y, colWidth, 110, 8, { fill: COLORS.white, stroke: COLORS.border });
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight).font(FONTS.bodyBold).text('INVOICE DETAILS', detailsX + 15, y + 12);
  drawSeparator(doc, detailsX + 15, y + 26, colWidth - 30, COLORS.border);
  
  const details = [
    { label: 'Issue Date:', value: formatDateFriendly(invoice?.issueDate) },
    { label: 'Due Date:', value: formatDateFriendly(invoice?.dueDate) },
    { label: 'Status:', value: invoice?.status || 'Draft' },
  ];
  
  let detailY = y + 35;
  doc.fontSize(SIZES.body).font(FONTS.body);
  details.forEach(({ label, value }) => {
    doc.fillColor(COLORS.textLight).text(label, detailsX + 15, detailY, { width: 70 });
    doc.fillColor(COLORS.text).font(FONTS.bodyBold).text(value, detailsX + 90, detailY, { width: colWidth - 105 });
    doc.font(FONTS.body);
    detailY += 16;
  });
  
  y += 130;
  
  // Line Items Table - Modern Style
  const tableY = y;
  const tableWidth = CONTENT_WIDTH;
  const headerHeight = 36;
  
  // Better column widths - wider description, narrower number columns
  const colWidths = [30, 240, 45, 65, 45, 65, 70];
  const colX = [0];
  for (let i = 0; i < colWidths.length - 1; i++) {
    colX.push(colX[i] + colWidths[i]);
  }
  
  // Table header with primary color
  drawRoundedRect(doc, MARGIN, tableY, tableWidth, headerHeight, 6, { fill: COLORS.primary });
  
  const headers = ['#', 'Description', 'Qty', 'Unit Price', 'VAT %', 'Excl.', 'Total'];
  doc.fontSize(SIZES.body).fillColor(COLORS.white).font(FONTS.bodyBold);
  headers.forEach((header, i) => {
    const x = MARGIN + colX[i] + (i === 0 ? 8 : i === headers.length - 1 ? -5 : 0);
    const align = i >= 2 ? 'right' : 'left';
    const width = colWidths[i] - (i === 0 ? 8 : i === headers.length - 1 ? 5 : 5);
    doc.text(header, x, tableY + 12, { width, align });
  });
  
  // Table rows with dynamic height
  const items = invoice?.items || [];
  let currentY = tableY + headerHeight;
  const cellPad = 8;
  const minRowHeight = 32;
  const maxDescLines = 3;
  const descLineHeight = 11;
  
  items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const bgColor = isEven ? COLORS.white : COLORS.bg;
    
    // Calculate description height
    const descText = String(item?.description || item?.product?.name || '—');
    doc.fontSize(SIZES.body).font(FONTS.body);
    const descWidth = colWidths[1] - 10;
    const descHeight = Math.min(
      doc.heightOfString(descText, { width: descWidth, lineGap: 2 }),
      maxDescLines * descLineHeight
    );
    const rowHeight = Math.max(minRowHeight, descHeight + cellPad * 2);
    
    // Row background
    drawRoundedRect(doc, MARGIN, currentY, tableWidth, rowHeight, 0, { fill: bgColor });
    
    // Row data
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.body);
    const qty = Number(item?.quantity ?? 0);
    const unitPrice = Number(item?.unitPrice ?? 0);
    const taxRate = Number(item?.taxRate ?? 0);
    const inclTotal = Number(item?.total ?? 0);
    const exclTotal = taxRate > 0 ? inclTotal / (1 + taxRate) : inclTotal;
    const vatPct = (taxRate * 100).toFixed(0);
    
    const textY = currentY + (rowHeight - descHeight) / 2;
    
    // Item number
    doc.text(String(index + 1), MARGIN + colX[0] + 8, textY);
    
    // Description (with wrapping)
    doc.text(descText, MARGIN + colX[1], textY, { 
      width: descWidth, 
      lineGap: 2,
      ellipsis: true
    });
    
    // Qty
    doc.text(String(qty), MARGIN + colX[2], textY, { width: colWidths[2] - 5, align: 'right' });
    
    // Unit Price
    doc.text(formatMoney(unitPrice), MARGIN + colX[3], textY, { width: colWidths[3] - 5, align: 'right' });
    
    // VAT %
    doc.text(vatPct + '%', MARGIN + colX[4], textY, { width: colWidths[4] - 5, align: 'right' });
    
    // Excl. total
    doc.text(formatMoney(exclTotal), MARGIN + colX[5], textY, { width: colWidths[5] - 5, align: 'right' });
    
    // Incl. total (bold)
    doc.font(FONTS.bodyBold).text(formatMoney(inclTotal), MARGIN + colX[6], textY, { width: colWidths[6] - 5, align: 'right' });
    doc.font(FONTS.body);
    
    // Subtle row separator
    drawSeparator(doc, MARGIN + 10, currentY + rowHeight - 1, tableWidth - 20, COLORS.borderLight);
    
    currentY += rowHeight;
  });
  
  if (items.length === 0) {
    const emptyRowHeight = 32;
    drawRoundedRect(doc, MARGIN, currentY, tableWidth, emptyRowHeight, 0, { fill: COLORS.bg });
    doc.fontSize(SIZES.body).fillColor(COLORS.textLight).font(FONTS.light)
       .text('No line items', MARGIN + 20, currentY + 10);
    currentY += emptyRowHeight;
  }
  
  // Table bottom border
  drawRoundedRect(doc, MARGIN, currentY, tableWidth, 3, 0, { fill: COLORS.primary });
  
  // Totals Section
  y = currentY + 25;
  const totalsX = PAGE_WIDTH - MARGIN - 220;
  
  const totals = [
    { label: 'Subtotal (Excl. VAT):', value: formatMoney(invoice?.subtotal), bold: false },
    { label: 'VAT Amount:', value: formatMoney(invoice?.taxAmount), bold: false },
  ];
  
  if (invoice?.discount > 0) {
    totals.push({ label: 'Discount:', value: '-' + formatMoney(invoice.discount), bold: false });
  }
  
  totals.forEach(({ label, value, bold }) => {
    doc.fontSize(SIZES.body).fillColor(COLORS.textMuted).font(FONTS.body).text(label, totalsX, y, { width: 130, align: 'right' });
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(bold ? FONTS.bodyBold : FONTS.body).text(value, totalsX + 140, y, { width: 80, align: 'right' });
    y += 18;
  });
  
  // Total Due - Highlighted
  y += 5;
  drawRoundedRect(doc, totalsX - 10, y - 5, 230, 35, 6, { fill: COLORS.primaryLight, stroke: COLORS.primary });
  doc.fontSize(SIZES.heading).fillColor(COLORS.primaryDark).font(FONTS.heading).text('Total Due:', totalsX, y + 5, { width: 130, align: 'right' });
  doc.fontSize(SIZES.heading + 2).fillColor(COLORS.primary).font(FONTS.heading).text(formatMoney(invoice?.balanceDue ?? invoice?.totalAmount), totalsX + 140, y + 3, { width: 80, align: 'right' });
  
  y += 50;
  
  // Payment Section (if bank details exist)
  if (hasBankDetails(s)) {
    drawRoundedRect(doc, MARGIN, y, CONTENT_WIDTH, 90, 8, { fill: COLORS.bg, stroke: COLORS.border });
    doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight).font(FONTS.bodyBold).text('PAYMENT INFORMATION', MARGIN + 15, y + 12);
    drawSeparator(doc, MARGIN + 15, y + 26, CONTENT_WIDTH - 30, COLORS.border);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.textMuted).font(FONTS.body);
    let payY = y + 35;
    const payCol1 = MARGIN + 15;
    const payCol2 = MARGIN + 200;
    const payCol3 = MARGIN + 380;
    
    if (s.bankName) {
      doc.text('Bank:', payCol1, payY);
      doc.fillColor(COLORS.text).font(FONTS.bodyBold).text(s.bankName, payCol1 + 50, payY);
      doc.font(FONTS.body).fillColor(COLORS.textMuted);
    }
    if (s.accountName) {
      doc.text('Account Name:', payCol2, payY);
      doc.fillColor(COLORS.text).font(FONTS.bodyBold).text(s.accountName, payCol2 + 75, payY);
      doc.font(FONTS.body).fillColor(COLORS.textMuted);
    }
    payY += 18;
    
    if (s.accountNumber) {
      doc.text('Account #:', payCol1, payY);
      doc.fillColor(COLORS.text).font(FONTS.bodyBold).text(s.accountNumber, payCol1 + 55, payY);
      doc.font(FONTS.body).fillColor(COLORS.textMuted);
    }
    if (s.branchCode) {
      doc.text('Branch Code:', payCol2, payY);
      doc.fillColor(COLORS.text).font(FONTS.bodyBold).text(s.branchCode, payCol2 + 70, payY);
    }
    
    doc.fontSize(SIZES.small).fillColor(COLORS.textLight).font(FONTS.light)
       .text(`Please use reference: ${clientCode} when making payment`, MARGIN + 15, y + 70);
  }
  
  // Footer
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight).font(FONTS.body)
     .text('Thank you for your business', PAGE_WIDTH / 2, PAGE_HEIGHT - SAFE_BOTTOM, { align: 'center' });
  
  // Page number
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight)
     .text('Page 1', PAGE_WIDTH - MARGIN - 30, PAGE_HEIGHT - SAFE_BOTTOM);
  
  doc.end();
  return docToBuffer(doc);
}

// ─── Modern Statement PDF ────────────────────────────────────────────────────
async function generateStatementPdfBuffer(statement) {
  const doc = new PDFDocument({ 
    margin: 0, 
    size: 'A4',
    info: {
      Title: 'Client Statement',
      Author: 'Bretune Accounting',
    }
  });
  
  // Header
  doc.rect(0, 0, PAGE_WIDTH, 100).fill(COLORS.primary);
  doc.rect(0, 100, PAGE_WIDTH, 3).fill(COLORS.primaryLight);
  
  let y = MARGIN;
  
  doc.fontSize(28).fillColor(COLORS.white).font(FONTS.heading).text('STATEMENT', MARGIN, y);
  doc.fontSize(SIZES.body).fillColor('rgba(255,255,255,0.8)').font(FONTS.body)
     .text('Account Summary', MARGIN, y + 35);
  
  // Client info in header right
  const clientName = `${statement.client?.companyName || ''} ${statement.client?.contactName || ''}`.trim() || '—';
  doc.fontSize(SIZES.heading).fillColor(COLORS.white).font(FONTS.heading).text(clientName, PAGE_WIDTH - MARGIN - 250, y, { width: 250, align: 'right' });
  
  y = 120;
  
  // Period and balances summary
  drawRoundedRect(doc, MARGIN, y, CONTENT_WIDTH, 80, 8, { fill: COLORS.bg, stroke: COLORS.border });
  
  const period = `${statement.range?.from ? formatDateFriendly(statement.range.from) : 'All time'} — ${statement.range?.to ? formatDateFriendly(statement.range.to) : 'Present'}`;
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight).font(FONTS.bodyBold).text('STATEMENT PERIOD', MARGIN + 20, y + 15);
  doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.body).text(period, MARGIN + 20, y + 32);
  
  // Balance boxes
  const boxWidth = 130;
  const boxY = y + 15;
  
  drawRoundedRect(doc, PAGE_WIDTH - MARGIN - 420, boxY, boxWidth, 50, 6, { fill: COLORS.white, stroke: COLORS.border });
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight).text('OPENING', PAGE_WIDTH - MARGIN - 410, boxY + 8, { width: 110, align: 'center' });
  doc.fontSize(SIZES.heading).fillColor(COLORS.text).font(FONTS.heading).text(formatMoney(statement.openingBalance), PAGE_WIDTH - MARGIN - 410, boxY + 22, { width: 110, align: 'center' });
  
  drawRoundedRect(doc, PAGE_WIDTH - MARGIN - 280, boxY, boxWidth, 50, 6, { fill: COLORS.primaryLight, stroke: COLORS.primary });
  doc.fontSize(SIZES.tiny).fillColor(COLORS.primary).text('CLOSING', PAGE_WIDTH - MARGIN - 270, boxY + 8, { width: 110, align: 'center' });
  doc.fontSize(SIZES.heading).fillColor(COLORS.primaryDark).font(FONTS.heading).text(formatMoney(statement.closingBalance), PAGE_WIDTH - MARGIN - 270, boxY + 22, { width: 110, align: 'center' });
  
  y += 100;
  
  // Transactions table
  const tableY = y;
  const tableWidth = CONTENT_WIDTH;
  const rowHeight = 28;
  const headerHeight = 32;
  
  drawRoundedRect(doc, MARGIN, tableY, tableWidth, headerHeight, 6, { fill: COLORS.primary });
  
  const headers = ['Date', 'Reference', 'Description', 'Debit', 'Credit', 'Balance'];
  const colWidths = [70, 80, 190, 65, 65, 65];
  const colX = [0];
  for (let i = 0; i < colWidths.length - 1; i++) {
    colX.push(colX[i] + colWidths[i]);
  }
  
  doc.fontSize(SIZES.body).fillColor(COLORS.white).font(FONTS.bodyBold);
  headers.forEach((header, i) => {
    const x = MARGIN + colX[i] + 10;
    const align = i >= 3 ? 'right' : 'left';
    doc.text(header, x, tableY + 10, { width: colWidths[i] - 15, align });
  });
  
  const ledger = statement.ledger || [];
  let currentY = tableY + headerHeight;
  
  ledger.forEach((row, index) => {
    const isEven = index % 2 === 0;
    const bgColor = isEven ? COLORS.white : COLORS.bg;
    
    drawRoundedRect(doc, MARGIN, currentY, tableWidth, rowHeight, 0, { fill: bgColor });
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.body);
    
    const desc = row.type === 'INVOICE' ? 'Invoice issued' :
                 row.type === 'PAYMENT' ? `Payment (${row.method || 'Received'})` :
                 row.type === 'CREDIT_NOTE' ? 'Credit Note' : row.type || 'Transaction';
    
    const rowData = [
      safeDateISO(row.date),
      String(row.reference || '—').substring(0, 12),
      desc,
      Number(row.debit || 0) > 0 ? formatMoney(row.debit) : '',
      Number(row.credit || 0) > 0 ? formatMoney(row.credit) : '',
      formatMoney(row.runningBalance),
    ];
    
    rowData.forEach((cell, i) => {
      const x = MARGIN + colX[i] + 10;
      const align = i >= 3 ? 'right' : 'left';
      const color = i === 4 ? COLORS.success : i === 3 ? '#ef4444' : COLORS.text;
      doc.fillColor(color).text(cell, x, currentY + 8, { width: colWidths[i] - 15, align });
    });
    
    drawSeparator(doc, MARGIN + 10, currentY + rowHeight - 1, tableWidth - 20, COLORS.borderLight);
    
    currentY += rowHeight;
  });
  
  drawRoundedRect(doc, MARGIN, currentY, tableWidth, 3, 0, { fill: COLORS.primary });
  
  // Footer
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight).font(FONTS.body)
     .text('Generated by Bretune Accounting', PAGE_WIDTH / 2, PAGE_HEIGHT - SAFE_BOTTOM, { align: 'center' });
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight)
     .text('Page 1', PAGE_WIDTH - MARGIN - 30, PAGE_HEIGHT - SAFE_BOTTOM);
  
  doc.end();
  return docToBuffer(doc);
}

// ─── Modern Quote PDF ────────────────────────────────────────────────────────
async function generateQuotePdfBuffer(quote, companySettings = {}) {
  const doc = new PDFDocument({ 
    margin: 0, 
    size: 'A4',
    info: {
      Title: `Quote ${quote?.quoteNumber || ''}`,
      Author: companySettings?.companyName || 'Bretune Accounting',
    }
  });
  
  const fs = require('fs');
  const s = companySettings || {};
  
  // Header with accent color (amber for quotes)
  const quoteColor = '#f59e0b';
  const quoteColorLight = '#fef3c7';
  const quoteColorDark = '#92400e';
  
  doc.rect(0, 0, PAGE_WIDTH, 140).fill(quoteColor);
  doc.rect(0, 140, PAGE_WIDTH, 3).fill(quoteColorLight);
  
  let y = MARGIN;
  
  const logoPath = getCompanyLogoPath(s);
  const leftCol = MARGIN;
  const rightCol = PAGE_WIDTH - MARGIN - 200;
  
  if (logoPath) {
    try {
      doc.image(logoPath, leftCol, y - 20, { width: 70, height: 70 });
    } catch { 
      doc.fontSize(SIZES.title).fillColor(COLORS.white).font(FONTS.heading).text(s.companyName || 'Bretune', leftCol, y);
    }
  } else {
    doc.fontSize(SIZES.title).fillColor(COLORS.white).font(FONTS.heading).text(s.companyName || 'Bretune', leftCol, y);
  }
  
  let companyY = y + 50;
  doc.fontSize(SIZES.small).fillColor('rgba(255,255,255,0.9)').font(FONTS.body);
  if (s.tagline || s.slogan) {
    doc.text(s.tagline || s.slogan, leftCol, companyY);
    companyY += 12;
  }
  if (s.businessEmail) {
    doc.text(s.businessEmail, leftCol, companyY);
    companyY += 12;
  }
  
  const quoteRef = quote?.quoteNumber || `QT-${String(quote?.quoteSeq || 0).padStart(4, '0')}`;
  doc.fontSize(32).fillColor(COLORS.white).font(FONTS.heading).text('QUOTE', rightCol, y - 10, { align: 'right' });
  doc.fontSize(SIZES.subtitle).fillColor('rgba(255,255,255,0.85)').font(FONTS.body).text(`#${quoteRef}`, rightCol, y + 30, { align: 'right' });
  
  y = 170;
  
  // Two column layout
  const colWidth = (CONTENT_WIDTH - 30) / 2;
  
  // Customer Section
  drawRoundedRect(doc, MARGIN, y, colWidth, 110, 8, { fill: COLORS.bg, stroke: COLORS.border });
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight).font(FONTS.bodyBold).text('QUOTE FOR', MARGIN + 15, y + 12);
  drawSeparator(doc, MARGIN + 15, y + 26, colWidth - 30, COLORS.border);
  
  const clientName = `${quote?.client?.companyName || ''} ${quote?.client?.contactName || ''}`.trim() || '—';
  doc.fontSize(SIZES.heading).fillColor(COLORS.text).font(FONTS.heading).text(clientName, MARGIN + 15, y + 35);
  
  doc.fontSize(SIZES.body).fillColor(COLORS.textMuted).font(FONTS.body);
  let clientY = y + 55;
  const clientCode = getClientAccountCode(quote?.client);
  doc.text(`Account: ${clientCode}`, MARGIN + 15, clientY);
  clientY += 14;
  
  if (quote?.client?.email) {
    doc.text(quote.client.email, MARGIN + 15, clientY);
    clientY += 14;
  }
  const clientAddr = [quote?.client?.address, quote?.client?.city].filter(Boolean);
  if (clientAddr.length) {
    doc.text(clientAddr.join(', '), MARGIN + 15, clientY);
  }
  
  // Quote Details Section
  const detailsX = MARGIN + colWidth + 30;
  drawRoundedRect(doc, detailsX, y, colWidth, 110, 8, { fill: COLORS.white, stroke: COLORS.border });
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight).font(FONTS.bodyBold).text('QUOTE DETAILS', detailsX + 15, y + 12);
  drawSeparator(doc, detailsX + 15, y + 26, colWidth - 30, COLORS.border);
  
  const statusColor = quote?.status === 'ACCEPTED' ? COLORS.success : quote?.status === 'REJECTED' ? '#ef4444' : COLORS.text;
  const details = [
    { label: 'Issue Date:', value: formatDateFriendly(quote?.issueDate) },
    { label: 'Valid Until:', value: formatDateFriendly(quote?.expiryDate) },
    { label: 'Status:', value: quote?.status || 'Draft', color: statusColor },
  ];
  
  let detailY = y + 35;
  doc.fontSize(SIZES.body).font(FONTS.body);
  details.forEach(({ label, value, color }) => {
    doc.fillColor(COLORS.textLight).text(label, detailsX + 15, detailY, { width: 70 });
    doc.fillColor(color || COLORS.text).font(FONTS.bodyBold).text(value, detailsX + 90, detailY, { width: colWidth - 105 });
    doc.font(FONTS.body);
    detailY += 16;
  });
  
  y += 130;
  
  // Line Items Table
  const tableY = y;
  const tableWidth = CONTENT_WIDTH;
  const headerHeight = 36;
  
  // Better column widths - wider description, narrower number columns
  const colWidths = [30, 240, 45, 65, 45, 65, 70];
  const colX = [0];
  for (let i = 0; i < colWidths.length - 1; i++) {
    colX.push(colX[i] + colWidths[i]);
  }
  
  drawRoundedRect(doc, MARGIN, tableY, tableWidth, headerHeight, 6, { fill: quoteColor });
  
  const headers = ['#', 'Description', 'Qty', 'Unit Price', 'VAT %', 'Excl.', 'Total'];
  doc.fontSize(SIZES.body).fillColor(COLORS.white).font(FONTS.bodyBold);
  headers.forEach((header, i) => {
    const x = MARGIN + colX[i] + (i === 0 ? 8 : i === headers.length - 1 ? -5 : 0);
    const align = i >= 2 ? 'right' : 'left';
    const width = colWidths[i] - (i === 0 ? 8 : i === headers.length - 1 ? 5 : 5);
    doc.text(header, x, tableY + 12, { width, align });
  });
  
  // Table rows with dynamic height
  const items = quote?.items || [];
  let currentY = tableY + headerHeight;
  const cellPad = 8;
  const minRowHeight = 32;
  const maxDescLines = 3;
  const descLineHeight = 11;
  
  items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const bgColor = isEven ? COLORS.white : COLORS.bg;
    
    // Calculate description height
    const descText = String(item?.description || item?.product?.name || '—');
    doc.fontSize(SIZES.body).font(FONTS.body);
    const descWidth = colWidths[1] - 10;
    const descHeight = Math.min(
      doc.heightOfString(descText, { width: descWidth, lineGap: 2 }),
      maxDescLines * descLineHeight
    );
    const rowHeight = Math.max(minRowHeight, descHeight + cellPad * 2);
    
    drawRoundedRect(doc, MARGIN, currentY, tableWidth, rowHeight, 0, { fill: bgColor });
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.body);
    const qty = Number(item?.quantity ?? 0);
    const unitPrice = Number(item?.unitPrice ?? 0);
    const taxRate = Number(item?.taxRate ?? 0);
    const inclTotal = Number(item?.total ?? 0);
    const exclTotal = taxRate > 0 ? inclTotal / (1 + taxRate) : inclTotal;
    const vatPct = (taxRate * 100).toFixed(0);
    
    const textY = currentY + (rowHeight - descHeight) / 2;
    
    // Item number
    doc.text(String(index + 1), MARGIN + colX[0] + 8, textY);
    
    // Description (with wrapping)
    doc.text(descText, MARGIN + colX[1], textY, { 
      width: descWidth, 
      lineGap: 2,
      ellipsis: true
    });
    
    // Qty
    doc.text(String(qty), MARGIN + colX[2], textY, { width: colWidths[2] - 5, align: 'right' });
    
    // Unit Price
    doc.text(formatMoney(unitPrice), MARGIN + colX[3], textY, { width: colWidths[3] - 5, align: 'right' });
    
    // VAT %
    doc.text(vatPct + '%', MARGIN + colX[4], textY, { width: colWidths[4] - 5, align: 'right' });
    
    // Excl. total
    doc.text(formatMoney(exclTotal), MARGIN + colX[5], textY, { width: colWidths[5] - 5, align: 'right' });
    
    // Incl. total (bold)
    doc.font(FONTS.bodyBold).text(formatMoney(inclTotal), MARGIN + colX[6], textY, { width: colWidths[6] - 5, align: 'right' });
    doc.font(FONTS.body);
    
    drawSeparator(doc, MARGIN + 10, currentY + rowHeight - 1, tableWidth - 20, COLORS.borderLight);
    
    currentY += rowHeight;
  });
  
  if (items.length === 0) {
    const emptyRowHeight = 32;
    drawRoundedRect(doc, MARGIN, currentY, tableWidth, emptyRowHeight, 0, { fill: COLORS.bg });
    doc.fontSize(SIZES.body).fillColor(COLORS.textLight).font(FONTS.light)
       .text('No line items', MARGIN + 20, currentY + 10);
    currentY += emptyRowHeight;
  }
  
  drawRoundedRect(doc, MARGIN, currentY, tableWidth, 3, 0, { fill: quoteColor });
  
  // Totals
  y = currentY + 25;
  const totalsX = PAGE_WIDTH - MARGIN - 220;
  
  const totals = [
    { label: 'Subtotal (Excl. VAT):', value: formatMoney(quote?.subtotal) },
    { label: 'VAT Amount:', value: formatMoney(quote?.taxAmount) },
  ];
  
  totals.forEach(({ label, value }) => {
    doc.fontSize(SIZES.body).fillColor(COLORS.textMuted).font(FONTS.body).text(label, totalsX, y, { width: 130, align: 'right' });
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.body).text(value, totalsX + 140, y, { width: 80, align: 'right' });
    y += 18;
  });
  
  y += 5;
  drawRoundedRect(doc, totalsX - 10, y - 5, 230, 35, 6, { fill: quoteColorLight, stroke: quoteColor });
  doc.fontSize(SIZES.heading).fillColor(quoteColorDark).font(FONTS.heading).text('Quote Total:', totalsX, y + 5, { width: 130, align: 'right' });
  doc.fontSize(SIZES.heading + 2).fillColor(quoteColor).font(FONTS.heading).text(formatMoney(quote?.totalAmount), totalsX + 140, y + 3, { width: 80, align: 'right' });
  
  // Validity notice
  y += 50;
  drawRoundedRect(doc, MARGIN, y, CONTENT_WIDTH, 50, 8, { fill: COLORS.bg, stroke: COLORS.border });
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight).font(FONTS.bodyBold).text('IMPORTANT', MARGIN + 15, y + 12);
  doc.fontSize(SIZES.body).fillColor(COLORS.textMuted).font(FONTS.body)
     .text(`This quote is valid until ${formatDateFriendly(quote?.expiryDate) || '—'}. ` +
           `Prices are subject to change after the expiry date.`, MARGIN + 15, y + 28, { width: CONTENT_WIDTH - 30 });
  
  // Footer
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight).font(FONTS.body)
     .text('We look forward to doing business with you', PAGE_WIDTH / 2, PAGE_HEIGHT - SAFE_BOTTOM, { align: 'center' });
  doc.fontSize(SIZES.tiny).fillColor(COLORS.textLight)
     .text('Page 1', PAGE_WIDTH - MARGIN - 30, PAGE_HEIGHT - SAFE_BOTTOM);
  
  doc.end();
  return docToBuffer(doc);
}

module.exports = {
  generateStatementPdfBuffer,
  generateInvoicePdfBuffer,
  generateQuotePdfBuffer,
};
