"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ComplaintDocumentPage() {
    const params = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch report and investigation details
        fetch(`/api/admin/investigations`)
            .then(res => res.json())
            .then(res => {
                const inv = res.investigations?.find((i: any) => i.id === params.id);
                setData(inv);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    if (loading) return <div className="flex-center h-screen">Génération du document...</div>;
    if (!data) return <div className="flex-center h-screen">Document introuvable.</div>;

    const report = data.report;

    return (
        <div className="bg-white text-black p-8 min-h-screen font-serif" id="print-area">
            {/* Header Officiel */}
            <div className="flex justify-between border-b-2 border-black pb-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold uppercase">Alerte-Arnaques France</h1>
                    <p className="text-sm">Division Cybersécurité & Expertise Juridique</p>
                    <p className="text-xs italic">Document Généré par Intelligence Artificielle - Valeur de Preuve Technique</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">Réf: dossier-${report.id.slice(-6)}</p>
                    <p className="text-sm">Date: {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
            </div>

            {/* Corps du Document */}
            <div className="space-y-6">
                <section>
                    <h2 className="text-lg font-bold border-l-4 border-black pl-2 mb-2">1. OBJET DE LA PLAINTE</h2>
                    <p className="uppercase font-bold underline">{report.scamType}</p>
                    <p className="mt-2"><span className="font-bold">Titre :</span> {report.title}</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold border-l-4 border-black pl-2 mb-2">2. DESCRIPTION DES FAITS</h2>
                    <div className="p-4 bg-gray-50 border border-gray-300 rounded text-sm italic">
                        "{report.description}"
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold border-l-4 border-black pl-2 mb-2">3. ÉLÉMENTS DE PREUVE</h2>
                    <p className="text-sm"><span className="font-bold">Détails escroc :</span> {report.scammerDetails || "Non fournis"}</p>
                    <p className="text-sm mt-1 font-bold">Analyse Technique du Système :</p>
                    <ul className="text-xs list-disc ml-6 mt-1">
                        <li>Score de Risque Détecté : {report.trustScore}%</li>
                        <li>Scanner de Phishing (Google Safe Browsing) : {report.verificationLevel}</li>
                        <li>Vérification d'Identité Signaleur (KYC) : {report.reporterId ? "OUI (CERTIFIÉ)" : "NON"}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold border-l-4 border-black pl-2 mb-2">4. ANALYSE EXPERTE & IA</h2>
                    <div className="text-sm border p-4 border-dashed border-black">
                        {data.aiSummary}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold border-l-4 border-black pl-2 mb-2">5. RÉSOLUTION & ACTIONS</h2>
                    <p className="text-sm">Statut actuel du dossier : <span className="font-bold uppercase">{data.status}</span></p>
                    <p className="text-xs mt-4">Ce document est destiné à accompagner un dépôt de plainte auprès des services de Gendarmerie ou de Police. Les scores techniques fournis constituent une analyse probabiliste basée sur des indicateurs de fraude OSINT et IA.</p>
                </section>
            </div>

            {/* Footer / Signature */}
            <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between">
                <div>
                   <div className="w-48 h-24 border border-dashed border-gray-400 flex items-center justify-center text-xs text-gray-400">
                       Signature Numérique
                   </div>
                </div>
                <div className="text-right">
                    <button 
                        onClick={() => window.print()} 
                        className="no-print bg-blue-600 text-white px-4 py-2 rounded font-sans font-bold hover:bg-blue-700 transition"
                    >
                        🖨️ Imprimer / Sauvegarder en PDF
                    </button>
                </div>
            </div>

            <style jsx>{`
                @media print {
                    .no-print { display: none; }
                    body { background: white; color: black; }
                    #print-area { padding: 0; }
                }
            `}</style>
        </div>
    );
}
