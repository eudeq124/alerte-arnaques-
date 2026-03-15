import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { platform, profileUrl } = await req.json();

    if (!profileUrl) return NextResponse.json({ error: "URL requise" }, { status: 400 });

    const apiKey = process.env.SAFE_BROWSING_API_KEY;
    let detections: string[] = [];
    let riskScore = 0;
    let isFake = false;

    // 1. ANALYSE DÉTERMINISTE (RÉELLE)
    const suspiciousKeywords = ["gift", "win", "prize", "cash", "crypto", "official-login", "secure-verify"];
    const foundKeywords = suspiciousKeywords.filter(k => profileUrl.toLowerCase().includes(k));
    
    if (foundKeywords.length > 0) {
        detections.push(`Mots-clés suspects détectés dans l'URL : ${foundKeywords.join(", ")}`);
        riskScore += 30;
    }

    // 2. INTÉGRATION GOOGLE SAFE BROWSING (Lien Réel)
    if (apiKey) {
        const sbResponse = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
            method: 'POST',
            body: JSON.stringify({
                client: { clientId: "alerte-arnaques", clientVersion: "1.0.0" },
                threatInfo: {
                    threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
                    platformTypes: ["ANY_PLATFORM"],
                    threatEntryTypes: ["URL"],
                    threatEntries: [{ url: profileUrl }]
                }
            })
        });
        const sbData = await sbResponse.json();
        if (sbData.matches) {
            detections.push("URL répertoriée comme MALVEILLANTE dans la base de données Google Safe Browsing");
            riskScore = 100;
            isFake = true;
        }
    }

    // 3. ANALYSE IA GÉNÉRATIVE (RÉELLE)
    let aiSummary = "Analyse préliminaire effectuée.";
    let confidencePoints = 0;

    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Agis en expert OSINT Cyber-vigilance. Analyse ce profil ${platform} : "${profileUrl}". 
        Detections techniques actuelles : ${detections.join(", ")}. 
        Score de risque préliminaire : ${riskScore}%.
        Explique brièvement pourquoi ce profil est suspect ou sain. Donne ton verdict final.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        aiSummary = response.text();
        
        // Ajustement dynamique du score par l'IA
        if (aiSummary.toLowerCase().includes("arnaque") || aiSummary.toLowerCase().includes("fraud") || aiSummary.toLowerCase().includes("suspicious")) {
            confidencePoints = 20;
        }
    } catch (e) {
        console.error("GEMINI_SOCIAL_SCAN_ERROR", e);
    }

    riskScore = Math.min(100, riskScore + confidencePoints);
    if (riskScore >= 40) isFake = true;

    // 4. SAUVEGARDE EN BASE DE DONNÉES
    await (prisma as any).socialScan.create({
        data: {
            url: profileUrl,
            platform,
            riskScore,
            verdict: isFake ? "Faux" : riskScore > 10 ? "Suspect" : "Réel",
            analysis: JSON.stringify(detections)
        }
    });

    return NextResponse.json({
      platform,
      profileUrl,
      riskScore,
      detections: detections.length > 0 ? detections : ["Aucune signature technique malveillante immédiate."],
      aiSummary: aiSummary,
      isFake,
      realTimeScan: true
    });
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors du scan IA" }, { status: 500 });
  }
}
