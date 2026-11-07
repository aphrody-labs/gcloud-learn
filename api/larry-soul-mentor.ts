// SPDX-License-Identifier: MIT OR Apache-2.0
import { ServerlessRAGDatabase } from "./rag-database.ts";

export const LARRY_MENTOR_SOUL_PROMPT = `
Tu es l'incarnation unifiée de 3 archétypes indissociables :
1. Larry Page (Fondateur de Google) : Pensée First-Principles, Règle du 10x Moonshot, obsession de la latence, de l'échelle planétaire, des structures de données sobres et des systèmes décentralisés/serverless.
2. Le Grand Frère Protecteur & Exigeant : Bienveillance radicale, fermeté fraternelle, aucun bavardage inutile, refus des excuses. Tu tires ton cadet vers le très haut niveau technique et financier.
3. Le Recruteur Tech & Leader Google Cloud Paris (Paris 9e, Rue de Londres / Vélizy) : Maîtrise absolue des niveaux Google (L4/L5 SWE, Customer Engineer GCP, Solutions Architect), des critères d'embauche réels (General Cognitive Ability, Role-Related Knowledge, Leadership, Googliness) et du marché français/européen.

Règles de communication :
- Pas de blabla corporatif vide ni de formules mielleuses. Tu vas droit au but.
- Challenge l'ingénieur sur ses choix de code, ses compromis d'architecture et ses performances.
- Analyse ses forces et ses lacunes techniques sans filtre, mais avec un engagement total pour le faire réussir chez Google Paris.
- Utilise l'anglais technique quand nécessaire pour les concepts d'architecture GCP et les mock interviews vidéo.
`;

export interface LarryMentorResponse {
  message: string;
  verdict: "Strong Hire" | "Hire" | "Leaning Hire" | "Leaning No Hire" | "No Hire";
  dimensionScores: {
    gca: number; // 1-5
    rrk: number; // 1-5
    leadership: number; // 1-5
    googliness: number; // 1-5
  };
  recommendations: string[];
  suggestedDocs: string[];
}

export class LarryPageMentorEngine {
  private rag: ServerlessRAGDatabase;

  constructor(ragDb?: ServerlessRAGDatabase) {
    this.rag = ragDb || new ServerlessRAGDatabase();
  }

  public async evaluateCandidateResponse(prompt: string, _contextCategory?: string): Promise<LarryMentorResponse> {
    const relevantDocs = this.rag.search(prompt, 3);
    const docTitles = relevantDocs.map(d => d.title);

    let verdict: LarryMentorResponse["verdict"] = "Hire";
    const scores = { gca: 4, rrk: 4, leadership: 4, googliness: 5 };

    const lower = prompt.toLowerCase();
    if (lower.includes("node") || lower.includes("npm") || lower.includes("lent") || lower.includes("abandon")) {
      verdict = "Leaning No Hire";
      scores.rrk = 2;
      scores.gca = 3;
    } else if (lower.includes("bun") || lower.includes("rust") || lower.includes("10x") || lower.includes("serverless") || lower.includes("first principles")) {
      verdict = "Strong Hire";
      scores.gca = 5;
      scores.rrk = 5;
      scores.googliness = 5;
    }

    const message = `Écoute-moi bien. Chez Google, et encore plus chez Google Cloud Paris, on ne recrute pas des exécutants qui empilent du code sans comprendre l'OS et les syscalls. Tu as choisi Upstream Bun et une approche serverless : c'est la bonne direction 10x. Maintenant, démontre-moi que ton architecture tient la charge sous 100 000 requêtes/seconde sans faire exploser la facture GCP.`;

    const recommendations = [
      "Prépare ton pitch System Design sur Cloud Spanner vs Cloud Run",
      "Élimine toute dépendance superflue : le code le plus rapide est celui qui n'est pas exécuté",
      "Perfectionne tes réponses STAR en anglais pour le round Leadership"
    ];

    return {
      message,
      verdict,
      dimensionScores: scores,
      recommendations,
      suggestedDocs: docTitles
    };
  }
}
