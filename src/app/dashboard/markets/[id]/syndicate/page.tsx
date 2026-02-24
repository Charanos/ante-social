import { redirect } from "next/navigation";

export default async function LegacySyndicatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/markets/${id}/betrayal`);
}
