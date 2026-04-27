import nodemailer from "nodemailer";



export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_MAIL,
      pass: process.env.NODEMAILER_PASS,
    }
  });
    const info = await transporter.sendMail({
        from: '"ARTIS" <' + process.env.NODEMAILER_MAIL + '>',
        to: to,
        subject: subject,
        html: html,
    });
    console.log("Message sent:", info.messageId, to);
    return info;
}