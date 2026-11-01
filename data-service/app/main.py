"""
Rio Banking Python Data & Risk Microservice
Zero external dependencies required - runs natively on Python 3.8+
Port: 8000
"""
import json
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn
from urllib.parse import urlparse

from risk_engine import evaluate_transaction_risk
from analytics import get_branch_summary

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class RioServiceHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200, content_type="application/json"):
        self.send_response(status_code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path in ["/", "/health"]:
            self._set_headers(200)
            payload = {
                "status": "healthy",
                "service": "Rio Bank Risk & Analytics Engine",
                "version": "1.0.0",
                "currency": "INR"
            }
            self.wfile.write(json.dumps(payload).encode("utf-8"))
        elif parsed.path == "/api/v1/analytics/branch-summary":
            self._set_headers(200)
            data = get_branch_summary()
            self.wfile.write(json.dumps(data).encode("utf-8"))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/v1/evaluate-risk":
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_length).decode("utf-8")
                payload = json.loads(body) if body else {}
                result = evaluate_transaction_risk(payload)
                self._set_headers(200)
                self.wfile.write(json.dumps(result).encode("utf-8"))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": f"Invalid payload: {str(e)}"}).encode("utf-8"))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

    def log_message(self, format, *args):
        # Clean logging format
        sys.stdout.write(f"[Rio Microservice] {args[0]} {args[1]} -> {args[2]}\n")

def run(port=8000):
    server_address = ("127.0.0.1", port)
    httpd = ThreadedHTTPServer(server_address, RioServiceHandler)
    print(f"======================================================")
    print(f" Rio Banking Data & Risk Microservice running on : {port}")
    print(f" Endpoints: /health, /api/v1/evaluate-risk, /api/v1/analytics/branch-summary")
    print(f"======================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down microservice.")
        httpd.server_close()

if __name__ == "__main__":
    run(8000)

