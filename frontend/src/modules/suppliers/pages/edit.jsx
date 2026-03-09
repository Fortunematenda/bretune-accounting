import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { api } from "../../../lib/api";
import Button from "../../../components/ui/button";
import SupplierForm from "../components/SupplierForm";

export default function SupplierEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const supplierQuery = useQuery({
    queryKey: ["supplier", id],
    queryFn: () => api.getSupplier(id),
    enabled: Boolean(id),
  });

  const mutation = useMutation({
    mutationFn: (payload) => api.updateSupplier(id, payload),
    onSuccess: async (updated) => {
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      await queryClient.invalidateQueries({ queryKey: ["supplier", id] });
      navigate(`/suppliers/${updated?.id || id}`, { replace: true });
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9" onClick={() => navigate(`/suppliers/${id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Edit Supplier</h1>
            <p className="mt-1 text-sm text-slate-500">Update supplier details and payment terms.</p>
          </div>
        </div>
      </div>

      {supplierQuery.isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="h-4 w-56 rounded bg-slate-100 animate-pulse" />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      ) : supplierQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {supplierQuery.error?.message || "Failed to load supplier"}
        </div>
      ) : (
        <SupplierForm
          initialValues={supplierQuery.data}
          onSubmit={async (payload) => {
            await mutation.mutateAsync(payload);
          }}
          loading={mutation.isPending}
          serverError={mutation.error?.message || null}
          submitLabel="Save Changes"
          onCancel={() => navigate(`/suppliers/${id}`)}
        />
      )}
    </div>
  );
}
