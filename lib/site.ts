export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export const site = {
  name: "ORGANEXT",
  title: "ORGANEXT — Εφαρμογές και συστήματα",
  description:
    "Η ORGANEXT σχεδιάζει και αναπτύσσει εξατομικευμένες εφαρμογές, πληροφοριακά συστήματα, ιστοσελίδες και ηλεκτρονικά καταστήματα για επιχειρήσεις.",
};

export const nav = [
  { id: "archi", label: "Αρχική" },
  { id: "ypiresies", label: "Υπηρεσίες" },
  { id: "etaireia", label: "Η εταιρεία" },
  { id: "epikoinonia", label: "Επικοινωνία" },
] as const;
