const RESEND_EMAILS_URL = "https://api.resend.com/emails";

export const isEmailConfigured = () => Boolean(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from = process.env.EMAIL_FROM || "NextJob <onboarding@resend.dev>";

  const response = await fetch(RESEND_EMAILS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend email failed: ${response.status} ${errorBody}`);
  }

  return response.json();
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const safeName = name || "there";

  return sendEmail({
    to,
    subject: "Reset your NextJob password",
    text: `Hello ${safeName}, reset your NextJob password using this link: ${resetUrl}. This link expires in 15 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h1 style="font-size: 22px; margin-bottom: 12px;">Reset your NextJob password</h1>
        <p>Hello ${safeName},</p>
        <p>We received a request to reset your password. Use the button below to create a new password. This link expires in 15 minutes.</p>
        <p style="margin: 28px 0;">
          <a href="${resetUrl}" style="background: #2563eb; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">
            Reset password
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
};
