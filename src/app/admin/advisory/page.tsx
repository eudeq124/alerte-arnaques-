"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminAdvisoryCMS() {
    const [advisories, setAdvisories] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("SMS");
    const [level, setLevel] = useState("INFO");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAdvisories();
    }, []);

    const fetchAdvisories = () => {
        fetch("/api/advisory").then(r => r.json()).then(setAdvisories);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/advisory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content, category, level })
        });
        if (res.ok) {
            setTitle("");
            setContent("");
            fetchAdvisories();
        }
        setLoading(false);
    };

    const triggerNewsRefresh = async () => {
        setLoading(true);
        const res = await fetch("/api/news/refresh", { method: "POST" });
        if (res.ok) alert("Journal actualisé avec succès !");
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
            <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black">CMS SÉCURITÉ & JOURNAL</h1>
                    <p className="text-gray-400 text-sm">Publiez des conseils ou lancez la veille automatique.</p>
                </div>
                <Link href="/admin" className="text-sm opacity-50 hover:opacity-100 italic">← Retour Dashboard</Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* FORMULAIRE D'AVIS */}
                <div className="glass-panel p-8 h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">✍️ Publier un nouvel avis / conseil</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input 
                            value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="Titre de l'avis (ex: Vague de Phishing Impôts)" 
                            className="bg-black/50 border border-white/10 w-full p-3 rounded" required
                        />
                        <textarea 
                            value={content} onChange={e => setContent(e.target.value)}
                            placeholder="Contenu du conseil de sécurité..." 
                            className="bg-black/50 border border-white/10 w-full p-3 h-32 rounded" required
                        />
                        <div className="flex gap-4">
                            <select value={category} onChange={e => setCategory(e.target.value)} className="bg-black border border-white/10 p-2 rounded flex-1">
                                <option value="SMS">SMS / SMISHING</option>
                                <option value="BANK">BANQUE / PAIEMENT</option>
                                <option value="SOC">RÉSEAUX SOCIAUX</option>
                                <option value="MAIL">EMAIL / PHISHING</option>
                            </select>
                            <select value={level} onChange={e => setLevel(e.target.value)} className="bg-black border border-white/10 p-2 rounded flex-1">
                                <option value="INFO">NIVEAU : INFO</option>
                                <option value="WARNING">NIVEAU : ATTENTION</option>
                                <option value="CRITICAL">NIVEAU : CRITIQUE</option>
                            </select>
                        </div>
                        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 font-bold rounded mt-2">
                            {loading ? "Action en cours..." : "🚀 Publier sur le site"}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <button onClick={triggerNewsRefresh} disabled={loading} className="w-full bg-red-600/20 text-red-400 border border-red-900/50 hover:bg-red-600/30 py-3 rounded text-sm font-bold">
                             🛰️ LANCER LA VEILLE AUTOMATIQUE DU WEB (JOURNAL)
                        </button>
                    </div>
                </div>

                {/* LISTE DES PUBLIÉS */}
                <div>
                    <h2 className="text-xl font-bold mb-6">📢 Conseils déjà publiés</h2>
                    <div className="space-y-4">
                        {advisories.map(adv => (
                            <div key={adv.id} className="p-4 bg-white/5 border border-white/5 rounded relative">
                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded absolute top-4 right-4 ${
                                    adv.level === 'CRITICAL' ? 'bg-red-500' : adv.level === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'
                                }`}>
                                    {adv.level}
                                </div>
                                <h3 className="font-bold text-sm mb-1">{adv.title}</h3>
                                <p className="text-xs text-gray-500 mb-2">{adv.category} • {new Date(adv.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-400 line-clamp-2 italic">{adv.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
