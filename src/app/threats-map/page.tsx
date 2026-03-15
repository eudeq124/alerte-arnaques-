"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';

type ThreatPoint = {
  id: string;
  name: string;
  count: number;
  x: number; // Percentage
  y: number; // Percentage
  type: string;
};

export default function ThreatsMapPage() {
  const [threats, setThreats] = useState<ThreatPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/threats-map')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setThreats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="flex-center" style={{ justifyContent: 'space-between' }}>
        <Link href="/" className="nav-brand">Alerte Arnaques</Link>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/reports" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Signalements</Link>
          <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Accueil</Link>
        </nav>
      </header>

      <div className="container" style={{ textAlign: 'center' }}>
        <h1>🗺️ Carte des Menaces en Temps Réel</h1>
        <p style={{ color: 'var(--secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Visualisez les foyers d'activités frauduleuses signalés par la communauté ces dernières 24 heures.
        </p>

        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', height: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
          {/* Mock France Map with dots */}
          <div style={{ position: 'absolute', inset: '40px', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '20px' }}>
             {/* Dynamic points */}
             {threats.map(t => (
               <div 
                key={t.id} 
                className="pulse"
                style={{ 
                  position: 'absolute', 
                  left: `${t.x}%`, 
                  top: `${t.y}%`, 
                  width: '12px', 
                  height: '12px', 
                  background: t.count > 30 ? '#ef4444' : '#fbbf24', 
                  borderRadius: '50%',
                  cursor: 'pointer',
                  boxShadow: `0 0 20px ${t.count > 30 ? '#ef4444' : '#fbbf24'}`
                }}
               >
                 <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: 'black', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', marginTop: '5px', opacity: 0.8 }}>
                   {t.name}: {t.count} alertes
                 </div>
               </div>
             ))}
          </div>
          <p style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', opacity: 0.5 }}>Visualisation schématique de la vigilance nationale</p>
        </div>

        <div className="grid" style={{ marginTop: '4rem' }}>
          <div className="glass-panel">
            <h3>📈 Top Menaces</h3>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>🔴 <strong>Île-de-France</strong> : Arnaques bancaires (+15%)</li>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>🟡 <strong>PACA</strong> : Phishing SMS colis</li>
              <li style={{ padding: '0.5rem 0' }}>🟡 <strong>Grand Est</strong> : Faux contrats énergie</li>
            </ul>
          </div>
          <div className="glass-panel">
            <h3>🛡️ Protection</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>
              La carte montre une activité accrue sur les "Faux Conseillers" ce soir. Ne donnez jamais vos codes d'accès par téléphone.
            </p>
            <Link href="/awareness" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>Relire les guides</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pulse {
          animation: pulse-animation 2s infinite;
        }
        @keyframes pulse-animation {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
