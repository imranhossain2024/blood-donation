import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(payload: EmailPayload) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !pass || !from) {
    return { ok: false, skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });

  return { ok: true };
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  return sendEmail({
    to: email,
    subject: "Reset your password",
    text: `Click the link to reset your password: ${resetLink}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e11d48;">Reset Your Password</h2>
        <p>You requested a password reset for your blood donation account. Click the button below to set a new password. This link will expire in 1 hour.</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="color: #94a3b8; font-size: 12px;">${resetLink}</p>
      </div>
    `,
  });
}
