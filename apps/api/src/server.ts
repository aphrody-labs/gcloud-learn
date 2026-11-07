// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 The gcloud-learn Authors. All rights reserved.

import { serve } from "bun";
import { GoogleCoreEngine } from "@gcloud-learn/core";
import { ServerlessRAGDatabase } from "@gcloud-learn/rag";
import { LarryPageMentorEngine } from "@gcloud-learn/larry-soul";
import { BillingFinOpsEngine } from "@gcloud-learn/finops";
import { GoogleSeoLlmsEngine } from "@gcloud-learn/seo-llms";
import { GoogleWebGpu3DGameEngine } from "../../game-3d/src/engine.ts";
import { renderPureTsPage } from "../../web/src/renderer.ts";

const PORT = Number(process.env.PORT || 8080);
const HOST = "0.0.0.0";

const core = new GoogleCoreEngine();
const rag = new ServerlessRAGDatabase();
const mentor = new LarryPageMentorEngine(rag);
const finops = new BillingFinOpsEngine();
const seo = new GoogleSeoLlmsEngine();
const game3d = new GoogleWebGpu3DGameEngine();

export function startMonorepoServer() {
  return serve({
    port: PORT,
    hostname: HOST,
    async fetch(req) {
      const url = new URL(req.url);

      // 1. LLMs.txt & Google Search Bots (AI Mode Grounding 2026)
      if (url.pathname === "/llms.txt") {
        return new Response(seo.generateLlmsTxt(), {
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }

      if (url.pathname === "/robots.txt") {
        return new Response(seo.generateRobotsTxt(), {
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }

      // 2. Health & Cluster Status
      if (url.pathname === "/health") {
        const spend = await finops.checkSpend();
        return Response.json({
          status: "healthy",
          engine: "Upstream Bun Monorepo Pure TS",
          region: core.getRegionDetails(),
          knowledgeBaseCount: rag.search("", 100).length,
          active3dNodes: game3d.getNodes().length,
          spendOverview: spend.map(s => ({ service: s.service, usd: s.currentSpendUsd }))
        });
      }

      // 3. SSR Pure TS Interface (0% HTML/CSS files)
      if (url.pathname === "/" && req.method === "GET") {
        const html = renderPureTsPage("Google Cloud Learn — Sovereign Monorepo", {
          target: "Google Cloud Paris (Rue de Londres)",
          hiringCommitteeStandards: ["GCA", "RRK", "Leadership", "Googliness"],
          active3dNodes: game3d.getNodes(),
          openSourceWatch: seo.getTechnologyWatchDigest().technologyWatch
        });
        return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
      }

      // 4. WebGPU 3D Shader & Game Simulation API
      if (url.pathname === "/api/3d/cluster") {
        return Response.json({
          nodes: game3d.getNodes(),
          shaderWgsl: game3d.getWebGpuWgslShaderSource()
        });
      }

      if (url.pathname === "/api/3d/challenge" && req.method === "POST") {
        try {
          const body = await req.json() as { answer: string };
          return Response.json(game3d.simulateGamifiedChallenge(body.answer));
        } catch {
          return Response.json({ error: "Invalid challenge payload" }, { status: 400 });
        }
      }

      // 5. Larry Page Mentor & Mock Interview Endpoint
      if (url.pathname === "/api/mentor/evaluate" && req.method === "POST") {
        try {
          const body = await req.json() as { prompt: string; candidateName?: string };
          const evalResult = await mentor.evaluateCandidateResponse(body.prompt);
          if (body.candidateName) {
            rag.saveMockInterview(
              body.candidateName,
              "Google Cloud Paris (L5)",
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

      // 6. Technology Watch Digest
      if (url.pathname === "/api/tech-watch") {
        return Response.json(seo.getTechnologyWatchDigest());
      }

      return new Response("Not Found", { status: 404 });
    }
  });
}

if (import.meta.main) {
  startMonorepoServer();
  console.log(`Monorepo Server running at http://${HOST}:${PORT}`);
}
