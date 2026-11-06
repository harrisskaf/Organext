export const PROJECT_TYPES = [
  { value: "efarmogi", label: "Εξατομικευμένη εφαρμογή" },
  { value: "systima", label: "Πληροφοριακό σύστημα" },
  { value: "istoselida", label: "Ιστοσελίδα" },
  { value: "eshop", label: "Ηλεκτρονικό κατάστημα" },
  { value: "ai", label: "Τεχνητή νοημοσύνη και αυτοματισμός" },
  { value: "metaschimatismos", label: "Ψηφιακός μετασχηματισμός" },
  { value: "ypostirixi", label: "Συντήρηση και υποστήριξη" },
  { value: "allo", label: "Άλλο" },
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number]["value"];

export type ContactFields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
};

export type FieldName = keyof ContactFields;

export type FieldErrors = Partial<Record<FieldName, string>>;

export const DELIVERY_NOT_CONFIGURED_MESSAGE =
  "Τα στοιχεία ελέγχθηκαν και είναι έγκυρα. Η αποστολή email δεν έχει ρυθμιστεί ακόμη, οπότε το μήνυμα δεν στάλθηκε και δεν αποθηκεύτηκε.";

export const DELIVERY_FAILED_MESSAGE =
  "Η υπηρεσία email δεν δέχτηκε το μήνυμα. Δεν στάλθηκε και δεν εμφανίζεται ως επιτυχία.";

export const DELIVERY_SENT_MESSAGE = "Το μήνυμα στάλθηκε στην ORGANEXT.";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME = /^[\p{L}][\p{L}\s.'’-]{1,119}$/u;

export function isProjectType(value: string): value is ProjectType {
  return PROJECT_TYPES.some((item) => item.value === value);
}

export function projectLabel(value: string) {
  return PROJECT_TYPES.find((item) => item.value === value)?.label ?? value;
}

export function validateContact(input: Partial<ContactFields>):
  | { ok: true; data: ContactFields }
  | { ok: false; errors: FieldErrors } {
  const name = (input.name ?? "").trim().replace(/\s+/g, " ");
  const company = (input.company ?? "").trim().replace(/\s+/g, " ");
  const email = (input.email ?? "").trim();
  const phone = (input.phone ?? "").trim();
  const projectType = (input.projectType ?? "").trim();
  const message = (input.message ?? "").trim().replace(/\s+/g, " ");
  const errors: FieldErrors = {};

  if (!NAME.test(name)) {
    errors.name = "Συμπληρώστε ονοματεπώνυμο, με τουλάχιστον δύο χαρακτήρες.";
  }
  if (company && (company.length < 2 || company.length > 160)) {
    errors.company = "Συμπληρώστε την επωνυμία ή αφήστε το πεδίο κενό.";
  }
  if (!EMAIL.test(email) || email.length > 160) {
    errors.email = "Εισάγετε έγκυρο email.";
  }
  if (phone && !isPhone(phone)) {
    errors.phone = "Εισάγετε έγκυρο τηλέφωνο, για παράδειγμα 2100000000 ή +30 2100000000.";
  }
  if (!isProjectType(projectType)) {
    errors.projectType = "Επιλέξτε είδος έργου.";
  }
  if (message.length < 20) {
    errors.message = "Περιγράψτε τις ανάγκες με τουλάχιστον 20 χαρακτήρες.";
  } else if (message.length > 4000) {
    errors.message = "Η περιγραφή είναι μεγαλύτερη από το επιτρεπτό όριο.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    data: { name, company, email, phone, projectType, message },
  };
}

function isPhone(value: string) {
  const compact = value.replace(/[\s().-]/g, "");
  if (/^\+30\d{10}$/.test(compact)) return true;
  if (/^0030\d{10}$/.test(compact)) return true;
  if (/^\d{10}$/.test(compact)) return true;
  return false;
}

export function isEmailAddress(value: string) {
  return EMAIL.test(value) && value.length <= 160;
}

/** Accepts a plain address or `Display Name <email@domain>`. */
export function isFromAddress(value: string) {
  if (isEmailAddress(value)) return true;
  const match = value.match(/^.{1,80}<([^<>]+)>$/);
  return Boolean(match && isEmailAddress(match[1].trim()));
}
