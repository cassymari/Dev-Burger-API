import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail({
  name,
  email,
  resetLink,
}) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Redefinição de senha — Dev Burger',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Olá, ${name}!</h2>

        <p>
          Recebemos uma solicitação para redefinir sua senha no Dev Burger.
        </p>

        <p>
          Clique no botão abaixo para criar uma nova senha:
        </p>

        <p>
          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #9758a6;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Redefinir minha senha
          </a>
        </p>

        <p>Esse link será válido por 30 minutos.</p>

        <p>
          Caso você não tenha solicitado a redefinição, ignore este e-mail.
        </p>
      </div>
    `,
  });
}