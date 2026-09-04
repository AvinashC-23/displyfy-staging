export function StatusPill({ status }: { status: string }) {
  const good = ["approved", "live", "paid", "payout_eligible"].includes(status);
  const bad = ["rejected", "suspended", "cancelled"].includes(status);
  return <span className={`pill ${good ? "good" : bad ? "bad" : "warn"}`}>{status.replaceAll("_", " ")}</span>;
}
