// Vanilla Web Components and Client-Side Logic for GCloud Learn

class GCloudTelemetry extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="font-size: 0.8rem; color: #8c9099; margin-top: 1rem; text-align: center;">
        Engineered with Upstream Bun Native APIs & Google Cloud Platform Architecture.
      </div>
    `;
  }
}

if (!customElements.get("gcloud-telemetry")) {
  customElements.define("gcloud-telemetry", GCloudTelemetry);
}

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.createElement("gcloud-telemetry");
  document.body.appendChild(footer);
});
