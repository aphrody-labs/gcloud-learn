// SPDX-License-Identifier: MIT OR Apache-2.0
import { Database } from "bun:sqlite";
import { join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";

export interface KnowledgeDocument {
  id: string;
  category: "interview" | "architecture" | "certification" | "career" | "larry_mindset";
  title: string;
  content: string;
  embedding?: number[];
  tags: string[];
  updatedAt: string;
}

interface MockInterviewRow {
  id: string;
  candidate_name: string;
  role_target: string;
  dialogue_json: string;
  score: number;
  evaluation: string;
  created_at: string;
}

export class ServerlessRAGDatabase {
  private db: Database;
  private dbPath: string;

  constructor(customPath?: string) {
    const dataDir = customPath ? join(customPath, "..") : join(import.meta.dir, "..", "data");
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    this.dbPath = customPath || join(dataDir, "rag-serverless.db");
    this.db = new Database(this.dbPath, { create: true });
    this.initDatabase();
  }

  private initDatabase(): void {
    this.db.run("PRAGMA journal_mode = WAL;");
    this.db.run("PRAGMA synchronous = NORMAL;");

    this.db.run(`
      CREATE TABLE IF NOT EXISTS knowledge_items (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT NOT NULL,
        embedding TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS mock_interviews (
        id TEXT PRIMARY KEY,
        candidate_name TEXT NOT NULL,
        role_target TEXT NOT NULL,
        dialogue_json TEXT NOT NULL,
        score REAL,
        evaluation TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    this.seedDefaultKnowledge();
  }

  private seedDefaultKnowledge(): void {
    const count = this.db.query("SELECT COUNT(*) as c FROM knowledge_items").get() as { c: number };
    if (count.c > 0) return;

    const initialDocs: Array<Omit<KnowledgeDocument, "updatedAt">> = [
      {
        id: "larry-page-10x",
        category: "larry_mindset",
        title: "The 10x Moonshot Rule by Larry Page",
        content: "Incremental change leads to failure over time. A 10x improvement is often easier than a 10% improvement because it forces you to rethink the entire problem from scratch using first principles.",
        tags: ["10x", "moonshot", "first-principles", "leadership"]
      },
      {
        id: "google-gca-interview",
        category: "interview",
        title: "General Cognitive Ability (GCA) Evaluation Rubric",
        content: "In GCA rounds at Google, interviewers test how you navigate ambiguity, break down unsolvable multi-variable problems, construct hypotheses, and validate with data. Never jump to conclusions without stating assumptions.",
        tags: ["gca", "interview", "hiring", "paris"]
      },
      {
        id: "google-cloud-paris-tech",
        category: "architecture",
        title: "Google Cloud Paris Region (europe-west9) Resilience",
        content: "europe-west9 in Paris has 3 zones with zero carbon emissions commitments. Architecture requires Multi-Region or Dual-Region storage with Cloud Spanner or Cloud Run multi-zone failover for financial and enterprise clients.",
        tags: ["gcp", "europe-west9", "paris", "architecture"]
      },
      {
        id: "older-brother-mentorship",
        category: "career",
        title: "Big Brother Tough Love: How to land L5 SWE/CE",
        content: "Stop wasting time overthinking tutorials. Build running software, deploy to Google Cloud, know your system metrics down to the syscall, show resilience under pressure, and take full ownership of your trajectory.",
        tags: ["mentorship", "mindset", "seniority", "grit"]
      }
    ];

    for (const doc of initialDocs) {
      this.insertDocument(doc.id, doc.category, doc.title, doc.content, doc.tags);
    }
  }

  public insertDocument(id: string, category: string, title: string, content: string, tags: string[], embedding?: number[]): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO knowledge_items (id, category, title, content, tags, embedding, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    stmt.run(id, category, title, content, JSON.stringify(tags), embedding ? JSON.stringify(embedding) : null);
  }

  public search(query: string, limit = 5): KnowledgeDocument[] {
    const lowerQuery = query.toLowerCase();
    const rows = this.db.query(`
      SELECT id, category, title, content, tags, embedding, updated_at as updatedAt
      FROM knowledge_items
      WHERE LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(tags) LIKE ?
      ORDER BY updated_at DESC
      LIMIT ?
    `).all(`%${lowerQuery}%`, `%${lowerQuery}%`, `%${lowerQuery}%`, limit) as Array<{
      id: string;
      category: KnowledgeDocument["category"];
      title: string;
      content: string;
      tags: string;
      embedding: string | null;
      updatedAt: string;
    }>;

    return rows.map(r => ({
      id: r.id,
      category: r.category,
      title: r.title,
      content: r.content,
      tags: JSON.parse(r.tags),
      embedding: r.embedding ? JSON.parse(r.embedding) : undefined,
      updatedAt: r.updatedAt
    }));
  }

  public saveMockInterview(candidateName: string, roleTarget: string, dialogue: unknown[], score: number, evaluation: string): string {
    const id = `interview-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const stmt = this.db.prepare(`
      INSERT INTO mock_interviews (id, candidate_name, role_target, dialogue_json, score, evaluation)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, candidateName, roleTarget, JSON.stringify(dialogue), score, evaluation);
    return id;
  }

  public getMockInterviews(): MockInterviewRow[] {
    return this.db.query("SELECT * FROM mock_interviews ORDER BY created_at DESC LIMIT 20").all() as MockInterviewRow[];
  }

  public exportFirebaseFormat(): Record<string, unknown> {
    const items = this.db.query("SELECT * FROM knowledge_items").all() as Array<{
      id: string;
      category: string;
      title: string;
      content: string;
      tags: string;
      updated_at: string;
    }>;
    const result: Record<string, unknown> = {};
    for (const item of items) {
      result[item.id] = {
        category: item.category,
        title: item.title,
        content: item.content,
        tags: JSON.parse(item.tags),
        updatedAt: item.updated_at
      };
    }
    return result;
  }

  public close(): void {
    this.db.close();
  }
}
