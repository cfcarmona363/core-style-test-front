import axios from "axios";

export async function sendEmail(body: unknown) {
  const base = (import.meta.env.VITE_API_BASE_URL as string) || "";
  const baseNoSlash = base.replace(/\/$/, "");
  const url = `${baseNoSlash}/send-email`;

  const response = await axios.post(url, body, {
    headers: { "Content-Type": "application/json" },
  });

  return response;
}

export default sendEmail;
