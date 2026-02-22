import { sendEmail } from "./mail";
import type {
  SendEmailBody,
  SendEmailSuccessResponse,
  SendEmailErrorResponse,
  HealthResponse,
} from "./types";

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

  if (req.method === "GET" && (req.url === "/health" || req.url === "/")) {
    sendJson(res, 200, { ok: true } as HealthResponse);
    return;
  }

  if (
    req.method === "POST" &&
    (req.url === "/send-email" || req.url?.startsWith("/send-email?"))
  ) {
    try {
      const body = parseBody(req.body);
      console.log(
        "[send-email] Request body keys:",
        Object.keys(body ?? {}),
        "has formData:",
        "formData" in (body ?? {}),
      );

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
      console.error("[send-email] Error:", err);
      sendJson(res, 500, {
        error: `Failed to send email: ${err instanceof Error ? err.message : String(err)}`,
      } as SendEmailErrorResponse);
    }
    return;
  }

  sendJson(res, 404, {
    error: "Not found",
  } as SendEmailErrorResponse);
}
