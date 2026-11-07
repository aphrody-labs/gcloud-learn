// SPDX-License-Identifier: MIT OR Apache-2.0
import { describe, expect, it } from "bun:test";
import { GoogleApiClient } from "../vendor/google-api-client.ts";
import { FirebaseBunFork } from "../vendor/firebase-bun-fork.ts";
import { BillingFinOpsEngine } from "../automations/billing/finops-engine.ts";
import { GoogleBrowserStudio } from "../automations/browser-studio/studio-automator.ts";
import { ServerlessRAGDatabase } from "../api/rag-database.ts";
import { LarryPageMentorEngine } from "../api/larry-soul-mentor.ts";
import { AgyGeminiLarryPlugin } from "../plugins/agy-gemini-larry-soul.ts";

describe("Google Ecosystem & Bun Architecture Suite", () => {
  it("initializes GoogleApiClient with project id", () => {
    const client = new GoogleApiClient({ projectId: "aphrody" });
    expect(client.getProjectId()).toBe("aphrody");
  });

  it("lists storage buckets natively", async () => {
    const client = new GoogleApiClient({ projectId: "aphrody" });
    const buckets = await client.listStorageBuckets();
    expect(buckets.length).toBeGreaterThanOrEqual(1);
    expect(buckets[0].name).toContain("aphrody");
  });

  it("handles offline Gemini generation gracefully", async () => {
    const client = new GoogleApiClient({ projectId: "aphrody" });
    const res = await client.generateContent({ prompt: "Test prompt" });
    expect(res).toBeDefined();
    expect(res.text).toBeDefined();
  });

  it("persists documents in FirebaseBunFork SQLite database", async () => {
    const fork = new FirebaseBunFork();
    await fork.setDoc("candidates", "c1", { name: "Google Paris Candidate", targetRole: "SWE L5" });
    const doc = await fork.getDoc("candidates", "c1");
    expect(doc).toBeDefined();
    expect(doc?.name).toBe("Google Paris Candidate");
  });

  it("evaluates FinOps billing spend checks", async () => {
    const finops = new BillingFinOpsEngine();
    const status = await finops.checkSpend();
    expect(status).toBeDefined();
    expect(status.length).toBeGreaterThan(0);
    expect(status[0].currentSpendUsd).toBeGreaterThanOrEqual(0);
  });

  it("resolves Studio URLs correctly", () => {
    const automator = new GoogleBrowserStudio();
    const url = automator.getTargetUrl("ai-studio");
    expect(url).toContain("aistudio.google.com");
  });

  it("operates Serverless RAG database with WAL SQLite", () => {
    const rag = new ServerlessRAGDatabase(":memory:");
    rag.insertDocument("custom-unique-10x", "larry_mindset", "Larry Custom Rules", "Extreme 10x improvement always", ["custom10x"]);
    const results = rag.search("custom10x");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].title).toBe("Larry Custom Rules");
    rag.close();
  });

  it("executes Larry Page Mentor Soul evaluation", async () => {
    const mentor = new LarryPageMentorEngine();
    const res = await mentor.evaluateCandidateResponse("Je construis en Bun et Rust 10x");
    expect(res.verdict).toBe("Strong Hire");
    expect(res.dimensionScores.gca).toBe(5);
  });

  it("loads and runs AgyGeminiLarryPlugin correctly", async () => {
    const plugin = new AgyGeminiLarryPlugin();
    expect(plugin.id).toBe("agy-larry-page-soul");
    const res = await plugin.handlePrompt("Je veux performer chez Google Cloud Paris");
    expect(res.reply).toContain("LARRY PAGE");
    expect(res.mentorEvaluation).toBeDefined();
  });
});
