const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
const hasModel = typeof p.customerDocument !== 'undefined';
console.log('customerDocument model exists:', hasModel);
if (hasModel) {
  // Try a query to verify description field works
  p.customerDocument.findFirst({ select: { id: true, description: true } })
    .then(r => { console.log('description field OK, sample:', r); p.$disconnect(); })
    .catch(e => { console.log('description field error:', e.message); p.$disconnect(); });
} else {
  console.log('Need to run prisma generate');
  p.$disconnect();
}
