"use client";

import { useState } from "react";
import Link from 'next/link';

export default function DeepfakeDetectorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeFile = async () => {
    if (!file) return;
    setAnalyzing(true);
    setResult(null);
    setProgress(10);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 400);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const res = await fetch("/api/deepfake-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileData: reader.result,
            fileName: file.name,
            fileType: file.type
          }),
        });
        const data = await res.json();
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setResult(data);
          setAnalyzing(false);
        }, 500);
      };
    } catch (e) {
      clearInterval(interval);
      setAnalyzing(false);
      alert("Erreur d'analyse");
    }
  };

  return (
    <>
      <header className="flex-center" style={{ justifyContent: 'space-between' }}>
        <Link href="/" className="nav-brand">Alerte Arnaques</Link>
        <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Accueil</Link>
      </header>

      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <h1 style={{ marginBottom: '1rem' }}>🔬 Détecteur de Deepfakes IA</h1>
          <p style={{ color: 'var(--secondary)', marginBottom: '3rem' }}>
            Soumettez une photo, une vidéo ou un document pour vérifier s'il a été généré ou modifié par une Intelligence Artificielle.
          </p>

          <div 
            style={{ 
              border: '2px dashed var(--card-border)', 
              padding: '3rem', 
              borderRadius: '16px', 
              background: 'rgba(255,255,255,0.02)',
              marginBottom: '2rem',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input id="fileInput" type="file" onChange={handleUpload} style={{ display: 'none' }} accept="image/*,video/*,application/pdf" />
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{file ? '📄' : '📤'}</div>
            <p style={{ margin: 0 }}>{file ? file.name : "Cliquez pour sélectionner un fichier"}</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Format supportés : JPG, PNG, MP4, PDF (max 10MB)</p>
          </div>

          <button 
            onClick={analyzeFile} 
            disabled={!file || analyzing} 
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          >
            {analyzing ? "Analyse Forensique en cours..." : "Lancer l'Analyse"}
          </button>

          {analyzing && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
              </div>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: 'var(--primary)' }}>Scan des couches de pixels : {progress}%</p>
            </div>
          )}

          {result && (
            <div style={{ marginTop: '3rem', textAlign: 'left', animation: 'fadeIn 0.5s' }}>
              <div style={{ 
                padding: '2rem', 
                borderRadius: '12px', 
                border: `2px solid ${result.aiScore >= 50 ? '#ef4444' : '#10b981'}`,
                background: result.aiScore >= 50 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ margin: 0 }}>Verdict : {result.verdict}</h2>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{result.confidence}% <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Confiance</span></div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <p style={{ fontWeight: 700, margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Points de contrôle IA :</p>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--secondary)' }}>
                    {result.findings.map((f: string, i: number) => <li key={i}>{f}</li>)}
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>Certificat ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)' }}>🛡️ {result.seal}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
