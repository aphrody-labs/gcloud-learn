#!/usr/bin/env bun
/**
 * CLI Tool for Interactive Learning, Diagnostics, and Google Cloud Exploration.
 */

import { GoogleApiClient } from "../vendor/google-api-client.ts";

const args = process.argv.slice(2);
const command = args[0] || "help";

const client = new GoogleApiClient();

async function run() {
  switch (command) {
    case "status": {
      console.log("=== Google Cloud Learning Portal CLI ===");
      console.log(`Runtime: Upstream Bun ${Bun.version}`);
      console.log(`Target Project: ${client.getProjectId()}`);
      break;
    }
    case "models": {
      console.log(`Fetching Vertex AI Models for ${client.getProjectId()}...`);
      const models = await client.listVertexAiModels();
      console.table(models);
      break;
    }
    case "buckets": {
      console.log(`Listing Storage Buckets for ${client.getProjectId()}...`);
      const buckets = await client.listStorageBuckets();
      console.table(buckets);
      break;
    }
    case "ask": {
      const prompt = args.slice(1).join(" ");
      if (!prompt) {
        console.error("Error: Please provide a question or prompt.");
        process.exit(1);
      }
      console.log(`Querying Gemini (${prompt})...`);
      const res = await client.generateContent({ prompt });
      console.log("\n[Response]:\n", res.text);
      break;
    }
    case "help":
    default: {
      console.log("Usage: bun run cli/main.ts <command> [arguments]");
      console.log("\nAvailable commands:");
      console.log(
        "  status             Display current runtime and GCP config",
      );
      console.log(
        "  models             List available Vertex AI foundational models",
      );
      console.log("  buckets            List Cloud Storage buckets");
      console.log("  ask <prompt>       Interact with Gemini natively");
      console.log("  help               Display this help message");
      break;
    }
  }
}

run().catch((err) => {
  console.error("CLI Execution failed:", err);
  process.exit(1);
});
