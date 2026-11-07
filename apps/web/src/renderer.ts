// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 The gcloud-learn Authors. All rights reserved.
// 100% Pure TypeScript SSR Web Interface for gcloud-learn (0% HTML/CSS/JS legacy files)

export function renderPureTsPage(title: string, state: Record<string, unknown>): string {
  const jsonState = JSON.stringify(state, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="Sovereign Google Cloud Paris & Alphabet Engineering Portal in Pure TypeScript and Bun">
  <link rel="canonical" href="https://gcloud-learn.aphrody.com">
  <style>
    :root {
      --g-blue: #4285f4;
      --g-red: #ea4335;
      --g-yellow: #fbbc05;
      --g-green: #34a853;
      --bg: #05080c;
      --surface: #0c121b;
      --text: #f5f7fa;
      --text-highlight: #ffd54f;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 2rem; line-height: 1.6; }
    .skip-link { position: absolute; left: -9999px; top: auto; width: 1px; height: 1px; overflow: hidden; }
    .skip-link:focus { position: static; width: auto; height: auto; padding: 0.5rem 1rem; background: var(--text-highlight); color: #05080c; }
    header { border-bottom: 1px solid var(--surface); padding-bottom: 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; }
    h1 { color: var(--text-highlight); font-size: 1.8rem; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: bold; background: var(--g-blue); color: white; font-size: 0.8rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; }
    .card { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1.5rem; }
    .card h2 { color: var(--text-highlight); font-size: 1.2rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem; }
    pre { background: #010409; padding: 1rem; border-radius: 6px; overflow-x: auto; font-family: monospace; font-size: 0.85rem; color: #58a6ff; }
  </style>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header>
    <div>
      <h1>${title}</h1>
      <p>Target: Google Cloud Paris (europe-west9) &amp; Upstream Bun Architecture</p>
      <nav aria-label="Primary navigation">
        <a href="https://gcloud-learn.aphrody.com" style="color:#ffb74d;">Dashboard</a> |
        <a href="https://gcloud-learn.aphrody.com/llms.txt" style="color:#ffb74d;">llms.txt</a>
      </nav>
    </div>
    <span class="badge">LARRY PAGE MENTOR ACTIVE</span>
  </header>
  <main id="main-content" class="grid">
    <div class="card">
      <h2>Architecture & Pillars</h2>
      <p>100% Upstream Bun v1.4.4+, Pure TypeScript, Serverless SQLite WAL, WebGPU 3D Engine, Chromium & AOSP Standards.</p>
    </div>
    <div class="card">
      <h2>Live State & Telemetry</h2>
      <pre>${jsonState}</pre>
    </div>
  </main>
</body>
</html>`;
}
