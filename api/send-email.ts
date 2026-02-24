import nodemailer, { type Transporter } from "nodemailer";
import { Client } from "@notionhq/client";
import type {
  SendEmailBody,
  SendEmailSuccessResponse,
  SendEmailErrorResponse,
  FormData,
} from "./types";

/**
 * Creates a Nodemailer transporter configured for Gmail.
 */
function createTransporter(): Transporter {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD in environment.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Send an email with HTML (and optional plain-text fallback).
 */
async function sendEmail(
  options: SendEmailBody & { subject?: string },
): Promise<{ messageId: string }> {
  const { to, subject = "No subject", html, text, replyTo } = options;

  const transporter = createTransporter();
  const from = process.env.GMAIL_USER as string;

  const mailOptions = {
    from: `"${process.env.GMAIL_FROM_NAME || "Mail Service"}" <${from}>`,
    to,
    subject,
    html,
    ...(text && { text }),
    ...(replyTo && { replyTo }),
  };

  const result = await transporter.sendMail(mailOptions);
  return { messageId: result.messageId };
}

/** Allowed Gender options in Notion (select). */
const GENDER_OPTIONS = [
  "mujer",
  "hombre",
  "no-binario",
  "otro",
  "prefiero-no-decir",
] as const;

/** Fit options in Notion (select). Form "ajuste" is mapped to these. */
const FIT_MAP: Record<string, string> = {
  suelta: "Más bien suelta",
  "mas bien suelta": "Más bien suelta",
  ajustada: "Más bien ajustada",
  "mas bien ajustada": "Más bien ajustada",
};

function toFitSelect(ajuste: string): string {
  const key = ajuste.trim().toLowerCase();
  return FIT_MAP[key] ?? "Más bien suelta";
}

/**
 * Maps a string value to Notion rich_text property.
 */
function richText(value: string): {
  rich_text: [{ text: { content: string } }];
} {
  return {
    rich_text: [{ text: { content: value || "—" } }],
  };
}

/**
 * Saves form data as a new row in the configured Notion database.
 */
async function saveToNotion(data: FormData): Promise<void> {
  const databaseId = process.env.NOTION_DB_ID;
  const notionToken = process.env.NOTION_TOKEN;

  if (!databaseId) {
    throw new Error("Missing NOTION_DB_ID in environment.");
  }
  if (!notionToken) {
    throw new Error("Missing NOTION_TOKEN in environment.");
  }

  const notion = new Client({ auth: notionToken });

  const generoNormalized = data.genero.trim().toLowerCase();
  const genderSelect =
    generoNormalized &&
    GENDER_OPTIONS.includes(generoNormalized as (typeof GENDER_OPTIONS)[number])
      ? generoNormalized
      : "prefiero-no-decir";

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: data.nombre || "—" } }],
      },
      "Last Name": richText(data.apellido),
      Email: {
        email: data.email.trim() ? data.email.trim() : null,
      },
      Gender: {
        select: { name: genderSelect },
      },
      Location: richText(data.ubicacion),
      Fit: {
        select: { name: toFitSelect(data.ajuste) },
      },
      Personality: {
        multi_select: data.personalidad
          .filter(Boolean)
          .map((name) => ({ name: String(name).trim() })),
      },
      Characteristics: richText(data.caracteristicas),
      Time: richText(data.tiempo),
      "Communications Accepted": { checkbox: data.comunicaciones },
      "Data Processing Accepted": { checkbox: data.procesamiento },
      Date: { date: { start: new Date().toISOString() } },
    },
  });
}

function setCorsHeaders(req: any, res: any) {
  const origin = req.headers.origin;
  // Always allow from frontend
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

function parseBody(body: any): any {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (_) {
      return {};
    }
  }
  return body || {};
}

function sendJson(res: any, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export default async function handler(req: any, res: any): Promise<void> {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Handle POST requests to send emails
  if (req.method === "POST") {
    try {
      const body = parseBody(req.body);

      const { to, subject, html, text, replyTo } = body as SendEmailBody;

      if (!to || typeof to !== "string") {
        sendJson(res, 400, {
          error: 'Missing or invalid "to" (recipient email)',
        } as SendEmailErrorResponse);
        return;
      }
      if (html === undefined || html === null) {
        sendJson(res, 400, {
          error: 'Missing "html" (email body as string)',
        } as SendEmailErrorResponse);
        return;
      }

      const result = await sendEmail({
        to: to.trim(),
        subject: subject != null ? String(subject) : "No subject",
        html: String(html),
        text: text != null ? String(text) : undefined,
        replyTo: replyTo != null ? String(replyTo).trim() : undefined,
      });

      // Save form data to Notion if provided
      const formData = body.formData as FormData | undefined;
      if (formData != null && typeof formData === "object") {
        try {
          await saveToNotion(formData);
        } catch (notionErr) {
          console.error(
            "[send-email] Warning: Failed to save to Notion:",
            notionErr instanceof Error ? notionErr.message : String(notionErr),
          );
          // Don't fail the request if Notion save fails
        }
      }

      sendJson(res, 200, {
        success: true,
        messageId: result.messageId,
      } as SendEmailSuccessResponse);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      sendJson(res, 500, {
        error: `Failed to send email: ${errorMessage}`,
      } as SendEmailErrorResponse);
    }
  } else {
    sendJson(res, 405, {
      error: "Method not allowed",
    } as SendEmailErrorResponse);
  }
}
