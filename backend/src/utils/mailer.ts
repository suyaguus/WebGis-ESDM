import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp-relay.brevo.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Reset Password SIGAT</title>
    </head>
    <body style="margin:0;padding:0;background:#F0F4F8;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:16px;border:1px solid #E2E8F0;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">

              <!-- Header -->
              <tr>
                <td style="background:#F59E0B;padding:28px 32px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:rgba(255,255,255,0.2);border-radius:10px;width:40px;height:40px;text-align:center;vertical-align:middle;">
                        <span style="font-size:20px;color:#fff;">🔐</span>
                      </td>
                      <td style="padding-left:12px;">
                        <p style="margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:0.08em;">SIGAT</p>
                        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.8);">Sistem Informasi Geologi dan Air Tanah</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:32px 32px 24px;">
                  <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#0F172A;">Reset Password</p>
                  <p style="margin:0 0 24px;font-size:13px;color:#64748B;line-height:1.6;">
                    Kami menerima permintaan reset password untuk akun Anda.<br/>
                    Gunakan kode OTP berikut untuk melanjutkan:
                  </p>

                  <!-- OTP Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                    <tr>
                      <td align="center" style="background:#FFF7ED;border:2px dashed #F59E0B;border-radius:12px;padding:20px;">
                        <p style="margin:0 0 4px;font-size:10px;font-weight:600;color:#92400E;letter-spacing:0.15em;text-transform:uppercase;">Kode OTP Anda</p>
                        <p style="margin:0;font-size:40px;font-weight:800;color:#D97706;letter-spacing:0.2em;font-family:'Courier New',monospace;">${otp}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Warning -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                    <tr>
                      <td style="background:#FEF3C7;border-left:4px solid #F59E0B;border-radius:0 8px 8px 0;padding:12px 16px;">
                        <p style="margin:0;font-size:12px;color:#92400E;line-height:1.5;">
                          ⏱️ Kode berlaku selama <strong>15 menit</strong> sejak email ini dikirim.<br/>
                          🔒 Jangan bagikan kode ini kepada siapapun.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">
                    Jika Anda tidak meminta reset password, abaikan email ini. Akun Anda tetap aman.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:16px 32px;">
                  <p style="margin:0;font-size:11px;color:#94A3B8;text-align:center;">
                    © 2026 Dinas ESDM Provinsi Lampung · SIGAT
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"SIGAT ESDM" <${process.env.SMTP_USER}>`,
    to,
    subject: `[SIGAT] Kode OTP Reset Password Anda`,
    html,
  });
}
