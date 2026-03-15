"use client";

import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LegalHelpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [idCard, setIdCard] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(s);
      const video = document.getElementById('webcam') as HTMLVideoElement;
      if (video) video.srcObject = s;
    } catch (e) { alert("Accès caméra refusé."); }
  };

  const takeSelfie = () => {
      const video = document.getElementById('webcam') as HTMLVideoElement;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      setSelfie(canvas.toDataURL('image/jpeg'));
      if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }
  };

  const handleSubmit = async () => {
      if (!selfie || !idCard) return alert("Identité requise.");
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
          setLoading(false);
          alert("Votre demande d'aide juridique a été transmise à nos avocats certifiés. Vous recevrez une réponse sous 48h.");
          router.push("/");
      }, 2000);
  };

  return (
    <div className="container" style={{ maxWidth: '700px', marginTop: '3rem' }}>
      <div className="glass-panel">
        <h1 style={{ textAlign: 'center' }}>⚖️ Aide Juridique Gratuite</h1>
        <p style={{ textAlign: 'center', opacity: 0.7 }}>Ce service est réservé aux victimes ayant certifié leur identité.</p>

        {step === 1 ? (
          <div style={{ marginTop: '2rem' }}>
            <h2>Étape 1 : Détails de l'Affaire</h2>
            <textarea placeholder="Expliquez brièvement votre situation et le préjudice subi..." style={{ width: '100%', height: '150px', background: 'rgba(0,0,0,0.2)', color: 'white', padding: '1rem', borderRadius: '8px' }} />
            <button onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Suivant : Certifier mon Identité</button>
          </div>
        ) : (
          <div style={{ marginTop: '2rem' }}>
            <h2>Étape 2 : Signature & Identité</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem' }}>Pièce d'Identité (CNI/Passport)</p>
                    <div style={{ height: '120px', background: '#222', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {idCard ? <img src={idCard} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : "📄"}
                    </div>
                    <input type="file" onChange={(e) => {
                        const r = new FileReader();
                        r.onloadend = () => setIdCard(r.result as string);
                        r.readAsDataURL(e.target.files![0]);
                    }} style={{ fontSize: '0.6rem', marginTop: '0.5rem' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem' }}>Selfie Preuve</p>
                    <div style={{ height: '120px', background: 'black', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                        {selfie ? <img src={selfie} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <video id="webcam" autoPlay style={{ width: '100%', height: '100%' }} />}
                    </div>
                    {!selfie && !stream && <button onClick={startCamera} className="btn" style={{ fontSize: '0.6rem', marginTop: '0.5rem' }}>Ouvrir Caméra</button>}
                    {stream && <button onClick={takeSelfie} className="btn btn-primary" style={{ fontSize: '0.6rem', marginTop: '0.5rem' }}>📸 Capturer</button>}
                    {selfie && <button onClick={() => setSelfie(null)} className="btn" style={{ fontSize: '0.6rem', marginTop: '0.5rem' }}>Refaire</button>}
                </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>{loading ? "Transmission..." : "Envoyer ma demande d'assistance ⚖️"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
