"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Article = {
    id: string;
    title: string;
    summary: string;
    sourceUrl: string;
    imageUrl: string;
    publishedAt: string;
};

export default function ScamJournalPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/news")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setArticles(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="p-6 border-b border-white/10 flex justify-between items-center">
                <Link href="/" className="nav-brand">Alerte Arnaques</Link>
                <Link href="/" className="text-sm opacity-60 hover:opacity-100">Retour à l'accueil</Link>
            </header>

            <main className="container py-12">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black mb-4 tracking-tighter">LE JOURNAL DE LA <span className="text-red-500">CYBER-ARNAQUE</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">Votre veille quotidienne sur les menaces réelles détectées sur le territoire français. Données collectées par Intelligence Artificielle.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 opacity-50 animate-pulse">Chargement des dernières dépêches...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((art, index) => (
                            <div key={art.id} className={`glass-panel border-white/5 overflow-hidden flex flex-col ${index === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}>
                                <img 
                                    src={art.imageUrl} 
                                    className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                                    alt={art.title} 
                                />
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-xs text-red-500 font-bold mb-2">URGENT - {new Date(art.publishedAt).toLocaleDateString()}</div>
                                    <h2 className={`font-bold mb-4 ${index === 0 ? "text-3xl" : "text-xl"}`}>{art.title}</h2>
                                    <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-3">{art.summary}</p>
                                    <a 
                                        href={art.sourceUrl} 
                                        target="_blank" 
                                        className="text-xs font-bold border-b border-white/20 pb-1 self-start hover:border-red-500 transition"
                                    >
                                        LIRE LA SOURCE OFFICIELLE →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && articles.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-gray-500 italic">Aucune dépêche pour le moment. Revenez plus tard.</p>
                    </div>
                )}
            </main>

            <footer className="py-20 border-t border-white/5 text-center text-xs text-gray-600">
                © 2026 Alerte-Arnaques France - Données Cyber-Vigilance Réelles
            </footer>
        </div>
    );
}
