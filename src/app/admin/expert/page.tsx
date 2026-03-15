"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ExpertConsole() {
    const [investigations, setInvestigations] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('ia');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Détection de l'environnement Electron
        if (typeof window !== 'undefined' && (window as any).electronAPI) {
            setIsDesktop(true);
        }

        setLoading(true);
        fetch("/api/admin/investigations")
            .then(res => {
                if (!res.ok) throw new Error("Erreur serveur");
                return res.json();
            })
            .then(data => {
                if (data.investigations) setInvestigations(data.investigations);
                else if (Array.isArray(data)) setInvestigations(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleAction = async (id: string, action: string) => {
        try {
            if (action === "MASS_ALERT") {
                const inv = investigations.find(i => i.id === id);
                await fetch("/api/admin/broadcast", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        title: `Alerte : ${inv.report.scamType} - ${inv.report.title}`,
                        content: `Le système Alerte-Arnaques a validé un nouveau dossier de fraude critique. Prudence : ${inv.aiSummary}`
                    }),
                });
                alert("📢 Alerte de masse envoyée réellement par email !");
                return;
            }

            const res = await fetch("/api/admin/investigations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ investigationId: id, status: action }),
            });
            if (res.ok) {
                // Refresh list
                const data = await fetch("/api/admin/investigations").then(r => r.json());
                setInvestigations(data.investigations || []);
            }
        } catch (e) {
            alert("Erreur lors de l'action admin.");
        }
    };

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#e5e7eb', padding: isDesktop ? '1rem 2rem' : '2rem' }}>
            {!isDesktop && (
                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                    <Link href="/admin" style={{ color: 'var(--primary)', textDecoration: 'none' }}>← Retour Dashboard</Link>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>SYSTEME EXPERT ALERTE-ARNAQUES (V11)</h1>
                    <div style={{ background: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem' }}>LIVE PROTECTION ACTIVE</div>
                </header>
            )}

            {isDesktop && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#111', padding: '0.8rem', borderRadius: '8px', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src="/logo.png" style={{ height: '24px' }} alt="Logo" />
                        <span style={{ fontWeight: 900, letterSpacing: '1px', fontSize: '0.9rem' }}>CONSOLE EXPERT IA - DESKTOP PRO</span>
                    </div>
                    <div style={{ background: '#3b82f6', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.6rem', fontWeight: 900 }}>DESKTOP SECURE MODE</div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '2rem' }}>
                {/* SIDEBAR NAVIGATION */}
                <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={() => setActiveTab('ia')} className="btn" style={{ textAlign: 'left', background: activeTab === 'ia' ? '#333' : 'transparent' }}>🤖 Investigations IA</button>
                    <button onClick={() => setActiveTab('kyc')} className="btn" style={{ textAlign: 'left', background: activeTab === 'kyc' ? '#333' : 'transparent' }}>👤 Vérification Plaignants</button>
                    <div style={{ marginTop: 'auto', padding: '1rem', background: '#111', borderRadius: '8px', border: '1px solid #222', fontSize: '0.7rem' }}>
                        <p style={{ fontWeight: 900, color: 'var(--primary)' }}>STATISTIQUES LIVE</p>
                        <p>Total Investigations : {investigations.length}</p>
                        <p>Actions de Justice : {investigations.filter(i => i.status === 'PROSECUTED').length}</p>
                    </div>
                </div>

                {/* MAIN CONSOLE */}
                <div style={{ flex: 1, background: '#111', borderRadius: '12px', padding: '1.5rem', border: '1px solid #333' }}>
                    
                    {loading && <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>🤖 ANALYSE IA EN COURS...</div>}
                    {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', border: '1px solid #ef4444' }}>⚠️ {error}</div>}
                    
                    {!loading && !error && investigations.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed #222', borderRadius: '12px', opacity: 0.5 }}>
                            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>📭 Aucun dossier suspect détecté</p>
                            <p style={{ fontSize: '0.8rem' }}>Tous les signalements ont été traités par le système expert.</p>
                        </div>
                    )}

                    {!loading && !error && investigations.length > 0 && activeTab === 'ia' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                            {investigations.map((inv: any) => (
                                <div key={inv.id} style={{ 
                                    background: '#1a1a1a', 
                                    borderRadius: '8px', 
                                    padding: '1rem', 
                                    borderLeft: `6px solid ${inv.status === 'BANNED' ? '#000' : inv.status === 'PROSECUTED' ? '#3b82f6' : inv.riskLevel === 'CRITICAL' ? '#ef4444' : '#fbbf24'}`,
                                    opacity: inv.status === 'BANNED' ? 0.6 : 1
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: inv.riskLevel === 'CRITICAL' ? '#ef4444' : '#fbbf24' }}>{inv.riskLevel} ALERT</span>
                                                {inv.status !== 'OPEN' && <span style={{ fontSize: '0.6rem', background: '#333', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>🏁 STATUT: {inv.status}</span>}
                                            </div>
                                            <h3>{inv.report.title}</h3>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{inv.report.trustScore}%</div>
                                            <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>SCORE DE VÉRITÉ</div>
                                        </div>
                                    </div>

                                    {/* IDENTITY PROOF SECTION */}
                                    {(inv.report.reporterSelfie || inv.report.reporterIdCard) && (
                                        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444' }}>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--primary)' }}>🆔 IDENTITÉ DU PLAIGNANT CERTIFIÉE</p>
                                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                                {inv.report.reporterSelfie && (
                                                    <div>
                                                        <p style={{ fontSize: '0.5rem', opacity: 0.5 }}>SELFIE DIRECT</p>
                                                        <img src={inv.report.reporterSelfie} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    </div>
                                                )}
                                                {inv.report.reporterIdCard && (
                                                    <div>
                                                        <p style={{ fontSize: '0.5rem', opacity: 0.5 }}>PIÈCE D'IDENTITÉ</p>
                                                        <img src={inv.report.reporterIdCard} style={{ width: '120px', height: '80px', objectFit: 'contain', borderRadius: '4px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                                        <p style={{ fontSize: '0.9rem', color: '#888' }}>{inv.report.description}</p>
                                        <div style={{ background: '#000', padding: '0.8rem', borderRadius: '6px', marginTop: '1rem', border: '1px solid #333' }}>
                                            <p style={{ fontSize: '0.75rem', margin: 0 }}>🤖 <strong>Rapport IA :</strong> {inv.aiSummary}</p>
                                        </div>
                                    </div>

                                    {/* ACTION MATRIX */}
                                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                                        <button 
                                            onClick={() => handleAction(inv.id, 'BANNED')}
                                            disabled={inv.status === 'BANNED'}
                                            className="btn" style={{ fontSize: '0.7rem', background: '#991b1b', flex: 1 }}
                                        >🚫 Bannir l'Escroc</button>
                                        
                                        <button 
                                            onClick={() => handleAction(inv.id, 'PROSECUTED')}
                                            disabled={inv.status === 'PROSECUTED'}
                                            className="btn" style={{ fontSize: '0.7rem', background: '#1e40af', flex: 1 }}
                                        >⚖️ Saisir la Justice</button>

                                        <button 
                                            onClick={() => handleAction(inv.id, 'MASS_ALERT')}
                                            className="btn" style={{ fontSize: '0.7rem', background: '#92400e', flex: 1 }}
                                        >📢 Alerte de Masse</button>
                                        
                                        <button 
                                            onClick={() => handleAction(inv.id, 'RESOLVED')}
                                            disabled={inv.status === 'RESOLVED'}
                                            className="btn" style={{ fontSize: '0.7rem', background: '#065f46', flex: 1 }}
                                        >✅ Valider & Clore</button>

                                        <Link 
                                            href={`/admin/complaint/${inv.id}`}
                                            target="_blank"
                                            className="btn" 
                                            style={{ fontSize: '0.7rem', background: '#444', flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >📄 Dossier PDF</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && !error && activeTab === 'kyc' && (
                        <div>
                            <h2>Gestion des Identités (KYC)</h2>
                            <p>Toutes les identités collectées lors des signalements sont listées ici pour revue judiciaire.</p>
                            <table style={{ width: '100%', marginTop: '1rem' }}>
                                <thead style={{ background: '#222' }}>
                                    <tr>
                                        <th style={{ padding: '0.5rem' }}>Plaignant</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {investigations.filter(i => i.report.reporterSelfie).map(inv => (
                                        <tr key={inv.id} style={{ borderBottom: '1px solid #222' }}>
                                            <td style={{ padding: '1rem' }}>Plainte #{inv.report.id.substring(0,6)}</td>
                                            <td>{new Date(inv.report.createdAt).toLocaleDateString()}</td>
                                            <td><span style={{ fontSize: '0.7rem', background: '#3b82f6', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>VERIFIED IDENT</span></td>
                                            <td><button className="btn" style={{ fontSize: '0.7rem' }}>Consulter Dossier</button></td>
                                        </tr>
                                    ))}
                                    {investigations.filter(i => i.report.reporterSelfie).length === 0 && (
                                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>Aucune identité à vérifier pour le moment.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
