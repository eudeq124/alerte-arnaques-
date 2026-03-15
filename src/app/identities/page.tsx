"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';

type Identity = {
  id: string;
  name: string;
  type: string;
  imageUrl: string | null;
  description: string | null;
  createdAt: string;
};

export default function IdentitiesPage() {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tous");

  useEffect(() => {
    fetchIdentities();
  }, []);

  const fetchIdentities = async () => {
    setLoading(true);
    try {
      // For now, fetching from a new API we'll create or just verify the model exists
      const res = await fetch('/api/identities');
      const data = await res.json();
      setIdentities(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredIdentities = filter === "Tous" 
    ? identities 
    : identities.filter(i => i.type === filter);

  return (
    <>
      <header className="flex-center" style={{ justifyContent: 'space-between' }}>
        <Link href="/" className="nav-brand">Alerte Arnaques</Link>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/reports" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Signalements</Link>
          <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Accueil</Link>
        </nav>
      </header>

      <div className="container">
        <h1 style={{ textAlign: 'center' }}>Annuaire des Identités Détournées</h1>
        <p style={{ textAlign: 'center', color: 'var(--secondary)', maxWidth: '700px', margin: '0 auto 3rem' }}>
          Les escrocs utilisent souvent de vrais logos d'entreprises ou de faux noms d'agents pour gagner votre confiance. 
          Vérifiez ici les identités recensées comme étant utilisées dans des fraudes.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
          {["Tous", "Logo", "Name", "Doc"].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              className="btn"
              style={{ 
                background: filter === t ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: filter === t ? 'white' : 'var(--foreground)',
                padding: '0.5rem 1.2rem'
              }}
            >
              {t === "Name" ? "Noms" : t === "Doc" ? "Documents" : t}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--secondary)' }}>Chargement de l'annuaire...</p>
        ) : (
          <div className="grid">
            {filteredIdentities.map(identity => (
              <div key={identity.id} className="glass-panel" style={{ textAlign: 'center' }}>
                {identity.imageUrl && (
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--card-border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                    <img src={identity.imageUrl} alt={identity.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                )}
                <h3 style={{ margin: '0.5rem 0' }}>{identity.name}</h3>
                <span style={{ fontSize: '0.75rem', background: 'rgba(59,130,246,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                  {identity.type}
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginTop: '1rem' }}>
                  {identity.description || "Identité utilisée dans des campagnes de phishing récentes."}
                </p>
              </div>
            ))}
            {filteredIdentities.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--secondary)' }}>
                <p>Aucune identité répertoriée dans cette catégorie pour le moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
