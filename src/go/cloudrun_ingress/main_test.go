// SPDX-License-Identifier: Apache-2.0
package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestIngressHealthzAndHeaders(t *testing.T) {
	mux, err := NewIngressMux("http://127.0.0.1:3000")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	rec := httptest.NewRecorder()
	mux.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d", rec.Code)
	}
	if got := rec.Header().Get("X-Google-Cloud-Region"); got != "europe-west9" {
		t.Fatalf("expected region header europe-west9, got %q", got)
	}

	var payload IngressHealthPayload
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatalf("invalid json: %v", err)
	}
	if payload.Sandbox != "gVisor-Sentry-Gofer" {
		t.Fatalf("unexpected sandbox: %s", payload.Sandbox)
	}
}
