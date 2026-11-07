// SPDX-License-Identifier: MIT OR Apache-2.0
// Antigravity (agy) & Gemini Web Plugin: Larry Page Soul, Big Brother & Google Cloud Paris Recruiter
import { ServerlessRAGDatabase } from "../api/rag-database.ts";
import { LarryPageMentorEngine, LARRY_MENTOR_SOUL_PROMPT, type LarryMentorResponse } from "../api/larry-soul-mentor.ts";

export interface PluginContext {
  userId?: string;
  candidateProfile?: {
    name: string;
    levelTarget: "L4" | "L5" | "L6";
    roleTarget: "SWE" | "Customer Engineer" | "Solutions Architect";
  };
}

export class AgyGeminiLarryPlugin {
  public readonly id = "agy-larry-page-soul";
  public readonly name = "Larry Page + Big Brother + Google Paris Recruiter Soul";
  public readonly version = "1.0.0";
  private ragDb: ServerlessRAGDatabase;
  private mentor: LarryPageMentorEngine;

  constructor(ragDb?: ServerlessRAGDatabase) {
    this.ragDb = ragDb || new ServerlessRAGDatabase();
    this.mentor = new LarryPageMentorEngine(this.ragDb);
  }

  public getSystemPromptInjection(): string {
    return LARRY_MENTOR_SOUL_PROMPT;
  }

  public async handlePrompt(userMessage: string, _context?: PluginContext): Promise<{
    reply: string;
    mentorEvaluation: LarryMentorResponse;
    recommendedActions: string[];
  }> {
    const evalResult = await this.mentor.evaluateCandidateResponse(userMessage);

    const formattedReply = `
[SOUL : LARRY PAGE × GRAND FRÈRE × RECRUTEUR GOOGLE CLOUD PARIS]

${evalResult.message}

Verdict d'évaluation : ${evalResult.verdict}
Scores de dimension :
- General Cognitive Ability (GCA) : ${evalResult.dimensionScores.gca}/5
- Role-Related Knowledge (RRK)     : ${evalResult.dimensionScores.rrk}/5
- Leadership & Ownership           : ${evalResult.dimensionScores.leadership}/5
- Googliness & Culture             : ${evalResult.dimensionScores.googliness}/5

Recommandations directes :
${evalResult.recommendations.map(r => `• ${r}`).join("\n")}
    `.trim();

    return {
      reply: formattedReply,
      mentorEvaluation: evalResult,
      recommendedActions: evalResult.recommendations
    };
  }

  public searchKnowledge(query: string) {
    return this.ragDb.search(query);
  }
}

if (import.meta.main) {
  const plugin = new AgyGeminiLarryPlugin();
  console.log("Antigravity Plugin Loaded:", plugin.name);
  plugin.handlePrompt("Je veux intégrer Google Cloud Paris en tant que Solutions Architect avec Bun et Rust").then(res => {
    console.log(res.reply);
  });
}
