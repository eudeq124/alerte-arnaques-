"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, we fetch the first certified user
    // In production, sync with next-auth session
    fetch("/api/admin/kyc")
      .then(res => res.json())
      .then(data => {
          if (data && data.length > 0) {
              const u = data.find((u: any) => u.isCertified) || data[0];
              setUser(u);
          }
          setLoading(false);
      });
  }, []);

  if (loading) return <div className="container">Accès au portail sécurisé...</div>;
  if (!user) return <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
    <h1>Accès Refusé</h1>
    <p>Vous devez être un utilisateur certifié pour accéder à cet espace.</p>
    <Link href="/register" className="btn btn-primary">Se certifier maintenant</Link>
  </div>;

  return (
    <>
      <header className="flex-center" style={{ justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--success)' }}>
        <Link href="/" className="nav-brand">Alerte Arnaques <span style={{ color: 'var(--success)' }}>GOLD</span></Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem' }}>{user.firstName} {user.lastName}</span>
            <Link href="/" className="btn">Accueil</Link>
        </div>
      </header>

      <main className="container" style={{ marginTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            
            <aside className="glass-panel" style={{ textAlign: 'center', height: 'fit-content' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                    <img src={user.selfiePhoto} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--success)' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--success)', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>✅</div>
                </div>
                <h3>{user.firstName} {user.lastName}</h3>
                <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{user.city}, {user.country}</p>
                
                <div style={{ marginTop: '2rem', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--success)' }}>
                    <p style={{ margin: 0, fontWeight: 800, color: 'var(--success)' }}>STATUT : CERTIFIÉ</p>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Identité vérifiée par Agent Forensique</p>
                </div>
                
                <div style={{ marginTop: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Position GPS :</span>
                        <span style={{ color: 'var(--primary)' }}>{user.latitude.toFixed(2)}, {user.longitude.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Membre depuis :</span>
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </aside>

            <section>
                <h2 style={{ marginBottom: '2rem' }}>Mes Enquêtes & Contributions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <h4 style={{ margin: '0 0 1rem 0' }}>🏆 Avantages Membre Gold</h4>
                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--secondary)', fontSize: '0.9rem' }}>
                            <li>Priorité de traitement par l'Agent IA (Review instantanée).</li>
                            <li>Badge de certification visible sur vos signalements.</li>
                            <li>Accès aux rapports d'enquête plus détaillés.</li>
                            <li>Droit de vote doublé sur les alertes communautaires.</li>
                        </ul>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
                        <p>Vous n'avez pas encore soumis de signalement certifié.</p>
                        <Link href="/report" className="btn btn-primary">Soumettre mon premier rapport certifié</Link>
                    </div>
                </div>
            </section>
        </div>
      </main>
    </>
  );
}
