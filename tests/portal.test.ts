import { describe, expect, it } from "bun:test";
import { GoogleApiClient } from "../vendor/google-api-client.ts";
import { FirebaseBunFork } from "../vendor/firebase-bun-fork.ts";
import { BillingFinOpsEngine } from "../automations/billing/finops-engine.ts";
import { GoogleBrowserStudio } from "../automations/browser-studio/studio-automator.ts";

describe("Google Ecosystem & Bun Architecture Suite", () => {
  it("initializes GoogleApiClient with project id", () => {
    const client = new GoogleApiClient({ projectId: "test-gcp-project" });
    expect(client.getProjectId()).toBe("test-gcp-project");
  });

  it("lists storage buckets natively", async () => {
    const client = new GoogleApiClient({ projectId: "test-gcp-project" });
    const buckets = await client.listStorageBuckets();
    expect(buckets.length).toBeGreaterThan(0);
    expect(buckets[0].id).toContain("test-gcp-project");
  });

  it("handles offline Gemini generation gracefully", async () => {
    const client = new GoogleApiClient({ projectId: "test-gcp-project" });
    const res = await client.generateContent({ prompt: "What is Cloud Run?" });
    expect(res.text).toContain("What is Cloud Run?");
    expect(res.usage?.totalTokens).toBe(37);
  });

  it("persists documents in FirebaseBunFork SQLite database", async () => {
    const fb = new FirebaseBunFork({
      projectId: "test-fb",
      sqlitePath: ":memory:",
    });
    await fb.setDoc("users", "user1", { name: "Google Lead", certified: true });
    const doc = await fb.getDoc("users", "user1");
    expect(doc).not.toBeNull();
    expect(doc?.name).toBe("Google Lead");
    expect(doc?.certified).toBe(true);

    const all = await fb.queryDocs("users");
    expect(all.length).toBe(1);
    fb.close();
  });

  it("evaluates FinOps billing spend checks", async () => {
    const engine = new BillingFinOpsEngine();
    const statuses = await engine.checkSpend();
    expect(statuses.length).toBe(3);
    expect(statuses[0].service).toBe("Google Cloud Platform");
  });

  it("resolves Studio URLs correctly", () => {
    const studio = new GoogleBrowserStudio();
    expect(studio.getTargetUrl("ai-studio")).toContain("aistudio.google.com");
  });
});
