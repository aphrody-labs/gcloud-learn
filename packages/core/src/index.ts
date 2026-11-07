// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 The gcloud-learn Authors. All rights reserved.

export interface GoogleCloudConfig {
  projectId: string;
  region: string;
  zone: string;
  authMode: "adc" | "service_account" | "api_key";
}

export class GoogleCoreEngine {
  private config: GoogleCloudConfig;

  constructor(config?: Partial<GoogleCloudConfig>) {
    this.config = {
      projectId: config?.projectId || process.env.GCP_PROJECT || "aphrody",
      region: config?.region || "europe-west9",
      zone: config?.zone || "europe-west9-a",
      authMode: config?.authMode || "adc"
    };
  }

  public getConfig(): GoogleCloudConfig {
    return { ...this.config };
  }

  public getRegionDetails() {
    return {
      region: this.config.region,
      name: "Google Cloud Paris (Rue de Londres / Vélizy)",
      zones: ["europe-west9-a", "europe-west9-b", "europe-west9-c"],
      carbonFreeEnergy: "100%",
      lowLatencyTargetMs: 1.2
    };
  }
}
