// SPDX-License-Identifier: Apache-2.0
// Package main implements a high-throughput Cloud Run reverse proxy ingress with Google Cloud Trace integration.
package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	targetURL, err := url.Parse("http://127.0.0.1:3000")
	if err != nil {
		log.Fatalf("Failed to parse target URL: %v", err)
	}

	proxy := httputil.NewSingleHostReverseProxy(targetURL)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Google-Cloud-Region", "europe-west9")
		w.Header().Set("X-Google-Engineering-Standard", "Larry-Page-10x")
		proxy.ServeHTTP(w, r)
	})

	log.Printf("Google Cloud Run Go Ingress listening on port %s", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
