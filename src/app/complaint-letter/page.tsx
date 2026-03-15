"use client";

import { useState } from "react";
import Link from 'next/link';

export default function LetterGeneratorPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    bankName: "",
    scamDate: "",
    amount: "",
    scamDescription: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateLetter = () => {
    const today = new Date().toLocaleDateString('fr-FR');
    return `
OBJET : Déclaration de fraude et demande de remboursement / opposition

Fait le ${today}, à [Votre Ville]

À l'attention de : SERVICES CLIENTS - ${formData.bankName || '[Nom de votre Banque]'}

Madame, Monsieur,

Je soussigné(e) ${formData.name || '[Votre Nom]'}, demeurant au ${formData.address || '[Votre Adresse]'}, souhaite par la présente vous informer d'une opération frauduleuse survenue sur mon compte.

En date du ${formData.scamDate || '[Date de l\'arnaque]'}, j'ai été victime d'une escroquerie consistant en : ${formData.scamDescription || '[Description de l\'arnaque]'}.
Le préjudice financier s'élève à ${formData.amount || '0'} €.

Conformément aux articles L133-18 et suivants du Code monétaire et financier, je sollicite par la présente la mise en œuvre de la procédure de remboursement des sommes indûment débitées / ou je confirme ma demande d'opposition.

Je joins à ce courrier la copie du signalement effectué sur la plateforme Alerte Arnaques (ID: [Optionnel]).

Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Signature : 
__________________________
    `.trim();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateLetter());
    alert("Lettre copiée dans le presse-papier !");
  };

  return (
    <>
      <header className="flex-center" style={{ justifyContent: 'space-between' }}>
        <Link href="/" className="nav-brand">Alerte Arnaques</Link>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/reports" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Signalements</Link>
          <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Accueil</Link>
        </nav>
      </header>

      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-panel">
          <h1>🛡️ Générateur de Lettre de Plainte</h1>
          <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
            Vous avez été victime ? Ce générateur vous aide à rédiger un courrier formel pour votre banque ou une plainte. 
            <strong> Nous ne stockons aucune de ces données personnelles.</strong>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Votre Nom Complet</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Jean Dupont" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'white' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Votre Banque</label>
                <input name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Ex: BNP, Crédit Mutuel..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'white' }} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Votre Adresse</label>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="123 rue de la Paix, 75000 Paris" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'white' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Date de l'Arnaque</label>
                <input type="date" name="scamDate" value={formData.scamDate} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'white' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Montant Perdu (€)</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Ex: 500" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'white' }} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Brève description des faits</label>
              <textarea name="scamDescription" value={formData.scamDescription} onChange={handleChange} placeholder="Ex: Phishing par SMS m'invitant à payer des frais de port..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'white', minHeight: '100px' }} />
            </div>

            {/* PREVIEW SECTION */}
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'white', color: '#1a1a1a', borderRadius: '8px', whiteSpace: 'pre-wrap', fontFamily: 'serif', fontSize: '0.95rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              {generateLetter()}
            </div>

            <button onClick={copyToClipboard} className="btn btn-primary" style={{ marginTop: '1rem' }}>📄 Copier la lettre pour Word / Email</button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--secondary)' }}>Note: Ce document est une aide à la rédaction et ne remplace pas un avis juridique professionnel.</p>
          </div>
        </div>
      </div>
    </>
  );
}
