"use client";

import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReportPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scamType: "Email Frauduleux",
    scammerDetails: "",
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [idCard, setIdCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(s);
      const video = document.getElementById('webcam') as HTMLVideoElement;
      if (video) video.srcObject = s;
    } catch (err) {
      setError("Caméra non accessible. Veuillez autoriser l'accès.");
    }
  };

  const takeSelfie = () => {
    const video = document.getElementById('webcam') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const data = canvas.toDataURL('image/jpeg');
    setSelfie(data);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleIdCard = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setIdCard(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfie || !idCard) {
        setStep(2);
        return setError("L'étape de vérification d'identité est obligatoire pour authentifier votre signalement.");
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            ...formData, 
            proofsUrl: imagePreviews,
            reporterSelfie: selfie,
            reporterIdCard: idCard
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi.");
      alert("Signalement certifié envoyé !");
      router.push("/reports");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="flex-center" style={{ justifyContent: 'space-between' }}>
        <Link href="/" className="nav-brand">Alerte Arnaques</Link>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/reports" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Consulter</Link>
          <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Accueil</Link>
        </nav>
      </header>

      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>{step === 1 ? "Détails de l'Arnaque" : "Vérification de votre Identité"}</h2>
              <span style={{ fontSize: '0.8rem', background: 'var(--primary)', color: 'black', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 900 }}>Étape {step}/2</span>
          </div>

          {error && <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #ef4444' }}>{error}</div>}

          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Titre du signalement *</label>
                <input name="title" required value={formData.title} onChange={handleChange} placeholder="Ex : Faux conseiller bancaire" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Type d'arnaque *</label>
                <select name="scamType" value={formData.scamType} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.3)', color: 'white' }}>
                  <option>Email Frauduleux</option>
                  <option>Faux Profil</option>
                  <option>Site Suspect</option>
                  <option>Arnaque Bancaire</option>
                  <option>Autre</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Description détaillée *</label>
                <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} placeholder="Racontez les faits..." style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Captures d'écran (preuves)</label>
                <input type="file" multiple onChange={handleImageChange} style={{ fontSize: '0.8rem' }} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', height: '50px' }}>Suivant : Identité du Plaignant ➡️</button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #3b82f6', fontSize: '0.9rem' }}>
                🛡️ **Engagement de Responsabilité** : Pour lutter contre les fausses accusations, chaque plaignant doit s'identifier. Vos données sont cryptées et ne sont transmises qu'en cas de réquisition judiciaire.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>1. Pièce d'Identité</p>
                  <div style={{ height: '140px', border: '2px dashed var(--card-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', overflow: 'hidden', background: idCard ? 'transparent' : 'rgba(255,255,255,0.05)' }}>
                    {idCard ? <img src={idCard} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ opacity: 0.5 }}>RECTO</span>}
                  </div>
                  <input type="file" onChange={handleIdCard} style={{ fontSize: '0.7rem', width: '100%' }} />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>2. Votre Selfie (Direct)</p>
                  <div style={{ height: '140px', border: '2px dashed var(--card-border)', borderRadius: '12px', position: 'relative', overflow: 'hidden', background: 'black' }}>
                    {selfie ? (
                        <img src={selfie} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <video id="webcam" autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
                    )}
                    {!selfie && !stream && <button onClick={startCamera} className="btn" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.6rem', padding: '0.4rem' }}>Ouvrir Caméra</button>}
                  </div>
                  {stream && <button onClick={takeSelfie} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', fontSize: '0.8rem' }}>📸 Capturer Selfie</button>}
                  {selfie && <button onClick={() => setSelfie(null)} className="btn" style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.7rem' }}>❌ Refaire</button>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => setStep(1)} className="btn" style={{ flex: 1 }}>⬅️ Retour</button>
                <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ flex: 2, height: '50px' }}>{loading ? "Traitement..." : "Certifier & Envoyer ✅"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
