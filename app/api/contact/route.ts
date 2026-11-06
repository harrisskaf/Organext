import { NextResponse } from "next/server";
import {
  DELIVERY_FAILED_MESSAGE,
  DELIVERY_NOT_CONFIGURED_MESSAGE,
  DELIVERY_SENT_MESSAGE,
  isEmailAddress,
  isFromAddress,
  projectLabel,
  validateContact,
  type ContactFields,
} from "@/lib/contact";

export const dynamic = "force-dynamic";

/** Inbox for a valid project request. */
const CONTACT_TO_EMAIL = "harrisskaf@gmail.com";

/**
 * Delivery turns on only when RESEND_API_KEY and CONTACT_FROM_EMAIL are set.
 * The recipient is CONTACT_TO_EMAIL above.
 * Until the key and sender are set, this route validates and returns an honest error.
 * It does not store the message and it never reports a false send.
 */

type HitStore = Map<string, number[]>;

const globalStore = globalThis as unknown as { __organextHits?: HitStore };
const hits: HitStore = globalStore.__organextHits ?? new Map();
globalStore.__organextHits = hits;

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

function limited(ip: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= 5) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function deliveryConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY?.trim() ?? "",
    to: CONTACT_TO_EMAIL,
    from: process.env.CONTACT_FROM_EMAIL?.trim() ?? "",
  };
}

function messageText(data: ContactFields) {
  return [
    "Νέο αίτημα από τον ιστότοπο ORGANEXT",
    "",
    `Ονοματεπώνυμο: ${data.name}`,
    `Επωνυμία: ${data.company || "—"}`,
    `Email: ${data.email}`,
    `Τηλέφωνο: ${data.phone || "—"}`,
    `Είδος έργου: ${projectLabel(data.projectType)}`,
    "",
    "Περιγραφή αναγκών:",
    data.message,
  ].join("\n");
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return json({ ok: false, code: "forbidden", message: "Η υποβολή δεν έγινε δεκτή." }, 403);
      }
    } catch {
      return json({ ok: false, code: "forbidden", message: "Η υποβολή δεν έγινε δεκτή." }, 403);
    }
  }

  if (limited(clientIp(request))) {
    return json(
      {
        ok: false,
        code: "rate_limited",
        message: "Έγιναν πολλές προσπάθειες. Περιμένετε λίγα λεπτά και δοκιμάστε ξανά. Τίποτα δεν στάλθηκε.",
      },
      429,
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json(
      { ok: false, code: "invalid", message: "Τα δεδομένα δεν ήταν έγκυρα.", errors: {} },
      400,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(
      { ok: false, code: "invalid", message: "Τα δεδομένα δεν ήταν έγκυρα.", errors: {} },
      400,
    );
  }

  if (!body || typeof body !== "object") {
    return json(
      { ok: false, code: "invalid", message: "Τα δεδομένα δεν ήταν έγκυρα.", errors: {} },
      400,
    );
  }

  const record = body as Record<string, unknown>;
  const honeypot = typeof record.companyWebsite === "string" ? record.companyWebsite.trim() : "";
  if (honeypot) {
    return json({ ok: false, code: "rejected", message: "Η υποβολή δεν έγινε δεκτή." }, 400);
  }

  const result = validateContact({
    name: typeof record.name === "string" ? record.name : "",
    company: typeof record.company === "string" ? record.company : "",
    email: typeof record.email === "string" ? record.email : "",
    phone: typeof record.phone === "string" ? record.phone : "",
    projectType: typeof record.projectType === "string" ? record.projectType : "",
    message: typeof record.message === "string" ? record.message : "",
  });

  if (!result.ok) {
    return json(
      {
        ok: false,
        code: "invalid",
        message: "Συμπληρώστε τα υποχρεωτικά πεδία.",
        errors: result.errors,
      },
      400,
    );
  }

  const config = deliveryConfig();
  if (!config.apiKey || !config.to || !config.from) {
    return json(
      { ok: false, code: "delivery_not_configured", message: DELIVERY_NOT_CONFIGURED_MESSAGE },
      503,
    );
  }

  if (!isEmailAddress(config.to) || !isFromAddress(config.from)) {
    return json(
      {
        ok: false,
        code: "delivery_misconfigured",
        message:
          "Η αποστολή είναι μερικώς ρυθμισμένη, αλλά τα email αποστολέα ή παραλήπτη δεν είναι έγκυρα. Το μήνυμα δεν στάλθηκε και δεν αποθηκεύτηκε.",
      },
      503,
    );
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: result.data.email,
        subject: `Νέο αίτημα από τον ιστότοπο ORGANEXT — ${projectLabel(result.data.projectType)}`,
        text: messageText(result.data),
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return json({ ok: false, code: "delivery_failed", message: DELIVERY_FAILED_MESSAGE }, 502);
    }
  } catch {
    return json({ ok: false, code: "delivery_failed", message: DELIVERY_FAILED_MESSAGE }, 502);
  }

  return json({ ok: true, code: "sent", message: DELIVERY_SENT_MESSAGE });
}
