export function formatNaira(amount: number, opts: { compact?: boolean; sign?: boolean } = {}) {
  const abs = Math.abs(amount);
  const formatted = opts.compact && abs >= 1_000_000
    ? `₦${(abs / 1_000_000).toFixed(1)}M`
    : `₦${abs.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (!opts.sign) return formatted;
  return amount < 0 ? `-${formatted}` : `+${formatted}`;
}

export function maskPhone(phone: string) {
  if (phone.length < 7) return phone;
  return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ****`;
}

export function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}
