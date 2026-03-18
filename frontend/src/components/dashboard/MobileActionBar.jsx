import React from "react";
import Button from "../ui/button";
import { Plus, CreditCard, ScrollText } from "lucide-react";

export default function MobileActionBar({ onNewInvoice, onRecordPayment, onSendStatement }) {
  return (
    <div className="md:hidden grid grid-cols-3 gap-2">
      <Button onClick={onNewInvoice} className="w-full justify-center bg-violet-600 hover:bg-violet-700 shadow-sm shadow-violet-600/20 text-xs h-9 rounded-xl">
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Invoice
      </Button>
      <Button variant="outline" onClick={onRecordPayment} className="w-full justify-center bg-white text-xs h-9 rounded-xl border-slate-200">
        <CreditCard className="h-3.5 w-3.5 mr-1.5" />
        Payment
      </Button>
      <Button variant="outline" onClick={onSendStatement} className="w-full justify-center bg-white text-xs h-9 rounded-xl border-slate-200">
        <ScrollText className="h-3.5 w-3.5 mr-1.5" />
        Statement
      </Button>
    </div>
  );
}
