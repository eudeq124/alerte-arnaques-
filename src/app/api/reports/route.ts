import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, scamType, scammerDetails, proofsUrl, reporterId, reporterSelfie, reporterIdCard, city, region } = body;

    if (!title || !description || !scamType) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    // --- GESTION DE LA CATÉGORIE ---
    let category = await (prisma as any).category.findFirst({ where: { name: scamType } });
    if (!category) {
      category = await (prisma as any).category.create({
        data: { name: scamType, description: `Catégorie: ${scamType}` }
      });
    }

    // --- ALGORITHME DE SCORE DE VÉRITÉ (TRUST SCORE) ---
    let trustScore = 15; // Base minimale
    
    // Identification forte (Membres Gold ou Identité instantanée)
    if (reporterId) {
        const reporter = await (prisma as any).certifiedUser.findUnique({ where: { id: reporterId } });
        if (reporter?.isCertified) trustScore += 50;
    } else if (reporterSelfie && reporterIdCard) {
        trustScore += 60; // Bonus majeur car plaignant identifié
    }

    // Preuves visuelles & VirusTotal (Réel)
    if (proofsUrl && proofsUrl.length > 0) {
        trustScore += 15;
        // Analyse VirusTotal réelle sur le premier fichier fourni
        const { checkFileWithVirusTotal } = await import("@/lib/virustotal");
        const vtResult = await checkFileWithVirusTotal(proofsUrl[0]); 
        
        if (vtResult && vtResult.malicious > 0) {
            trustScore += 30;
            console.log(`🧨 VirusTotal : Menace réelle détectée (${vtResult.malicious} infections) !`);
        } else if (vtResult) {
            trustScore += 10; // Bonus pour fichier sain
            console.log("🛡️ VirusTotal : Fichier analysé et sain.");
        }
    }
    // Détails précis sur l'escroc
    if (scammerDetails && scammerDetails.length > 10) trustScore += 10;

    const verificationLevel = trustScore >= 80 ? "CERTIFIED" : trustScore >= 50 ? "PROBABLE" : "SUSPECT";

    const report = await (prisma.report as any).create({
      data: {
        title,
        description,
        scamType,
        scammerDetails,
        categoryId: category.id,
        isVerified: trustScore >= 50, // Auto-modération
        trustScore,
        verificationLevel,
        reporterId,
        reporterSelfie,
        reporterIdCard,
        city,
        region,
        proofs: {
          create: (proofsUrl || []).map((url: string) => ({ url }))
        }
      },
    });

    // --- GÉNÉRATION DU RÉSUMÉ IA (RÉEL via Gemini) ---
    let aiSummary = `Analyse automatique : Confiance de ${trustScore}%. ${trustScore > 70 ? 'Plainte certifiée par identité' : 'Preuves supplémentaires requises'}.`;
    
    if (process.env.GEMINI_API_KEY) {
        try {
            const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Agis en tant qu'expert en cybersécurité pour la plateforme Alerte-Arnaques. 
                            Analyse ce signalement et génère un résumé d'investigation professionnel pour l'admin :
                            Titre: ${title}
                            Type: ${scamType}
                            Description: ${description}
                            Score de confiance: ${trustScore}%
                            Vérification: ${verificationLevel}
                            
                            Fais un résumé court (3-4 phrases) se concentrant sur le risque et les actions recommandées (Bannissement, Justice, etc).`
                        }]
                    }]
                })
            });
            const geminiData = await geminiResponse.json();
            if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
                aiSummary = geminiData.candidates[0].content.parts[0].text;
            }
        } catch (e) {
            console.error("Erreur appel Gemini:", e);
        }
    }

    // --- CRÉATION AUTOMATIQUE DE L'INVESTIGATION ---
    await (prisma as any).investigation.create({
      data: {
        reportId: report.id,
        aiSummary,
        riskLevel: trustScore < 30 ? "CRITICAL" : trustScore < 60 ? "HIGH" : "MEDIUM",
        logs: JSON.stringify({ event: "creation", trustScore, timestamp: new Date().toISOString() })
      }
    });

    // Notification Admin (Réelle via console en dev)
    console.log(`[REAL AI] Investigation générée pour : ${report.title}`);

    // --- ENVOI DE L'ALERTE EMAIL (RÉEL) ---
    const { sendAdminAlert } = await import("@/lib/mail");
    await sendAdminAlert('SIGNALEMENT', {
        title,
        description,
        scamType,
        scammerDetails,
        trustScore,
        verificationLevel,
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("REPORT_POST_ERROR", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

    const reports = await (prisma.report as any).findMany({
    where: query ? {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { scamType: { contains: query } }
      ]
    } : {},
    include: {
      _count: { select: { upvotes: true } },
      proofs: true,
      investigation: true
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(reports);
}
