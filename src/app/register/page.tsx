"use client";

import { useState, useRef } from "react";
import { translations, Language } from "@/lib/i18n";
import Link from 'next/link';

export default function RegisterKYC() {
  const [lang, setLang] = useState<Language>('fr');
  const t = translations[lang];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    country: "",
    phone: "",
    gmailAccount: "",
    latitude: 0,
    longitude: 0,
  });

  const [idPhoto, setIdPhoto] = useState("");
  const [selfiePhoto, setSelfiePhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData({ ...formData, latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        alert("📍 Position GPS synchronisée !");
      });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) { alert("Caméra non disponible"); }
  };

  const takeSelfie = () => {
    const canvas = document.createElement("canvas");
    if (videoRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
        setSelfiePhoto(canvas.toDataURL("image/png"));
        // Stop stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, idCardPhoto: idPhoto, selfiePhoto }),
      });
      if (res.ok) {
        alert("✅ Dossier envoyé ! Un modérateur va vérifier votre identité dans les 24h.");
        window.location.href = "/";
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', padding: '4rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
            {['fr', 'en', 'es'].map(l => (
                <button key={l} onClick={() => setLang(l as any)} className={`btn ${lang === l ? 'btn-primary' : ''}`} style={{ fontSize: '0.7rem' }}>{l.toUpperCase()}</button>
            ))}
        </div>
        <h1>{t.registerTitle}</h1>
        <p style={{ color: 'var(--secondary)' }}>{t.registerSub}</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <input placeholder={t.firstName} required onChange={(e)=>setFormData({...formData, firstName: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'white' }} />
                   <input placeholder={t.lastName} required onChange={(e)=>setFormData({...formData, lastName: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'white' }} />
                </div>
                <input placeholder="Email Gmail" type="email" required onChange={(e)=>setFormData({...formData, gmailAccount: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'white' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <input placeholder={t.city} onChange={(e)=>setFormData({...formData, city: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'white' }} />
                   <input placeholder={t.country} onChange={(e)=>setFormData({...formData, country: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'white' }} />
                </div>
                <input placeholder={t.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'white' }} />
                <button onClick={handleGPS} className="btn" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--primary)' }}>{t.gpsBtn}</button>
                <button onClick={() => setStep(2)} className="btn btn-primary" style={{ marginTop: '1rem' }}>Suivant →</button>
            </div>
        )}

        {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t.idCard}</label>
                    <input type="file" onChange={(e) => handleFile(e, setIdPhoto)} style={{ color: 'var(--secondary)' }} />
                    {idPhoto && <img src={idPhoto} style={{ width: '100%', height: '100px', objectFit: 'cover', marginTop: '1rem', borderRadius: '8px' }} />}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t.selfie}</label>
                    {!selfiePhoto ? (
                        <>
                            <video ref={videoRef} autoPlay style={{ width: '100%', borderRadius: '8px', background: 'black', marginBottom: '1rem' }} />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={startCamera} className="btn">Démarrer Caméra</button>
                                <button onClick={takeSelfie} className="btn btn-primary">📸 Capturer</button>
                            </div>
                        </>
                    ) : (
                        <div>
                            <img src={selfiePhoto} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                            <button onClick={() => setSelfiePhoto("")} className="btn" style={{ marginTop: '0.5rem' }}>Recommencer</button>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setStep(1)} className="btn" style={{ flex: 1 }}>← Retour</button>
                    <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
                        {loading ? "Envoi du dossier..." : t.submitRegister}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
