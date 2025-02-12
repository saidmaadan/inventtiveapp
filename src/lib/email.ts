import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const createPasswordResetEmail = (resetUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; }
    .footer { margin-top: 20px; font-size: 0.9em; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Reset Your Password</h2>
    <p>You requested to reset your password. Click the button below to set a new password:</p>
    <p><a href="${resetUrl}" class="button">Reset Password</a></p>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <p>This link will expire in 1 hour.</p>
    <div class="footer">
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
    </div>
  </div>
</body>
</html>
`;

const createVerificationEmail = (verifyUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; }
    .footer { margin-top: 20px; font-size: 0.9em; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Verify Your Email</h2>
    <p>Thanks for signing up! Click the button below to verify your email address:</p>
    <p><a href="${verifyUrl}" class="button">Verify Email</a></p>
    <p>If you didn't create an account, you can safely ignore this email.</p>
    <div class="footer">
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${verifyUrl}</p>
    </div>
  </div>
</body>
</html>
`;

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured');
    return;
  }

  try {
    if (!process.env.EMAIL_FROM) {
      throw new Error('EMAIL_FROM environment variable is not configured');
    }

    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log('Email sent successfully:', { to, subject });
    return data;
  } catch (error) {
    console.error('Failed to send email:', {
      error,
      to,
      subject,
      resendApiKeyConfigured: !!process.env.RESEND_API_KEY,
      emailFromConfigured: !!process.env.EMAIL_FROM
    });
    throw error;
  }
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/new-password?token=${token}`;
  return sendEmail({
    to,
    subject: 'Reset Your Password',
    html: createPasswordResetEmail(resetUrl)
  });
}

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;
  return sendEmail({
    to,
    subject: 'Verify Your Email',
    html: createVerificationEmail(verifyUrl)
  });
}
