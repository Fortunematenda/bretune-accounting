import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Button from "../../components/ui/button";
import QuoteForm from "../../components/quotes/QuoteForm";
import { FileText } from "lucide-react";

export default function QuotePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const preselectedClientId = searchParams.get("clientId") || "";

  const isEdit = Boolean(id);

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(isEdit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .listClients({ page: 1, limit: 200 })
      .then((res) => setClients(res.data || []))
      .catch(() => setClients([]));

    api
      .listProducts({ page: 1, limit: 200, isActive: true })
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setQuoteLoading(true);
    api
      .getQuote(id)
      .then((res) => {
        if (mounted) setQuote(res);
      })
      .catch(() => {
        if (mounted) setQuote(null);
      })
      .finally(() => {
        if (mounted) setQuoteLoading(false);
      });
    return () => { mounted = false; };
  }, [id]);

  async function onSubmit(payload) {
    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        await api.updateQuote(id, payload);
        navigate(`/quotes/${id}`, { replace: true });
      } else {
        const created = await api.createQuote(payload);
        navigate(created?.id ? `/quotes/${created.id}` : "/quotes", { replace: true });
      }
    } catch (err) {
      setError(err.message || "We couldn't save the quote. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isEdit && quoteLoading) {
    return <div className="text-sm text-slate-600">Loading quote…</div>;
  }

  if (isEdit && !quote) {
    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold">Quote</h1>
            <p className="text-sm text-slate-600">Quote not found.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/quotes")}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {isEdit ? "Edit quote" : "New quote"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {isEdit ? "Edit quote details" : "Create a professional quote for your customer"}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/quotes")}>
          Back
        </Button>
      </div>

      <Card className="border-violet-100 overflow-hidden">
        <CardHeader className="border-b border-violet-100 bg-violet-50/30">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <div className="h-10 w-10 rounded-lg bg-violet-600 text-white flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <span>Quote details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <QuoteForm
            clients={clients}
            products={products}
            preselectedClientId={preselectedClientId}
            initialQuote={quote}
            onSubmit={onSubmit}
            loading={loading}
            serverError={error}
            submitLabel={isEdit ? "Save changes" : "Create quote"}
            isEdit={isEdit}
            onProductCreated={(p) => setProducts((prev) => [...(prev || []), p])}
          />
        </CardContent>
      </Card>
    </div>
  );
}
