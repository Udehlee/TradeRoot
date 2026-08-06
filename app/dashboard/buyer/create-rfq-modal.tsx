"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createRfq } from "@/app/lib/actions/create-rfq";
import { CATEGORIES } from "@/app/lib/categories";

const CreateRfqModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    product: "",
    quantity: "",
    unit: "Bags",
    category: CATEGORIES[0],
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createRfq({
      product: form.product,
      quantity: Number(form.quantity),
      unit: form.unit,
      category: form.category,
      notes: form.notes,
    });

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("RFQ sent to suppliers");
      setOpen(false);
      setForm({ product: "", quantity: "", unit: "Bags", category: CATEGORIES[0], notes: "" });
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-gray-900 text-white text-sm font-medium px-4 py-2 hover:bg-gray-700 transition-colors">
        + Create RFQ
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create RFQ</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Product / material</label>
            <input
              required
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              placeholder="e.g. Steel rods, 12mm"
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm text-gray-600 block mb-1">Quantity</label>
              <input
                required
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="500"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600 block mb-1">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option>Bags</option>
                <option>Pieces</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Notes for suppliers</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Delivery timeline, specs, location..."
              className="w-full border rounded px-3 py-2 text-sm min-h-[70px]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Sending..." : "Send RFQ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRfqModal;