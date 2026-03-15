import { createHash } from 'crypto';

export async function checkFileWithVirusTotal(fileData: string | Buffer) {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    
    // Calcul du hash réel (SHA-256)
    let fileHash: string;
    if (typeof fileData === 'string' && fileData.startsWith('data:')) {
        // Extraction du base64 si c'est une data URL
        const base64 = fileData.split(',')[1];
        fileHash = createHash('sha256').update(Buffer.from(base64, 'base64')).digest('hex');
    } else {
        fileHash = createHash('sha256').update(fileData).digest('hex');
    }

    if (!apiKey || apiKey === "VOTRE_CLE_VIRUSTOTAL_ICI") {
        console.warn("⚠️ Clé VirusTotal non configurée. Analyse réelle impossible.");
        return null;
    }

    try {
        const response = await fetch(`https://www.virustotal.com/api/v3/files/${fileHash}`, {
            headers: {
                'x-apikey': apiKey
            }
        });

        if (!response.ok) return null;

        const data = await response.json();
        const stats = data.data?.attributes?.last_analysis_stats;
        
        return {
            malicious: stats?.malicious || 0,
            suspicious: stats?.suspicious || 0,
            undetected: stats?.undetected || 0,
            total: (stats?.malicious || 0) + (stats?.suspicious || 0) + (stats?.undetected || 0),
            verdict: stats?.malicious > 0 ? "MALICIOUS" : "CLEAN"
        };
    } catch (e) {
        console.error("VIRUSTOTAL_API_ERROR", e);
        return null;
    }
}
