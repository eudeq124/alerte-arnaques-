import nodemailer from 'nodemailer';
import { prisma } from './prisma';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const DEFAULT_ADMIN_EMAIL = "eudesrainier@gmail.com";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️ SMTP non configuré. L'email ne sera pas envoyé réellemennt.");
    console.log(`[SIMULATION EMAIL] Vers: ${to} | Sujet: ${subject}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Alerte Arnaques" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email envoyé avec succès à ${to}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error);
  }
}

export async function sendAdminAlert(type: 'SIGNALEMENT' | 'AIDE_JURIDIQUE', data: any) {
    const subject = `🚨 NOUVELLE ALERTE ${type} : ${data.title || 'Urgent'}`;
    
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <h2 style="color: #ef4444;">🛡️ Alerte-Arnaques : Nouveau Dossier</h2>
            <hr>
            <p><strong>Type :</strong> ${data.scamType || 'Non spécifié'}</p>
            <p><strong>Titre :</strong> ${data.title}</p>
            <p><strong>Description :</strong> ${data.description}</p>
            <p><strong>Score de Risque IA :</strong> ${data.trustScore}%</p>
            <p><strong>Niveau de Vérification :</strong> ${data.verificationLevel}</p>
            <br>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 5px;">
                <strong>Détails de l'escroc :</strong><br>
                ${data.scammerDetails || 'Aucun détail fourni'}
            </div>
            <br>
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/expert" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accéder à la Console Expert</a>
            <hr>
            <p style="font-size: 0.8rem; color: #666;">Ceci est une notification automatique du système Alerte-Arnaques.</p>
        </div>
    `;

    await sendEmail({
        to: process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
        subject,
        html
    });
}
export async function broadcastAlert(subject: string, title: string, content: string) {
    const subscribers = await (prisma as any).certifiedUser.findMany({ select: { email: true } });
    const newsletterSubscribers = await (prisma as any).subscriber.findMany({ select: { email: true } });
    
    const allEmails = Array.from(new Set([
        ...subscribers.map((s: any) => s.email),
        ...newsletterSubscribers.map((n: any) => n.email)
    ]));

    console.log(`📡 Diffusion de masse vers ${allEmails.length} destinataires...`);

    const html = `
        <div style="font-family: sans-serif; max-width: 600px; border: 5px solid #ef4444; padding: 20px; border-radius: 10px;">
            <h1 style="color: #ef4444;">🚨 ALERTE DE SÉCURITÉ URGENTE</h1>
            <h2 style="color: #111;">${title}</h2>
            <hr>
            <p style="font-size: 1.1rem; line-height: 1.6;">${content}</p>
            <br>
            <div style="background: #fdf2f2; border-left: 4px solid #ef4444; padding: 15px;">
                <strong>CONSEIL :</strong> Signalez tout message suspect immédiatement sur notre plateforme.
            </div>
            <br>
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" style="display: block; text-align: center; background: #000; color: white; padding: 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accéder à Alerte-Arnaques France</a>
            <p style="text-align: center; font-size: 0.7rem; color: #999; margin-top: 20px;">
                Vous recevez cette alerte car vous êtes inscrit sur notre réseau de cyber-vigilance.
            </p>
        </div>
    `;

    for (const email of allEmails) {
        await sendEmail({ to: email, subject: `[URGENT] ${subject}`, html });
    }
}
