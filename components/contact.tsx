"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  DELIVERY_NOT_CONFIGURED_MESSAGE,
  PROJECT_TYPES,
  isProjectType,
  validateContact,
  type ContactFields,
  type FieldErrors,
} from "@/lib/contact";

const empty: ContactFields = {
  name: "",
  company: "",
  email: "",
  phone: "",
  projectType: "",
  message: "",
};

type Banner = { tone: "error" | "warn" | "ok"; text: string } | null;

export function Contact() {
  return (
    <section className="section contact-section" id="epikoinonia" aria-labelledby="epikoinonia-title">
      <div className="wrap">
        <div className="contact-panel reveal">
          <h2 id="epikoinonia-title">Η επόμενη ψηφιακή σας ιδέα ξεκινά εδώ.</h2>
          <Suspense fallback={<ContactForm initialType="" />}>
            <ContactWithQuery />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function revealFormFeedback(selector: string) {
  window.setTimeout(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelector(selector)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
  }, 40);
}

function ContactWithQuery() {
  const params = useSearchParams();
  const value = params.get("eidos") ?? "";
  return <ContactForm initialType={isProjectType(value) ? value : ""} />;
}

function ContactForm({ initialType }: { initialType: string }) {
  const [form, setForm] = useState<ContactFields>({ ...empty, projectType: initialType });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [banner, setBanner] = useState<Banner>(null);
  const [pending, setPending] = useState(false);
  const [urlType, setUrlType] = useState(initialType);

  if (initialType !== urlType) {
    setUrlType(initialType);
    if (initialType) setForm((current) => ({ ...current, projectType: initialType }));
  }

  function update<K extends keyof ContactFields>(key: K, value: ContactFields[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function onBlur(field: keyof ContactFields) {
    const result = validateContact(form);
    setErrors((current) => {
      const next = { ...current };
      if (!result.ok && result.errors[field]) next[field] = result.errors[field];
      else delete next[field];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBanner(null);
    const result = validateContact(form);
    if (!result.ok) {
      setErrors(result.errors);
      setBanner({ tone: "error", text: "Συμπληρώστε τα υποχρεωτικά πεδία." });
      revealFormFeedback("#epikoinonia .field-error");
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...result.data,
          companyWebsite: String(new FormData(event.currentTarget).get("companyWebsite") ?? ""),
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        code?: string;
        message?: string;
        errors?: FieldErrors;
      } | null;

      if (!response.ok || !data?.ok) {
        if (data?.errors) setErrors(data.errors);
        const text =
          data?.message ||
          (data?.code === "delivery_not_configured"
            ? DELIVERY_NOT_CONFIGURED_MESSAGE
            : "Η αποστολή δεν ολοκληρώθηκε. Το μήνυμα δεν επιβεβαιώνεται ως παραδομένο.");
        setBanner({
          tone: data?.code === "delivery_not_configured" || data?.code === "delivery_misconfigured" ? "warn" : "error",
          text,
        });
        revealFormFeedback(data?.errors && Object.keys(data.errors).length > 0 ? "#epikoinonia .field-error" : "#form-status");
        return;
      }

      setForm({ ...empty, projectType: initialType });
      setBanner({ tone: "ok", text: data.message || "Το μήνυμα στάλθηκε στην ORGANEXT." });
      revealFormFeedback("#form-status");
    } catch {
      setBanner({
        tone: "error",
        text: "Η αποστολή δεν ολοκληρώθηκε. Ελέγξτε τη σύνδεση και δοκιμάστε ξανά. Το μήνυμα δεν επιβεβαιώνεται ως παραδομένο.",
      });
      revealFormFeedback("#form-status");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="contact-form reveal" onSubmit={onSubmit} noValidate>
      {banner ? (
        <div className={`form-banner is-${banner.tone}`} id="form-status" role="alert">
          {banner.text}
        </div>
      ) : null}
      <div className="pair">
        <Field
          id="name"
          label="Ονοματεπώνυμο"
          error={errors.name}
          value={form.name}
          autoComplete="name"
          maxLength={120}
          onChange={(value) => update("name", value)}
          onBlur={() => onBlur("name")}
        />
        <Field
          id="company"
          label="Επωνυμία"
          hint="προαιρετικό"
          error={errors.company}
          value={form.company}
          autoComplete="organization"
          maxLength={160}
          onChange={(value) => update("company", value)}
          onBlur={() => onBlur("company")}
        />
      </div>
      <div className="pair">
        <Field
          id="email"
          label="Email"
          type="email"
          error={errors.email}
          value={form.email}
          autoComplete="email"
          inputMode="email"
          maxLength={160}
          onChange={(value) => update("email", value)}
          onBlur={() => onBlur("email")}
        />
        <Field
          id="phone"
          label="Τηλέφωνο"
          hint="προαιρετικό"
          type="tel"
          error={errors.phone}
          value={form.phone}
          autoComplete="tel"
          inputMode="tel"
          maxLength={40}
          onChange={(value) => update("phone", value)}
          onBlur={() => onBlur("phone")}
        />
      </div>
      <div className="field">
        <label htmlFor="projectType">Είδος έργου</label>
        <select
          id="projectType"
          name="projectType"
          value={form.projectType}
          data-empty={form.projectType ? "false" : "true"}
          aria-invalid={errors.projectType ? true : undefined}
          aria-describedby={errors.projectType ? "projectType-error" : undefined}
          onChange={(event) => update("projectType", event.target.value)}
          onBlur={() => onBlur("projectType")}
        >
          <option value="">Επιλέξτε είδος έργου</option>
          {PROJECT_TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {errors.projectType ? (
          <p className="field-error" id="projectType-error">
            {errors.projectType}
          </p>
        ) : null}
      </div>
      <div className="field">
        <label htmlFor="message">Περιγραφή αναγκών</label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          maxLength={4000}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : "message-hint"}
          onChange={(event) => update("message", event.target.value)}
          onBlur={() => onBlur("message")}
        />
        <p className="field-hint" id="message-hint">
          Τουλάχιστον 20 χαρακτήρες.
        </p>
        {errors.message ? (
          <p className="field-error" id="message-error">
            {errors.message}
          </p>
        ) : null}
      </div>
      <div className="hp" aria-hidden="true">
        <label>
          Ιστότοπος
          <input tabIndex={-1} autoComplete="off" name="companyWebsite" defaultValue="" />
        </label>
      </div>
      <button className="btn btn-primary submit" type="submit" disabled={pending} aria-busy={pending}>
        {pending ? "Έλεγχος…" : "Αποστολή αιτήματος"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
  maxLength?: number;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {hint ? <span> {hint}</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      {error ? (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
