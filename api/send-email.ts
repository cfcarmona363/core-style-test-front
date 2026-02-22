import nodemailer, { type Transporter } from "nodemailer";
import type {
  SendEmailBody,
  SendEmailSuccessResponse,
  SendEmailErrorResponse,
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

      sendJson(res, 200, {
        success: true,
        messageId: result.messageId,
      } as SendEmailSuccessResponse);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[send-email] Error:", errorMessage);
      console.error(
        "[send-email] Stack:",
        err instanceof Error ? err.stack : "No stack",
      );
      console.error(
        "[send-email] Env check - GMAIL_USER:",
        process.env.GMAIL_USER ? "SET" : "NOT SET",
      );
      console.error(
        "[send-email] Env check - GMAIL_APP_PASSWORD:",
        process.env.GMAIL_APP_PASSWORD ? "SET" : "NOT SET",
      );
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
