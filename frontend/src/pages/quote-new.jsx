import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Button from "../components/ui/button";
import QuoteForm from "../components/quotes/QuoteForm";
import { FileText } from "lucide-react";

export default function QuoteNewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedClientId = searchParams.get("clientId") || "";

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
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

  async function onSubmit(payload) {
    setLoading(true);
    setError(null);
    try {
      const quote = await api.createQuote(payload);
      navigate(quote?.id ? `/quotes/${quote.id}` : "/quotes", { replace: true });
    } catch (err) {
      setError(err.message || "We couldn't create the quote. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">New quote</h1>
          <p className="text-sm text-slate-600 mt-1">Create a professional quote for your customer</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/quotes")}>
          Cancel
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
            onSubmit={onSubmit}
            loading={loading}
            serverError={error}
            onProductCreated={(p) => setProducts((prev) => [...(prev || []), p])}
          />
        </CardContent>
      </Card>
    </div>
  );
}
