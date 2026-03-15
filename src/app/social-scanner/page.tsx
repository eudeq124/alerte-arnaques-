"use client";

import { useState } from "react";
import Link from 'next/link';

export default function SocialScannerPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [platform, setPlatform] = useState("Facebook");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startScan = async () => {
    if (!profileUrl) return;
    setLoading(true);
    try {
      const res = await fetch("/api/social-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, profileUrl }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      alert("Erreur serveur lors de l'analyse IA.");
    } finally {
      setLoading(false);
    }
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

      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>🤖 Scanner IA OSINT</h1>
            <p style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}>Analysez les profils suspects sur les réseaux sociaux avant de leur faire confiance.</p>
        </div>

        <div className="glass-panel" style={{ border: '1px solid var(--primary)' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <select 
                    value={platform} onChange={(e) => setPlatform(e.target.value)}
                    style={{ padding: '1rem', borderRadius: '8px', background: '#222', border: '1px solid #444', color: 'white' }}
                >
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>LinkedIn</option>
                    <option>X / Twitter</option>
                </select>
                <input 
                    value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)}
                    placeholder="Collez l'URL du profil suspect ici..."
                    style={{ flex: 1, padding: '1rem', borderRadius: '8px', background: '#222', border: '1px solid #444', color: 'white', minWidth: '300px' }}
                />
                <button onClick={startScan} disabled={loading} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                    {loading ? "ANALYSE IA EN COURS..." : "Scanner le profil 🔍"}
                </button>
            </div>
        </div>

        {result && (
            <div style={{ marginTop: '3rem' }}>
                <div className="glass-panel" style={{ borderLeft: `8px solid ${result.isFake ? '#ef4444' : '#10b981'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ color: result.isFake ? '#ef4444' : '#10b981' }}>
                                {result.isFake ? "🚨 PROFIL FRAUDULEUX DÉTECTÉ" : "✅ PROFIL PROBABLEMENT AUTHENTIQUE"}
                            </h2>
                            <p style={{ opacity: 0.7 }}>{result.profileUrl}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{result.riskScore}%</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>INDICE DE RISQUE</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>🔎 Points de Détection IA</h3>
                            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                                {result.detections.map((d: string, i: number) => (
                                    <li key={i} style={{ marginBottom: '0.5rem' }}>{d}</li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>📝 Conclusion de l'Enquête</h3>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.9 }}>{result.aiSummary}</p>
                            {result.isFake && (
                                <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', background: '#ef4444' }}>
                                    Signaler globalement 📢
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div style={{ marginTop: '4rem', opacity: 0.5, textAlign: 'center', fontSize: '0.8rem' }}>
            Powered by DeepProtect OSINT Intelligence v2.1 — Bases de données sociales synchronisées
        </div>
      </div>
    </>
  );
}
