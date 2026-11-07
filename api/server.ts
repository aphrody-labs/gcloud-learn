/**
 * Fullstack Native Server using Upstream Bun v1.4.4+ Native APIs
 * - Bun.serve() with typed routes
 * - bun:sqlite for local caching & telemetry
 * - GoogleApiClient native integration
 * - FirebaseBunFork persistence
 */

import { Database } from "bun:sqlite";
import { GoogleApiClient } from "../vendor/google-api-client.ts";
import { FirebaseBunFork } from "../vendor/firebase-bun-fork.ts";

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";

const db = new Database("gcloud_learn.sqlite");
db.run("PRAGMA journal_mode = WAL;");
db.run(`
  CREATE TABLE IF NOT EXISTS requests_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    method TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  );
`);

const googleClient = new GoogleApiClient();
const _firebaseFork = new FirebaseBunFork();

const server = Bun.serve({
  port: PORT,
  hostname: HOST,
  routes: {
    "/": async () => {
      const htmlFile = Bun.file("web/index.html");
      return new Response(await htmlFile.text(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    },
    "/web/app.js": async () => {
      const jsFile = Bun.file("web/app.js");
      return new Response(await jsFile.text(), {
        headers: { "Content-Type": "application/javascript; charset=utf-8" },
      });
    },
    "/api/health": () => {
      return Response.json({
        status: "healthy",
        runtime: "Upstream Bun v1.4.4+",
        timestamp: new Date().toISOString(),
        sqlite: "connected",
        project: googleClient.getProjectId(),
      });
    },
    "/api/gcp/models": async () => {
      const models = await googleClient.listVertexAiModels();
      return Response.json({ models });
    },
    "/api/gcp/buckets": async () => {
      const buckets = await googleClient.listStorageBuckets();
      return Response.json({ buckets });
    },
    "/api/curriculum": async () => {
      const tracks = [
        {
          id: "ace",
          title: "Associate Cloud Engineer",
          duration: "4 weeks",
          focus: [
            "IAM",
            "VPC & Subnets",
            "Compute Engine",
            "GKE",
            "Cloud Storage",
          ],
        },
        {
          id: "pca",
          title: "Professional Cloud Architect",
          duration: "6 weeks",
          focus: [
            "Enterprise Architecture",
            "Hybrid Cloud & Interconnect",
            "High Availability & DR",
            "Security Posture",
          ],
        },
        {
          id: "pde",
          title: "Professional Data Engineer",
          duration: "6 weeks",
          focus: [
            "BigQuery",
            "Dataflow & Apache Beam",
            "Dataproc & Spark",
            "Pub/Sub Streaming",
            "Bigtable",
          ],
        },
        {
          id: "genai",
          title: "Generative AI Leader",
          duration: "3 weeks",
          focus: [
            "Gemini 1.5 Pro/Flash",
            "Vertex AI Search & Conversation",
            "Prompt Engineering",
            "Responsible AI",
          ],
        },
      ];
      return Response.json({ tracks });
    },
  },
  async fetch(req) {
    const url = new URL(req.url);

    // Log request
    const stmt = db.prepare(
      "INSERT INTO requests_log (path, method, timestamp) VALUES (?, ?, ?)",
    );
    stmt.run(url.pathname, req.method, Date.now());

    if (req.method === "POST" && url.pathname === "/api/generate") {
      try {
        const body = (await req.json()) as { prompt: string; model?: string };
        const result = await googleClient.generateContent({
          prompt: body.prompt || "Hello Gemini",
          model: body.model,
        });
        return Response.json(result);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return Response.json({ error: message }, { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(
  `[gcloud-learn] Server listening on http://${server.hostname}:${server.port}`,
);
