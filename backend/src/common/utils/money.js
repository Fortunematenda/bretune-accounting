const { BadRequestException } = require('@nestjs/common');
const { Prisma } = require('@prisma/client');

function toDecimal(value, fieldName) {
  try {
    if (value == null) {
      return new Prisma.Decimal('0');
    }
    return new Prisma.Decimal(String(value));
  } catch (e) {
    throw new BadRequestException(`${fieldName || 'value'} must be a valid decimal`);
  }
}

function calculateLine({ quantity, unitPrice, discount, taxRate }) {
  const qty = toDecimal(quantity, 'quantity');
  const price = toDecimal(unitPrice, 'unitPrice');
  const disc = toDecimal(discount || '0', 'discount');
  const vat = toDecimal(taxRate || '0', 'taxRate');

  if (qty.lte(0)) {
    throw new BadRequestException('quantity must be greater than 0');
  }

  if (price.lt(0)) {
    throw new BadRequestException('unitPrice must be 0 or greater');
  }

  if (disc.lt(0)) {
    throw new BadRequestException('discount must be 0 or greater');
  }

  if (vat.lt(0) || vat.gt(1)) {
    throw new BadRequestException('taxRate must be between 0 and 1 (e.g. 0.15 for 15%)');
  }

  const gross = qty.mul(price);
  if (disc.gt(gross)) {
    throw new BadRequestException('discount cannot exceed quantity * unitPrice');
  }

  const lineSubtotal = gross.sub(disc);
  const lineTax = lineSubtotal.mul(vat);
  const lineTotal = lineSubtotal.add(lineTax);

  return {
    lineSubtotal,
    lineTax,
    lineTotal,
  };
}

function calculateDocumentTotals(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new BadRequestException('items must contain at least 1 line item');
  }

  let subtotal = new Prisma.Decimal('0');
  let taxAmount = new Prisma.Decimal('0');
  const normalizedItems = items.map((item) => {
    const { lineSubtotal, lineTax, lineTotal } = calculateLine(item);
    subtotal = subtotal.add(lineSubtotal);
    taxAmount = taxAmount.add(lineTax);

    return {
      ...item,
      quantity: String(toDecimal(item.quantity, 'quantity')),
      unitPrice: String(toDecimal(item.unitPrice, 'unitPrice')),
      discount: String(toDecimal(item.discount || '0', 'discount')),
      taxRate: String(toDecimal(item.taxRate || '0', 'taxRate')),
      total: String(lineTotal),
    };
  });

  const totalAmount = subtotal.add(taxAmount);

  return {
    subtotal: String(subtotal),
    taxAmount: String(taxAmount),
    totalAmount: String(totalAmount),
    items: normalizedItems,
  };
}

module.exports = {
  toDecimal,
  calculateLine,
  calculateDocumentTotals,
};
