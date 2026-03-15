"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';

type Proof = { id: string; url: string; };
type Comment = { id: string; content: string; author: string; createdAt: string; };

type Report = {
  id: string,
  title: string,
  scamType: string,
  scammerDetails: string,
  description: string,
  createdAt: string,
  trustScore: number,
  verificationLevel: string,
  proofs: Proof[],
  comments: Comment[],
  _count: { upvotes: number, vouches: number },
  reporterId?: string
}

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // States from original component
  const [analysisText, setAnalysisText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<{ score: number, flags: string[], advice: string } | null>(null);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchReports();
    fetch("/api/admin/kyc")
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) {
              const u = data.find((u: any) => u.isCertified);
              if (u) setCurrentUser(u);
          }
      });
  }, []);

  const fetchReports = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports${query ? `?q=${query}` : ""}`);
      const data = await res.json();
      
      const reportsWithComments = await Promise.all((data || []).map(async (r: any) => {
        const cRes = await fetch(`/api/comments?reportId=${r.id}`);
        const cData = await cRes.json();
        return { ...r, comments: cData || [] };
      }));
      setReports(reportsWithComments);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(search);
  };

  const postComment = async (reportId: string) => {
    const content = newComment[reportId];
    if (!content?.trim()) return;
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, content }),
      });
      if (res.ok) {
        setNewComment(prev => ({ ...prev, [reportId]: "" }));
        fetchReports(search);
      }
    } catch (e) { console.error(e); }
  };

  const handleVouch = async (reportId: string) => {
    if (!currentUser) return alert("Certification requise.");
    const res = await fetch(`/api/reports/${reportId}/vouch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id }),
    });
    if (res.ok) fetchReports(search);
    else alert("Erreur ou déjà confirmé.");
  };

  const handleUpvote = async (reportId: string) => {
    await fetch("/api/upvote", { method: "POST", body: JSON.stringify({ reportId }) });
    fetchReports(search);
  };

  const analyzeText = () => {
    if (!analysisText.trim()) return;
    const flags: string[] = [];
    let score = 0;
    const lowerText = analysisText.toLowerCase();
    const patterns = [
      { terms: ["urgent", "immédiatement", "24h"], label: "Urgence injustifiée", weight: 30 },
      { terms: ["western union", "pcs", "coupon"], label: "Paiement intraçable", weight: 40 },
      { terms: ["banque", "virement", "bloqué"], label: "Pattern bancaire", weight: 20 }
    ];
    patterns.forEach(p => {
      if (p.terms.some(t => lowerText.includes(t))) { flags.push(p.label); score += p.weight; }
    });
    setAnalysisResult({ 
        score: Math.min(100, score), 
        flags, 
        advice: score >= 70 ? "⚠️ DANGER CRITIQUE" : score >= 30 ? "🟠 MÉFIANCE" : "🟢 RISQUE FAIBLE" 
    });
  };

  return (
    <>
      <header className="flex-center" style={{ justifyContent: 'space-between' }}>
        <Link href="/" className="nav-brand">Alerte Arnaques</Link>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/report" className="btn btn-primary">Signaler</Link>
          <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Accueil</Link>
        </nav>
      </header>

      <div className="container">
        <section className="glass-panel" style={{ marginBottom: '3rem', border: '1px solid var(--primary)' }}>
          <h2>🤖 Analyseur Intelligent</h2>
          <textarea 
            value={analysisText} onChange={(e) => setAnalysisText(e.target.value)}
            placeholder="Collez le texte suspect ici..."
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white', minHeight: '80px' }}
          />
          <button onClick={analyzeText} className="btn btn-primary" style={{ marginTop: '1rem' }}>Analyser</button>
          {analysisResult && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: `6px solid ${analysisResult.score >= 70 ? '#ef4444' : '#fbbf24'}` }}>
              <p style={{ fontWeight: 700, margin: 0 }}>{analysisResult.advice}</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Score IA: {analysisResult.score}%</p>
            </div>
          )}
        </section>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'white' }} />
          <button type="submit" className="btn btn-primary">Chercher</button>
        </form>

        <div className="grid">
          {loading ? <p>Chargement...</p> : reports.map(report => {
            const trustColor = report.trustScore >= 80 ? "#10b981" : report.trustScore >= 40 ? "#fbbf24" : "#ef4444";
            return (
              <div key={report.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: report.trustScore >= 80 ? `2px solid ${trustColor}` : '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ background: trustColor, color: 'black', fontSize: '0.6rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 900 }}>
                        {report.verificationLevel}
                    </span>
                    <h3 style={{ margin: '0.4rem 0 0 0' }}>{report.title}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: trustColor }}>CONFIANCE: {report.trustScore}%</div>
                    <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '0.2rem' }}>
                        <div style={{ width: `${report.trustScore}%`, height: '100%', background: trustColor }}></div>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', margin: 0 }}>{report.description}</p>
                
                <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.1)', padding: '0.5rem', borderRadius: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.7rem' }}>{report.scammerDetails || "Anonyme"}</code>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => handleUpvote(report.id)} className="btn" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>👍 {report._count.upvotes}</button>
                        {currentUser && <button onClick={() => handleVouch(report.id)} className="btn" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', border: '1px solid var(--primary)' }}>🤝 Confirmer</button>}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>💬 Soutien ({report.comments.length})</p>
                    <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {report.comments.map(c => (
                            <div key={c.id} style={{ fontSize: '0.8rem', marginBottom: '0.4rem', opacity: 0.8 }}>
                                <strong>{c.author}:</strong> {c.content}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem' }}>
                        <input 
                            value={newComment[report.id] || ""} 
                            onChange={(e) => setNewComment(p => ({ ...p, [report.id]: e.target.value }))}
                            placeholder="Aider..." 
                            style={{ flex: 1, padding: '0.3rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--card-border)', background: 'transparent', color: 'white' }}
                        />
                        <button onClick={() => postComment(report.id)} className="btn btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Evoyer</button>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
