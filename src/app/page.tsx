"use client";

import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import { translations, Language } from "@/lib/i18n";

export default function Home() {
  const [lang, setLang] = useState<Language>('fr');
  const t = translations[lang];

  return (
    <>
      <header className="flex-center" style={{ justifyContent: 'space-between' }}>
        <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <img src="/logo.png" alt="Alerte Arnaques Logo" style={{ height: '40px', width: 'auto' }} />
          <span>Alerte Arnaques</span>
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
                {['fr', 'en', 'es'].map(l => (
                    <button key={l} onClick={() => setLang(l as any)} className={`btn ${lang === l ? 'btn-primary' : ''}`} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>{l.toUpperCase()}</button>
                ))}
            </div>
            <ThemesToggle />
        </div>
      </header>

      <main className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div className="glass-panel animate-slide" style={{ padding: '4rem 2rem', marginBottom: '4rem' }}>
          <h1 className="animate-float" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>{t.heroTitle}</h1>
          <p className="animate-fade delay-1" style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
            {t.heroSub}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/report" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>{t.reportBtn}</Link>
            <Link href="/reports" className="btn" style={{ fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)' }}>{t.checkBtn}</Link>
            <Link href="/threats-map" className="btn" style={{ fontSize: '1.1rem', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid var(--primary)' }}>{t.mapBtn}</Link>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Déjà +1000 Arnaques Démasquées</h1>
                    <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Rejoignez la première plateforme communautaire pilotée par l'Intelligence Artificielle pour protéger vos proches.</p>
                </div>

                <div className="grid-cols-2" style={{ gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2>📢 Signalement</h2>
                        <p>Signalez une fraude en 2 minutes. Notre IA analyse les preuves et prévient la communauté instantanément.</p>
                        <Link href="/report" className="btn btn-primary" style={{ width: '100%' }}>Lancer un Signalement</Link>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2>⚖️ Aide Juridique</h2>
                        <p>Besoin d'un avocat ? Nos experts partenaires vous aident à récupérer vos fonds et à porter plainte officiellement.</p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <Link href="/legal-help" className="btn btn-primary" style={{ flex: 1, background: '#8b5cf6' }}>Obtenir de l'aide</Link>
                            <Link href="/social-scanner" className="btn" style={{ flex: 1, border: '1px solid #8b5cf6' }}>Scanner Profil</Link>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
                    <Link href="/register" className="btn" style={{ background: 'var(--success)', color: 'white' }}>🎖️ Certifier mon Identité</Link>
                    <Link href="/dashboard" className="btn" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--success)', color: 'var(--success)' }}>👤 Mon Espace Gold</Link>
                </div>
          </div>
        </div>

        <div className="grid">
          <div className="glass-panel animate-fade delay-1" style={{ textAlign: 'left' }}>
            <h2 style={{ color: 'var(--primary)' }}>🤖 Analyseur IA</h2>
            <p>Notre intelligence heuristique analyse vos textes suspects pour détecter les pièges avant qu'ils ne se referment.</p>
            <Link href="/reports" style={{ color: 'var(--primary)', fontWeight: 700 }}>Tester l'analyseur →</Link>
          </div>
          <div className="glass-panel animate-fade delay-2" style={{ textAlign: 'left' }}>
            <h2 style={{ color: 'var(--primary)' }}>🆔 Annuaire</h2>
            <p>Consultez la liste des noms, logos et documents usurpés par les cyber-escrocs cette semaine.</p>
            <Link href="/identities" style={{ color: 'var(--primary)', fontWeight: 700 }}>Voir l'annuaire →</Link>
          </div>
          <div className="glass-panel animate-fade delay-3" style={{ textAlign: 'left', border: '1px solid var(--primary)' }}>
            <h2 style={{ color: 'var(--primary)' }}>🔍 Social Scanner</h2>
            <p>Vérifiez l'authenticité d'un profil TikTok, Insta ou FB grâce à notre IA d'analyse de comportement.</p>
            <Link href="/social-scanner" style={{ color: 'var(--primary)', fontWeight: 700 }}>Scanner un profil →</Link>
          </div>
          <div className="glass-panel animate-fade delay-3" style={{ textAlign: 'left', border: '1px solid var(--primary)' }}>
            <h2 style={{ color: 'var(--primary)' }}>🔬 Détecteur Deepfake</h2>
            <p>Analysez vos photos, vidéos et documents pour déceler toute falsification par Intelligence Artificielle.</p>
            <Link href="/deepfake-detector" style={{ color: 'var(--primary)', fontWeight: 700 }}>Vérifier un média →</Link>
          </div>
        </div>

        {/* --- NOUVELLES SECTIONS DYNAMIQUES (PHASE 16) --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '4rem', textAlign: 'left' }} className="responsive-grid">
            <section className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0 }}>🛰️ Journal des Arnaques</h2>
                    <Link href="/journal" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 900 }}>VOIR TOUT →</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <LatestNews />
                </div>
            </section>

            <section className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0 }}>📢 Conseils d'Experts</h2>
                    <Link href="/tips" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 900 }}>VOIR TOUT →</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <LatestAdvisories />
                </div>
            </section>
        </div>
      </main>

      <footer style={{ marginTop: '8rem', padding: '4rem 2rem', borderTop: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h3>📬 Restez protégé avec les Alertes Flash</h3>
          <p style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>Recevez un mail dès qu'une nouvelle arnaque massive est détectée dans votre région.</p>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
              const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              });
              if (res.ok) alert("✅ Inscription réussie ! Restez vigilant.");
            }}
            style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '3rem' }}
          >
            <input name="email" type="email" placeholder="votre@email.com" required style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'white' }} />
            <button type="submit" className="btn btn-primary">S'inscrire</button>
          </form>

          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--secondary)' }}>
            <Link href="/awareness" style={{ color: 'inherit' }}>Guides de prévention</Link>
            <Link href="/identities" style={{ color: 'inherit' }}>Annuaire des identités</Link>
            <Link href="/social-scanner" style={{ color: 'inherit' }}>IA Social Scanner</Link>
            <Link href="/threats-map" style={{ color: 'inherit' }}>Carte des menaces</Link>
            <Link href="/legal" style={{ color: 'inherit' }}>Mentions légales</Link>
            <Link href="/admin" style={{ color: 'inherit' }}>Espace Modérateur</Link>
          </div>
          <p style={{ marginTop: '3rem', fontSize: '0.8rem', opacity: 0.5 }}>&copy; 2026 Alerte Arnaques - Plateforme de confiance numérique.</p>
        </div>
      </footer>
    </>
  );
}

function ThemesToggle() {
  return (
    <button 
      onClick={() => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        window.dispatchEvent(new Event('storage'));
      }}
      className="btn"
      style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      🌓
    </button>
  );
}

function LatestNews() {
    const [news, setNews] = useState<any[]>([]);
    useEffect(() => {
        fetch("/api/news").then(r => r.json()).then(data => setNews(data.slice(0, 3)));
    }, []);

    if (news.length === 0) return <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>En attente des dernières dépêches...</p>;

    return news.map(art => (
        <div key={art.id} style={{ borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
            <div style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 900, marginBottom: '0.3rem' }}>NOUVEAU - ALERTE</div>
            <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.5rem 0' }}>{art.title}</h3>
            <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }} className="line-clamp-2">{art.summary}</p>
        </div>
    ));
}

function LatestAdvisories() {
    const [adv, setAdv] = useState<any[]>([]);
    useEffect(() => {
        fetch("/api/advisory").then(r => r.json()).then(data => setAdv(data.slice(0, 3)));
    }, []);

    if (adv.length === 0) return <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Aucun conseil d'expert publié.</p>;

    return adv.map(item => (
        <div key={item.id} style={{ borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: '0.6rem', color: '#3b82f6', fontWeight: 900, marginBottom: '0.3rem' }}>CONSEIL {item.category}</div>
                <div style={{ fontSize: '0.5rem', background: item.level === 'CRITICAL' ? '#ef4444' : '#333', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{item.level}</div>
            </div>
            <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.5rem 0' }}>{item.title}</h3>
            <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }} className="line-clamp-2">{item.content}</p>
        </div>
    ));
}
