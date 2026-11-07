// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 The gcloud-learn Authors. All rights reserved.

import { describe, expect, it } from "bun:test";
import { GoogleCoreEngine } from "@gcloud-learn/core";
import { GoogleSeoLlmsEngine } from "@gcloud-learn/seo-llms";
import { GoogleWebGpu3DGameEngine } from "../apps/game-3d/src/engine.ts";
import { renderPureTsPage } from "../apps/web/src/renderer.ts";

describe("Google Cloud Monorepo Architecture Suite", () => {
  it("initializes GoogleCoreEngine with Paris region defaults", () => {
    const core = new GoogleCoreEngine();
    const region = core.getRegionDetails();
    expect(region.region).toBe("europe-west9");
    expect(region.name).toContain("Paris");
    expect(region.zones.length).toBe(3);
  });

  it("generates 2026 LLMs.txt manifest for Gemini Search and Googlebot", () => {
    const seo = new GoogleSeoLlmsEngine();
    const txt = seo.generateLlmsTxt();
    expect(txt).toContain("Chromium");
    expect(txt).toContain("AOSP");
    expect(txt.toLowerCase()).toContain("europe-west9");
    expect(txt).toContain("Larry Page");
  });

  it("provides live technology watch on Alphabet and Google OSS", () => {
    const seo = new GoogleSeoLlmsEngine();
    const digest = seo.getTechnologyWatchDigest();
    expect(digest.technologyWatch.chromium).toBeDefined();
    expect(digest.technologyWatch.aosp).toBeDefined();
    expect(digest.technologyWatch.skillsBoost).toBeDefined();
  });

  it("runs the WebGPU 3D Cloud Simulation Game Engine", () => {
    const game = new GoogleWebGpu3DGameEngine();
    const nodes = game.getNodes();
    expect(nodes.length).toBeGreaterThanOrEqual(4);
    const shader = game.getWebGpuWgslShaderSource();
    expect(shader).toContain("@vertex");
    expect(shader).toContain("@fragment");

    const challenge = game.simulateGamifiedChallenge("We deploy serverless on Cloud Run with 10x scalability");
    expect(challenge.scoreBonus).toBe(100);
    expect(challenge.unlockedCertificationBadge).toContain("PCA Master");
  });

  it("renders pure TypeScript SSR page without legacy HTML/CSS files", () => {
    const html = renderPureTsPage("Google Paris Hub", { status: "ready" });
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("Google Paris Hub");
    expect(html).toContain("LARRY PAGE SOUL ACTIVE");
  });
});
