"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

type Report = {
  id: string;
  title: string;
  scamType: string;
  isVerified: boolean;
  createdAt: string;
  user?: { email: string };
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchReports();
    }
  }, [status]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      if (!res.ok) throw new Error('Accès refusé');
      const data = await res.json();
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoginLoading(false);
    if (result?.error) {
      setLoginError("Email ou mot de passe incorrect.");
    }
  };

  const toggleVerification = async (id: string, isVerified: boolean) => {
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isVerified: !isVerified }),
    });
    fetchReports();
  };

  const deleteReport = async (id: string) => {
    if (!confirm('Supprimer ce signalement définitivement ?')) return;
    await fetch('/api/admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchReports();
  };

  // --- LOGIN PAGE ---
  if (status === 'unauthenticated') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ maxWidth: '420px', width: '100%' }}>
          <h1 style={{ textAlign: 'center', color: 'var(--danger)', marginBottom: '0.5rem' }}>🔒 Espace Modérateur</h1>
          <p style={{ textAlign: 'center', color: 'var(--secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Cette zone est réservée aux administrateurs.</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="admin-email" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Email</label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@alerte-arnaques.fr"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="admin-password" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Mot de passe</label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)' }}
              />
            </div>

            {loginError && (
              <p style={{ color: 'var(--danger)', fontSize: '0.9rem', margin: 0 }}>{loginError}</p>
            )}

            <button type="submit" className="btn btn-primary" disabled={loginLoading} style={{ marginTop: '0.5rem' }}>
              {loginLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link href="/" style={{ color: 'var(--secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>← Retour au site</Link>
          </div>
        </div>
      </div>
    );
  }

  // --- LOADING STATE ---
  if (status === 'loading') {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--secondary)' }}>Chargement...</div>;
  }

  // --- DASHBOARD ---
  return (
    <>
      <header className="flex-center" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--danger)', marginBottom: '2rem' }}>
        <Link href="/" className="nav-brand" style={{ color: 'var(--danger)' }}>⚠ Alerte Arnaques — Admin</Link>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{session?.user?.email}</span>
          <button onClick={() => signOut({ callbackUrl: '/admin' })} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.1)' }}>Déconnexion</button>
          <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Retour au site</Link>
        </nav>
      </header>

      <h1>Tableau de bord de modération</h1>
      
      {/* STATS RAPIDES - DESIGN PREMIUM */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="glass-panel" style={{ textAlign: 'left', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1, fontSize: '3rem' }}>📁</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 900, letterSpacing: '0.1rem' }}>FLUX TOTAL</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{reports.length}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '0.5rem' }}>Signalements reçus 100% réels</div>
          </div>
          <div className="glass-panel" style={{ textAlign: 'left', padding: '1.5rem', borderTop: '2px solid var(--success)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1, fontSize: '3rem' }}>✅</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 900, letterSpacing: '0.1rem' }}>ARCHIVES VÉRIFIÉES</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--success)' }}>{reports.filter(r => r.isVerified).length}</div>
              <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '1rem' }}>
                  <div style={{ height: '100%', width: `${(reports.filter(r => r.isVerified).length / (reports.length || 1)) * 100}%`, background: 'var(--success)', borderRadius: '2px' }} />
              </div>
          </div>
          <div className="glass-panel" style={{ textAlign: 'left', padding: '1.5rem', borderTop: '2px solid var(--warning)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1, fontSize: '3rem' }}>⏳</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 900, letterSpacing: '0.1rem' }}>EN ATTENTE IA</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--warning)' }}>{reports.filter(r => !r.isVerified).length}</div>
              <p style={{ fontSize: '0.7rem', color: 'var(--warning)', marginTop: '0.5rem' }}>Nécessite une analyse experte</p>
          </div>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/admin/expert" className="btn" style={{ background: 'var(--primary)', color: 'black', fontWeight: 700 }}>🕵️‍♂️ Console Expert (IA)</Link>
          <Link href="/admin/advisory" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>🛰️ Gérer le Journal & Avis de Sécurité</Link>
      </div>
      <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
        Gérez les signalements soumis. <strong style={{ color: 'var(--warning)' }}>Approuvez uniquement les signalements vérifiés</strong> pour éviter la diffamation.
      </p>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--secondary)' }}>Chargement des signalements...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Titre</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Statut</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: 'var(--secondary)', fontSize: '0.85rem' }}>
                    {new Date(report.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{report.title}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(59,130,246,0.2)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {report.scamType}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {report.isVerified
                      ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ Publié</span>
                      : <span style={{ color: 'var(--warning)', fontWeight: 600 }}>En attente</span>
                    }
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => toggleVerification(report.id, report.isVerified)}
                        className="btn"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: report.isVerified ? 'var(--warning)' : 'var(--success)', color: 'white' }}
                      >
                        {report.isVerified ? 'Masquer' : 'Approuver'}
                      </button>
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="btn"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'var(--danger)', color: 'white' }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--secondary)' }}>
                    Aucun signalement à modérer. 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
