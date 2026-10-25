import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  const user = process.env.NODEMAILER_MAIL;
  const pass = process.env.NODEMAILER_PASS?.replace(/\s+/g, "");

  if (!user || !pass) {
    throw new Error("NODEMAILER_MAIL o NODEMAILER_PASS no configurados");
  }

  if (!to || typeof to !== "string") {
    throw new Error("El destinatario del correo es obligatorio");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from: `"THE-LAKE" <${user}>`,
    to,
    subject,
    html,
  });

  console.log("Message sent:", info.messageId, to);
  return info;
}
