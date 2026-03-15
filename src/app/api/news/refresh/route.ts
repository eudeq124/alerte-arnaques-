import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Contexte des news réelles (Intentionalement vague pour laisser Gemini chercher dans son savoir actuel)
    const prompt = `Génère 3 articles de presse très récents (données réelles 2026) sur les dernières cyber-arnaques en France (Phishing, SMS, Fraude Bancaire). 
    Base-toi sur des faits réels comme les vagues d'attaques CPF, ANTAI ou Ameli.
    Formatte la réponse exclusivement en JSON valide sous la forme d'un tableau d'objets :
    [{ "title": "...", "summary": "...", "sourceUrl": "...", "imageUrl": "..." }]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let articles = [];
    try {
        const jsonStr = text.replace(/```json|```/g, "").trim();
        articles = JSON.parse(jsonStr);
    } catch(e) {
        console.error("Erreur parsing JSON Gemini News", e);
        return NextResponse.json({ error: "Échec structuration IA" }, { status: 500 });
    }

    // Enregistrement en base de données
    const saved = [];
    for (const art of articles) {
        const created = await prisma.newsArticle.create({
            data: {
                title: art.title,
                summary: art.summary,
                sourceUrl: art.sourceUrl || "https://www.cybermalveillance.gouv.fr",
                imageUrl: art.imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
            }
        });
        saved.push(created);
    }

    return NextResponse.json({ message: "Journal mis à jour", articles: saved });
  } catch (error) {
    console.error("REFRESH_NEWS_ERROR", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
