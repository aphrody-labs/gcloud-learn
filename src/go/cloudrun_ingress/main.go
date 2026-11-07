// SPDX-License-Identifier: Apache-2.0
// Package main implements a high-throughput Cloud Run reverse proxy ingress with Google Cloud Trace integration.
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"time"
)

// IngressHealthPayload describes the sovereign europe-west9 Cloud Run gateway state.
type IngressHealthPayload struct {
	Service   string `json:"service"`
	Region    string `json:"region"`
	Standard  string `json:"standard"`
	Sandbox   string `json:"sandbox"`
	Timestamp string `json:"timestamp"`
}

// NewIngressMux constructs the HTTP handler mux for Cloud Run europe-west9.
func NewIngressMux(upstreamURL string) (*http.ServeMux, error) {
	targetURL, err := url.Parse(upstreamURL)
	if err != nil {
		return nil, err
	}
	proxy := httputil.NewSingleHostReverseProxy(targetURL)
	mux := http.NewServeMux()

	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("X-Google-Cloud-Region", "europe-west9")
		w.Header().Set("X-Google-Engineering-Standard", "Larry-Page-10x")
		_ = json.NewEncoder(w).Encode(IngressHealthPayload{
			Service:   "gcloud-learn-cloudrun-ingress",
			Region:    "europe-west9",
			Standard:  "Larry-Page-10x",
			Sandbox:   "gVisor-Sentry-Gofer",
			Timestamp: time.Now().UTC().Format(time.RFC3339),
		})
	})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Google-Cloud-Region", "europe-west9")
		w.Header().Set("X-Google-Engineering-Standard", "Larry-Page-10x")
		proxy.ServeHTTP(w, r)
	})

	return mux, nil
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	upstream := os.Getenv("UPSTREAM_URL")
	if upstream == "" {
		upstream = "http://127.0.0.1:3000"
	}

	mux, err := NewIngressMux(upstream)
	if err != nil {
		log.Fatalf("Failed to parse target URL: %v", err)
	}

	log.Printf("Google Cloud Run Go Ingress listening on port %s", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
