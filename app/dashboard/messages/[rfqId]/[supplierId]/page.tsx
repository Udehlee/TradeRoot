import { redirect } from "next/navigation";

const Page = async ({
  params,
}: {
  params: Promise<{ rfqId: string; supplierId: string }>;
}) => {
  const { rfqId, supplierId } = await params;
  redirect(`/dashboard/messages?rfqId=${rfqId}&supplierId=${supplierId}`);
};

export default Page;