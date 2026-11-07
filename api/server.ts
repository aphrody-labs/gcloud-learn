// SPDX-License-Identifier: MIT OR Apache-2.0
import { serve } from "bun";
import { GoogleApiClient } from "../vendor/google-api-client.ts";
import { FirebaseBunFork } from "../vendor/firebase-bun-fork.ts";
import { ServerlessRAGDatabase } from "./rag-database.ts";
import { LarryPageMentorEngine } from "./larry-soul-mentor.ts";

const PORT = Number(process.env.PORT || 8080);
const HOST = "0.0.0.0";

const googleClient = new GoogleApiClient();
const _firebaseFork = new FirebaseBunFork();
const ragDb = new ServerlessRAGDatabase();
const larryMentor = new LarryPageMentorEngine(ragDb);

export function startServer() {
  return serve({
    port: PORT,
    hostname: HOST,
    async fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === "/health") {
        const buckets = await googleClient.listStorageBuckets();
        return Response.json({
          status: "healthy",
          runtime: "Upstream Bun v1.4.4+",
          timestamp: new Date().toISOString(),
          googleCloudProject: googleClient.getProjectId(),
          storageBuckets: buckets.length,
          firestoreCollections: ["candidates", "telemetry", "evaluations"],
          ragDocuments: ragDb.search("", 100).length
        });
      }

      if (url.pathname === "/api/rag/search" && req.method === "GET") {
        const query = url.searchParams.get("q") || "";
        const results = ragDb.search(query);
        return Response.json({ query, results });
      }

      if (url.pathname === "/api/mentor/evaluate" && req.method === "POST") {
        try {
          const body = await req.json() as { prompt: string; candidateName?: string; roleTarget?: string };
          const evalResult = await larryMentor.evaluateCandidateResponse(body.prompt);
          if (body.candidateName) {
            ragDb.saveMockInterview(
              body.candidateName,
              body.roleTarget || "SWE L5",
              [{ role: "candidate", text: body.prompt }, { role: "larry", text: evalResult.message }],
              (evalResult.dimensionScores.gca + evalResult.dimensionScores.rrk + evalResult.dimensionScores.leadership + evalResult.dimensionScores.googliness) / 4,
              evalResult.verdict
            );
          }
          return Response.json(evalResult);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          return Response.json({ error: msg }, { status: 400 });
        }
      }

      if (url.pathname === "/api/mentor/interviews" && req.method === "GET") {
        return Response.json({ interviews: ragDb.getMockInterviews() });
      }

      if (url.pathname === "/api/firebase/export" && req.method === "GET") {
        return Response.json(ragDb.exportFirebaseFormat());
      }

      if (url.pathname === "/api/info") {
        return Response.json({
          title: "Google Cloud Learn & Sovereign Engineering Portal",
          mission: "Prepare engineers for Google Cloud Paris (Rue de Londres) & Master Upstream Bun Stack",
          modules: [
            "gcp-certifications",
            "google-oss-contributions",
            "finops-automations",
            "serverless-rag-database",
            "larry-page-mentor-soul"
          ]
        });
      }

      return new Response("Not Found", { status: 404 });
    }
  });
}

if (import.meta.main) {
  startServer();
  console.log(`Server running at http://${HOST}:${PORT}`);
}
