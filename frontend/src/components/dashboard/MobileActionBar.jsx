import React from "react";
import Button from "../ui/button";
import { Plus, CreditCard, ScrollText } from "lucide-react";

export default function MobileActionBar({ onNewInvoice, onRecordPayment, onSendStatement }) {
  return (
    <div className="md:hidden grid grid-cols-2 gap-2">
      <Button onClick={onNewInvoice} className="w-full justify-center bg-violet-600 hover:bg-violet-700 shadow-sm">
        <Plus className="h-4 w-4 mr-2" />
        Invoice
      </Button>
      <Button variant="outline" onClick={onRecordPayment} className="w-full justify-center bg-white">
        <CreditCard className="h-4 w-4 mr-2" />
        Record Payment
      </Button>
      <Button variant="outline" onClick={onSendStatement} className="w-full justify-center col-span-2 bg-white">
        <ScrollText className="h-4 w-4 mr-2" />
        Send Statement
      </Button>
    </div>
  );
}
