import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import ExpenseForm from "../components/expenses/ExpenseForm";

export default function ExpenseFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const expenseQuery = useQuery({
    queryKey: ["expense", id],
    queryFn: () => api.getExpense(id),
    enabled: editing,
  });

  const suppliersQuery = useQuery({
    queryKey: ["suppliers", { page: 1, limit: 1000 }],
    queryFn: () => api.listSuppliers({ page: 1, limit: 1000 }),
    staleTime: 60_000,
  });

  const categoriesQuery = useQuery({
    queryKey: ["expenseCategories"],
    queryFn: () => api.listExpenseCategories({ page: 1, limit: 1000 }),
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: (payload) => {
      if (editing) return api.updateExpense(id, payload);
      return api.createExpense(payload);
    },
    onSuccess: async (saved) => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      if (saved?.id) navigate(`/expenses/${saved.id}`, { replace: true });
      else navigate("/expenses", { replace: true });
    },
  });

  const suppliers = suppliersQuery.data?.data || [];
  const categories = categoriesQuery.data?.data || [];

  const initialValues = useMemo(() => {
    if (!editing) return { expenseDate: new Date().toISOString().slice(0, 10), taxRate: "0", amount: "0" };
    return expenseQuery.data || { expenseDate: new Date().toISOString().slice(0, 10), taxRate: "0", amount: "0" };
  }, [editing, expenseQuery.data]);

  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (mutation.error) setServerError(mutation.error?.message || "Could not save expense");
  }, [mutation.error]);

  const onSubmit = useCallback(
    async (values) => {
      setServerError(null);
      try {
        const payload = {
          expenseDate: values.expenseDate,
          supplierId: values.supplierId || null,
          categoryId: values.categoryId || null,
          description: values.description || null,
          amount: values.amount,
          taxRate: values.taxRate,
          taxAmount: values.taxAmount,
          totalAmount: values.totalAmount,
          paymentMethod: values.paymentMethod,
          notes: values.notes || null,
          status: values.status,
          attachmentName: values.attachment?.name || null,
        };

        await mutation.mutateAsync(payload);
      } catch (e) {
        setServerError(e?.message || "Could not save expense");
      }
    },
    [mutation]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9" onClick={() => navigate("/expenses")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{editing ? "Edit Expense" : "New Expense"}</h1>
            <p className="mt-1 text-sm text-slate-500">Capture and approve business expenses.</p>
          </div>
        </div>
      </div>

      <Card className="shadow-sm hover:translate-y-0">
        <CardHeader>
          <CardTitle>Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm
            initialValues={initialValues}
            suppliers={suppliers}
            categories={categories}
            loading={mutation.isPending || expenseQuery.isLoading}
            serverError={serverError || expenseQuery.error?.message || null}
            onCancel={() => navigate("/expenses")}
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
