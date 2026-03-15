"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Advisory = {
    id: string;
    title: string;
    content: string;
    category: string;
    level: string;
    createdAt: string;
};

export default function SecurityTipsPage() {
    const [tips, setTips] = useState<Advisory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/advisory")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTips(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <Link href="/" className="nav-brand">Alerte Arnaques</Link>
                <Link href="/" className="text-sm opacity-60 hover:opacity-100">Retour à l'accueil</Link>
            </header>

            <main className="container py-16">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-black mb-4">🛡️ Guides de <span className="text-blue-500">Prévention</span></h1>
                    <p className="text-gray-400 mb-12">Consultez nos protocoles de sécurité pour éviter de tomber dans les pièges les plus courants.</p>

                    {loading ? (
                        <div className="text-center py-20 opacity-50">Chargement des conseils...</div>
                    ) : (
                        <div className="space-y-8">
                            {tips.map(tip => (
                                <div key={tip.id} className="glass-panel p-8 border-white/5 relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-1 h-full ${
                                        tip.level === 'CRITICAL' ? 'bg-red-500' : tip.level === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'
                                    }`} />
                                    
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">{tip.category}</span>
                                            <h2 className="text-2xl font-bold mt-1">{tip.title}</h2>
                                        </div>
                                        <div className={`px-3 py-1 rounded text-[10px] font-bold ${
                                            tip.level === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : tip.level === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                            ALERTE {tip.level}
                                        </div>
                                    </div>

                                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {tip.content}
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-white/5 text-[10px] text-gray-500 uppercase tracking-widest">
                                        Publié le {new Date(tip.createdAt).toLocaleDateString()} • Expertise Alerte-Arnaques
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && tips.length === 0 && (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <p className="text-gray-500 italic">Aucun conseil d'expert n'est disponible pour le moment.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
