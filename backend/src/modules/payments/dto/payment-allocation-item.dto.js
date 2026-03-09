const { IsNumberString, IsString } = require('class-validator');

class PaymentAllocationItemDto {
  @IsString()
  invoiceId;

  @IsNumberString()
  amount;
}

module.exports = { PaymentAllocationItemDto };
