"use client";

import type { InboundMessage } from "ably";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { getAblyClient } from "@/app/lib/ably-client";
import { sendMessage } from "@/app/lib/actions/send-message";
import { proposeTerms } from "@/app/lib/actions/propose-terms";
import { acceptOffer } from "@/app/lib/actions/accept-offer";
import { endNegotiation } from "@/app/lib/actions/end-negotiation";

interface Message {
  id: string;
  content: string;
  senderId: string;
  isOffer: boolean;
  proposedPrice?: number | null;
  proposedDeliveryDays?: number | null;
  createdAt: string;
}

const MessageThread = ({
  rfqId,
  supplierId,
  currentUserId,
  initialMessages,
  initialEnded,
}: {
  rfqId: string;
  supplierId: string;
  currentUserId: string;
  initialMessages: Message[];
  initialEnded: boolean;
}) => {
  const router = useRouter();
  const isBuyer = supplierId !== currentUserId;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");
  const [ended, setEnded] = useState(initialEnded);

  useEffect(() => {
    const client = getAblyClient();
    const channel = client.channels.get(`thread:${rfqId}:${supplierId}`);

    const messageHandler = (msg: InboundMessage) => {
      if (!msg.data) return;
      const incoming = msg.data as Message;
      setMessages((prev) =>
        prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming]
      );
    };

    const endedHandler = () => setEnded(true);

    channel.subscribe("new-message", messageHandler);
    channel.subscribe("negotiation-ended", endedHandler);

    return () => {
      channel.unsubscribe("new-message", messageHandler);
      channel.unsubscribe("negotiation-ended", endedHandler);
    };
  }, [rfqId, supplierId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const result = await sendMessage(rfqId, supplierId, text.trim());
    if (result.success && result.message) {
      setMessages((prev) =>
        prev.some((m) => m.id === result.message.id) ? prev : [...prev, result.message]
      );
    }
    setText("");
  };

  const handlePropose = async () => {
    if (!price || !days) return;
    const result = await proposeTerms(rfqId, supplierId, Number(price), Number(days));
    if (result.success && result.message) {
      setMessages((prev) =>
        prev.some((m) => m.id === result.message.id) ? prev : [...prev, result.message]
      );
    }
    setPrice("");
    setDays("");
    setShowOfferForm(false);
  };

  const handleAccept = async (offerPrice: number, offerDays: number) => {
    const result = await acceptOffer(rfqId, supplierId, offerPrice, offerDays);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Terms accepted — RFQ awarded");
      router.refresh();
    }
  };

  const handleEnd = async () => {
    const result = await endNegotiation(rfqId, supplierId);
    if (result.error) {
      toast.error(result.error);
    } else {
      setEnded(true);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col h-[500px]">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <p className="text-sm font-medium">Conversation</p>

        {!ended && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowOfferForm((prev) => !prev)}
              className="text-xs border border-dashed border-gray-300 rounded px-3 py-1.5 text-gray-500 hover:bg-gray-50"
            >
              + Propose new terms
            </button>
            <button
              onClick={handleEnd}
              className="text-xs border border-red-200 text-red-600 rounded px-3 py-1.5 hover:bg-red-50"
            >
              {isBuyer ? "Decline" : "Withdraw"}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`max-w-[75%] ${isMe ? "ml-auto text-right" : ""}`}>
              {msg.isOffer ? (
                <div className="inline-block text-left border border-gray-300 rounded-lg p-3 bg-gray-50">
                  <p className="text-xs font-medium text-blue-600 mb-1">Proposed terms</p>
                  <p className="text-sm font-semibold">
                    ₦{msg.proposedPrice?.toLocaleString()} · {msg.proposedDeliveryDays}-day delivery
                  </p>

                  {isBuyer && !isMe && !ended && (
                    <button
                      onClick={() => handleAccept(msg.proposedPrice!, msg.proposedDeliveryDays!)}
                      className="mt-2 text-xs bg-gray-900 text-white rounded px-3 py-1"
                    >
                      Accept these terms
                    </button>
                  )}
                </div>
              ) : (
                <div className={`inline-block rounded-lg px-3 py-2 text-sm ${isMe ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
                  {msg.content}
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-0.5">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-100 p-3">
        {ended ? (
          <div className="text-center py-3 text-xs text-gray-500 bg-gray-50 rounded">
            This negotiation has ended.
            <Link
              href={isBuyer ? "/dashboard/buyer/rfqs" : "/dashboard/supplier/rfqs"}
              className="ml-1 underline"
            >
              View your RFQs
            </Link>
          </div>
        ) : (
          <>
            {showOfferForm && (
              <div className="flex gap-2 mb-2">
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price (₦)"
                  type="number"
                  className="flex-1 border rounded px-2 py-1.5 text-sm"
                />
                <input
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="Delivery days"
                  type="number"
                  className="flex-1 border rounded px-2 py-1.5 text-sm"
                />
                <button onClick={handlePropose} className="bg-blue-600 text-white rounded px-3 text-sm">
                  Send
                </button>
                <button onClick={() => setShowOfferForm(false)} className="text-sm text-gray-500 px-2">
                  Cancel
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 border rounded px-3 py-2 text-sm"
              />
              <button onClick={handleSend} className="bg-gray-900 text-white rounded px-4 text-sm">
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageThread;