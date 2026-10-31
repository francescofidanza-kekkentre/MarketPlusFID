#!/usr/bin/env python3
"""
MarketPulse Pro - Local Server & Financial API Proxy for Chromebook (ChromeOS)
Zero-dependency, uses Python standard library only.
"""

import sys
import os
import json
import urllib.request
import urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8080

class MarketPulseHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local testing & PWA Service Worker headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # API Proxy endpoint for Yahoo Finance (Bypasses CORS in local dev)
        if self.path.startswith('/api/quote'):
            self.handle_quote_proxy()
            return
        elif self.path.startswith('/api/history'):
            self.handle_history_proxy()
            return
        elif self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'app': 'MarketPulse Pro'}).encode('utf-8'))
            return

        # Serve static PWA files
        super().do_GET()

    def handle_quote_proxy(self):
        query = self.path.split('?')
        params = {}
        if len(query) > 1:
            for pair in query[1].split('&'):
                if '=' in pair:
                    k, v = pair.split('=', 1)
                    params[k] = v

        symbol = params.get('symbol', 'NVDA')
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d"

        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (X11; CrOS aarch64 15183.78.0) AppleWebKit/537.36'}
        )

        try:
            with urllib.request.urlopen(req, timeout=5) as response:
                data = response.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(data)
        except Exception as e:
            self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

    def handle_history_proxy(self):
        query = self.path.split('?')
        params = {}
        if len(query) > 1:
            for pair in query[1].split('&'):
                if '=' in pair:
                    k, v = pair.split('=', 1)
                    params[k] = v

        symbol = params.get('symbol', 'NVDA')
        range_val = params.get('range', '1mo')
        interval = params.get('interval', '1d')
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range={range_val}&interval={interval}"

        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (X11; CrOS aarch64 15183.78.0) AppleWebKit/537.36'}
        )

        try:
            with urllib.request.urlopen(req, timeout=5) as response:
                data = response.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(data)
        except Exception as e:
            self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

def run_server():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)

    port = PORT
    for p in [8080, 8000, 5000, 3000]:
        try:
            server = HTTPServer(('0.0.0.0', p), MarketPulseHandler)
            port = p
            break
        except OSError:
            continue

    print("=" * 65)
    print(" 🚀 MarketPulse Pro • Server Chromebook Avviato con Successo!")
    print("=" * 65)
    print(f" • Apri nel browser Chrome su Chromebook: http://localhost:{port}")
    print(" • Per installare come app nativa: Clicca l'icona 'Installa App' nella barra")
    print("   oppure clicca l'icona di installazione nella barra degli indirizzi di Chrome.")
    print("=" * 65)
    print(" Premi Ctrl+C per arrestare il server.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nArresto del server...")
        server.server_close()

if __name__ == '__main__':
    run_server()
