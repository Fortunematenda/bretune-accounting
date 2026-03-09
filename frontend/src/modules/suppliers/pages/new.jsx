import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { api } from "../../../lib/api";
import Button from "../../../components/ui/button";
import SupplierForm from "../components/SupplierForm";

export default function SupplierNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) => api.createSupplier(payload),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      if (created?.id) navigate(`/suppliers/${created.id}`, { replace: true });
      else navigate("/suppliers", { replace: true });
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9" onClick={() => navigate("/suppliers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">New Supplier</h1>
            <p className="mt-1 text-sm text-slate-500">Add a vendor profile for bills and payments.</p>
          </div>
        </div>
      </div>

      <SupplierForm
        initialValues={{ status: "ACTIVE", paymentTermsDays: 30 }}
        onSubmit={async (payload) => {
          await mutation.mutateAsync(payload);
        }}
        loading={mutation.isPending}
        serverError={mutation.error?.message || null}
        submitLabel="Create Supplier"
        onCancel={() => navigate("/suppliers")}
      />
    </div>
  );
}
