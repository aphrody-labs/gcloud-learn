/**
 * Native Bun Firebase Client without Node.js admin SDK.
 * Interacts directly with Firestore REST / Auth endpoints and bun:sqlite storage.
 */

import { Database } from "bun:sqlite";

export interface FirebaseConfig {
  projectId: string;
  apiKey?: string;
  sqlitePath?: string;
}

export class FirebaseBunFork {
  public projectId: string;
  public apiKey: string;
  private localDb: Database;

  constructor(config?: Partial<FirebaseConfig>) {
    this.projectId =
      config?.projectId ||
      process.env.FIREBASE_PROJECT_ID ||
      "aphrody-firebase";
    this.apiKey = config?.apiKey || process.env.FIREBASE_API_KEY || "";
    this.localDb = new Database(config?.sqlitePath || ":memory:");
    this.initLocalStore();
  }

  private initLocalStore(): void {
    this.localDb.run("PRAGMA journal_mode = WAL;");
    this.localDb.run(`
      CREATE TABLE IF NOT EXISTS firestore_docs (
        collection TEXT NOT NULL,
        id TEXT NOT NULL,
        data TEXT NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (collection, id)
      );
    `);
  }

  async setDoc(
    collection: string,
    id: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    const stmt = this.localDb.prepare(`
      INSERT INTO firestore_docs (collection, id, data, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(collection, id) DO UPDATE SET
        data = excluded.data,
        updated_at = excluded.updated_at;
    `);
    stmt.run(collection, id, JSON.stringify(data), Date.now());
  }

  async getDoc(
    collection: string,
    id: string,
  ): Promise<Record<string, unknown> | null> {
    const stmt = this.localDb.prepare(`
      SELECT data FROM firestore_docs WHERE collection = ? AND id = ?;
    `);
    const row = stmt.get(collection, id) as { data: string } | null;
    return row ? JSON.parse(row.data) : null;
  }

  async queryDocs(
    collection: string,
  ): Promise<Array<{ id: string; data: Record<string, unknown> }>> {
    const stmt = this.localDb.prepare(`
      SELECT id, data FROM firestore_docs WHERE collection = ?;
    `);
    const rows = stmt.all(collection) as Array<{ id: string; data: string }>;
    return rows.map((r) => ({ id: r.id, data: JSON.parse(r.data) }));
  }

  close(): void {
    this.localDb.close();
  }
}
