#!/usr/bin/env python3
"""
MarketPulse Pro - controlli di coerenza prima di commit/deploy.
Solo libreria standard (richiede `node` nel PATH per il controllo sintattico JS).

Uso:  python3 tools/check.py
Esce con codice 1 se almeno un controllo fallisce.

Controlla:
  1. Sintassi: JS (node --check), Python, JSON, bilanciamento graffe CSS e tag HTML.
  2. Cache-busting: ogni file .js/.css locale è referenziato con ?v=NN, e se il file
     è stato modificato rispetto a HEAD anche la sua versione deve essere cambiata.
  3. Guida: la copia integrata HELP_GUIDE_FULL_MD in app.js coincide con ISTRUZIONI.md
     e ISTRUZIONI.md mantiene le sezioni numerate `## N.`.
  4. Firestore: ogni campo scritto da saveUserDataToCloud e ogni chiave di
     AppState.settings è ammesso dalle whitelist `hasOnly` di firestore.rules.
"""

import json
import os
import re
import subprocess
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

errors = []


def fail(msg):
    errors.append(msg)
    print(f"  ✗ {msg}")


def ok(msg):
    print(f"  ✓ {msg}")


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def git_head(path):
    """Contenuto del file in HEAD, o None se non tracciato / git assente."""
    try:
        return subprocess.run(['git', 'show', f'HEAD:{path}'], capture_output=True,
                              text=True, check=True).stdout
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None


# --------------------------------------------------------------------------
# 1. Sintassi
# --------------------------------------------------------------------------
def check_syntax():
    print("1. Sintassi")
    for js in ['app.js', 'firebase-sync.js', 'firebase-config.js', 'sw.js']:
        try:
            r = subprocess.run(['node', '--check', js], capture_output=True, text=True)
        except FileNotFoundError:
            fail("node non trovato nel PATH: impossibile verificare i file JS")
            break
        if r.returncode == 0:
            ok(js)
        else:
            fail(f"{js}: {r.stderr.strip().splitlines()[0] if r.stderr.strip() else 'errore di sintassi'}")

    for py in ['server.py', 'tools/check.py']:
        try:
            compile(read(py), py, 'exec')  # come py_compile, senza scrivere .pyc
            ok(py)
        except SyntaxError as e:
            fail(f"{py}: riga {e.lineno}: {e.msg}")

    for js_file in ['firebase.json', 'manifest.webmanifest']:
        try:
            json.loads(read(js_file))
            ok(js_file)
        except ValueError as e:
            fail(f"{js_file}: JSON non valido ({e})")

    css = re.sub(r'/\*.*?\*/', '', read('style.css'), flags=re.S)
    css = re.sub(r'"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'', '""', css)
    depth = 0
    for i, ch in enumerate(css):
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth < 0:
                fail(f"style.css: '}}' in eccesso (riga ~{css.count(chr(10), 0, i) + 1})")
                break
    else:
        if depth == 0:
            ok("style.css (graffe bilanciate)")
        else:
            fail(f"style.css: {depth} graffe non chiuse")

    class TagChecker(HTMLParser):
        VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
                'param', 'source', 'track', 'wbr', 'path', 'circle', 'rect', 'line',
                'polyline', 'polygon', 'stop', 'use', 'ellipse'}

        def __init__(self):
            super().__init__()
            self.stack = []
            self.problems = []

        def handle_starttag(self, tag, attrs):
            if tag not in self.VOID:
                self.stack.append((tag, self.getpos()[0]))

        def handle_startendtag(self, tag, attrs):
            pass

        def handle_endtag(self, tag):
            if tag in self.VOID:
                return
            if self.stack and self.stack[-1][0] == tag:
                self.stack.pop()
                return
            # risale lo stack: i tag saltati sono rimasti aperti
            for idx in range(len(self.stack) - 1, -1, -1):
                if self.stack[idx][0] == tag:
                    for t, line in self.stack[idx + 1:]:
                        self.problems.append(f"<{t}> aperto a riga {line} non chiuso")
                    del self.stack[idx:]
                    return
            self.problems.append(f"</{tag}> a riga {self.getpos()[0]} senza apertura")

    checker = TagChecker()
    checker.feed(read('index.html'))
    checker.close()
    checker.problems += [f"<{t}> aperto a riga {line} non chiuso" for t, line in checker.stack]
    if checker.problems:
        for p in checker.problems[:10]:
            fail(f"index.html: {p}")
    else:
        ok("index.html (tag bilanciati)")


# --------------------------------------------------------------------------
# 2. Cache-busting
# --------------------------------------------------------------------------
# (file che contiene il riferimento, regex con gruppo 'v', file referenziato)
VERSIONED_REFS = [
    ('index.html', r'href="style\.css\?v=(?P<v>[^"]+)"', 'style.css'),
    ('index.html', r'src="app\.js\?v=(?P<v>[^"]+)"', 'app.js'),
    ('app.js', r"import\('\./firebase-sync\.js\?v=(?P<v>[^']+)'\)", 'firebase-sync.js'),
    ('firebase-sync.js', r"from '\./firebase-config\.js\?v=(?P<v>[^']+)'", 'firebase-config.js'),
]


def check_cache_busting():
    print("2. Cache-busting (?v=NN)")
    # Nessun riferimento locale .js/.css senza versione
    unversioned = [
        ('index.html', r'(?:src|href)="(?!https?:|//)([^"?]+\.(?:js|css))"'),
        ('app.js', r"import\('\./([^'?]+\.js)'\)"),
        ('firebase-sync.js', r"from '\./([^'?]+\.js)'"),
    ]
    for src, pattern in unversioned:
        for m in re.finditer(pattern, read(src)):
            fail(f"{src}: riferimento senza ?v= a '{m.group(1)}'")

    for src, pattern, target in VERSIONED_REFS:
        m = re.search(pattern, read(src))
        if not m:
            fail(f"{src}: riferimento versionato a {target} non trovato")
            continue
        current_v = m.group('v')
        head_target = git_head(target)
        head_src = git_head(src)
        if head_target is None or head_src is None:
            ok(f"{target} ?v={current_v} (nessun confronto con HEAD)")
            continue
        changed = head_target != read(target)
        hm = re.search(pattern, head_src)
        head_v = hm.group('v') if hm else None
        if changed and head_v == current_v:
            fail(f"{target} è modificato rispetto a HEAD ma la versione in {src} è ancora ?v={current_v}")
        else:
            ok(f"{target} ?v={current_v}" + (" (aggiornata)" if changed else ""))


# --------------------------------------------------------------------------
# 3. Guida in-app
# --------------------------------------------------------------------------
def check_help_guide():
    print("3. Guida in-app (ISTRUZIONI.md)")
    guide = read('ISTRUZIONI.md')
    sections = re.findall(r'^## (\d+)\.', guide, flags=re.M)
    if not sections:
        fail("ISTRUZIONI.md: nessuna sezione '## N.' (app.js scarterebbe il file)")
    elif sections != [str(i) for i in range(1, len(sections) + 1)]:
        fail(f"ISTRUZIONI.md: sezioni non numerate in sequenza ({', '.join(sections)})")
    else:
        ok(f"{len(sections)} sezioni numerate")

    app = read('app.js')
    m = re.search(r'const HELP_GUIDE_FULL_MD = `(.*?)`;', app, flags=re.S)
    if not m:
        fail("app.js: HELP_GUIDE_FULL_MD non trovato")
        return
    embedded = m.group(1).replace('\\`', '`').replace('\\${', '${').replace('\\\\', '\\')
    if embedded.strip() == guide.strip():
        ok("HELP_GUIDE_FULL_MD in app.js coincide con ISTRUZIONI.md")
    else:
        fail("HELP_GUIDE_FULL_MD in app.js differisce da ISTRUZIONI.md: aggiorna la copia integrata")


# --------------------------------------------------------------------------
# 4. Firestore rules vs payload
# --------------------------------------------------------------------------
def has_only_list(rules, func_name):
    m = re.search(rf'function {func_name}\(.*?\.keys\(\)\.hasOnly\(\[(.*?)\]\)', rules, flags=re.S)
    return set(re.findall(r"'([^']+)'", m.group(1))) if m else None


def check_firestore():
    print("4. Firestore rules vs dati sincronizzati")
    rules = read('firestore.rules')
    sync = read('firebase-sync.js')
    app = read('app.js')

    allowed_doc = has_only_list(rules, 'isValidUserDoc')
    m = re.search(r'async function saveUserDataToCloud.*?const payload = \{(.*?)\n\s*\};', sync, flags=re.S)
    if allowed_doc is None or not m:
        fail("impossibile individuare isValidUserDoc o il payload di saveUserDataToCloud")
    else:
        written = set(re.findall(r'^\s*([A-Za-z_]\w*)\s*:', m.group(1), flags=re.M))
        missing = sorted(written - allowed_doc)
        if missing:
            fail(f"campi scritti ma non ammessi da isValidUserDoc: {', '.join(missing)}")
        else:
            ok(f"payload utente ({len(written)} campi) ammesso da isValidUserDoc")

    allowed_settings = has_only_list(rules, 'isValidSettingsMap')
    sm = re.search(r'^  settings: \{(.*?)\n  \}', app, flags=re.S | re.M)
    if allowed_settings is None or not sm:
        fail("impossibile individuare isValidSettingsMap o AppState.settings")
    else:
        keys = set(re.findall(r'^\s*([A-Za-z_]\w*)\s*:', sm.group(1), flags=re.M))
        keys |= set(re.findall(r'AppState\.settings\.([A-Za-z_]\w*)\s*=(?!=)', app))
        missing = sorted(keys - allowed_settings)
        if missing:
            fail(f"chiavi di AppState.settings non ammesse da isValidSettingsMap: {', '.join(missing)}")
        else:
            ok(f"AppState.settings ({', '.join(sorted(keys))}) ammesso da isValidSettingsMap")


if __name__ == '__main__':
    check_syntax()
    check_cache_busting()
    check_help_guide()
    check_firestore()
    print()
    if errors:
        print(f"✗ {len(errors)} problema/i trovato/i")
        sys.exit(1)
    print("✓ Tutti i controlli superati")
