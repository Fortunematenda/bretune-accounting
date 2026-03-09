const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function isEmpty(v) {
  return v == null || String(v).trim() === "";
}

export function validateClient(values = {}) {
  const errors = {};

  if (isEmpty(values.contactName)) errors.contactName = "Contact name is required";
  if (isEmpty(values.email)) errors.email = "Email is required";
  else if (!EMAIL_RE.test(String(values.email))) errors.email = "Enter a valid email address";

  const terms = Number(values.paymentTermsDays);
  if (!Number.isFinite(terms) || terms <= 0) errors.paymentTermsDays = "Payment terms must be greater than 0";

  if (String(values.taxType) === "VAT_REGISTERED" && isEmpty(values.taxNumber)) {
    errors.taxNumber = "VAT number is required for VAT-registered clients";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateInvoice(values = {}) {
  const errors = { items: [] };

  if (isEmpty(values.clientId)) errors.clientId = "Client is required";

  const items = Array.isArray(values.items) ? values.items : [];
  if (items.length === 0) errors.itemsError = "Add at least one line item";

  items.forEach((it, idx) => {
    const row = {};
    const qty = Number(it.quantity);
    const price = Number(it.unitPrice);

    if (isEmpty(it.productId) && isEmpty(it.description)) row.description = "Select a product or enter a description";
    if (!Number.isFinite(qty) || qty <= 0) row.quantity = "Quantity must be greater than 0";
    if (!Number.isFinite(price) || price < 0) row.unitPrice = "Price must be 0 or more";

    errors.items[idx] = row;
  });

  if (!errors.items.some((r) => r && Object.keys(r).length > 0)) {
    delete errors.items;
  }

  const hasFieldErrors = Object.entries(errors).some(([k, v]) => {
    if (k === "items") return false;
    return v != null && String(v).length > 0;
  });

  const hasItemErrors = Array.isArray(errors.items) && errors.items.some((r) => r && Object.keys(r).length > 0);

  return {
    valid: !hasFieldErrors && !hasItemErrors,
    errors,
  };
}
