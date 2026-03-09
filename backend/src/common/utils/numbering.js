function padNumber(value, length) {
  const str = String(value);
  if (str.length >= length) return str;
  return '0'.repeat(length - str.length) + str;
}

function formatDateYYYYMMDD(date) {
  const d = date instanceof Date ? date : new Date(date);
  const yyyy = d.getFullYear();
  const mm = padNumber(d.getMonth() + 1, 2);
  const dd = padNumber(d.getDate(), 2);
  return `${yyyy}${mm}${dd}`;
}

function generateDocumentNumber(prefix, date = new Date()) {
  const yyyymmdd = formatDateYYYYMMDD(date);
  const rand = padNumber(Math.floor(Math.random() * 1000000), 6);
  return `${prefix}-${yyyymmdd}-${rand}`;
}

function formatInvoiceNumber(sequenceValue) {
  return `INV-${padNumber(sequenceValue, 3)}`;
}

function formatQuoteNumber(sequenceValue) {
  return `Q-${padNumber(sequenceValue, 3)}`;
}

function formatPaymentNumber(sequenceValue) {
  return `PAY-${padNumber(sequenceValue, 3)}`;
}

function formatCreditNoteNumber(sequenceValue) {
  return `CR-${padNumber(sequenceValue, 3)}`;
}

async function nextInvoiceNumber(tx) {
  const counter = await tx.documentCounter.upsert({
    where: { key: 'invoice' },
    create: { key: 'invoice', value: 1 },
    update: { value: { increment: 1 } },
  });

  return formatInvoiceNumber(counter.value);
}

async function peekNextInvoiceNumber(prisma) {
  const counter = await prisma.documentCounter.findUnique({
    where: { key: 'invoice' },
  });
  const nextValue = (counter?.value ?? 0) + 1;
  return formatInvoiceNumber(nextValue);
}

async function peekNextQuoteNumber(prisma) {
  const counter = await prisma.documentCounter.findUnique({
    where: { key: 'quote' },
  });
  const nextValue = (counter?.value ?? 0) + 1;
  return formatQuoteNumber(nextValue);
}

async function nextQuoteNumber(tx) {
  const counter = await tx.documentCounter.upsert({
    where: { key: 'quote' },
    create: { key: 'quote', value: 1 },
    update: { value: { increment: 1 } },
  });

  return formatQuoteNumber(counter.value);
}

async function nextPaymentNumber(tx) {
  const counter = await tx.documentCounter.upsert({
    where: { key: 'payment' },
    create: { key: 'payment', value: 1 },
    update: { value: { increment: 1 } },
  });

  return formatPaymentNumber(counter.value);
}

async function nextCreditNoteNumber(tx) {
  const counter = await tx.documentCounter.upsert({
    where: { key: 'creditNote' },
    create: { key: 'creditNote', value: 1 },
    update: { value: { increment: 1 } },
  });

  return formatCreditNoteNumber(counter.value);
}

module.exports = {
  generateDocumentNumber,
  nextInvoiceNumber,
  peekNextInvoiceNumber,
  nextQuoteNumber,
  peekNextQuoteNumber,
  nextPaymentNumber,
  nextCreditNoteNumber,
  formatInvoiceNumber,
  formatQuoteNumber,
  formatPaymentNumber,
  formatCreditNoteNumber,
};
