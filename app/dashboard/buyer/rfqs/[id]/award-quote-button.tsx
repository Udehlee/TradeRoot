"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { awardQuote } from "@/app/lib/actions/award-quote";

const AwardQuoteButton = ({
  rfqId,
  quoteId,
}: {
  rfqId: string;
  quoteId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAward = async () => {
    setLoading(true);
    const result = await awardQuote(rfqId, quoteId);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Quote awarded");
      router.refresh();
    }
  };

  return (
    <Button size="sm" onClick={handleAward} disabled={loading}>
      {loading ? "Awarding..." : "Award"}
    </Button>
  );
};

export default AwardQuoteButton;