"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createQuote } from "@/app/lib/actions/create-quote";

const SubmitQuoteForm = ({ rfqId }: { rfqId: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({ price: "", deliveryDays: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createQuote(rfqId, {
      price: Number(form.price),
      deliveryDays: Number(form.deliveryDays),
      message: form.message,
    });

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Quote submitted");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-lg p-5 space-y-4">
      <p className="text-sm font-medium">Submit your quote</p>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm text-gray-600 block mb-1">Price (₦)</label>
          <input
            required
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm text-gray-600 block mb-1">Delivery (days)</label>
          <input
            required
            type="number"
            value={form.deliveryDays}
            onChange={(e) => setForm({ ...form, deliveryDays: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Message (optional)</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Quote"}
      </Button>
    </form>
  );
};

export default SubmitQuoteForm;