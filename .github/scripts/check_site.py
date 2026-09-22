"""Validate public files before committing or deploying. Python standard library only."""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
import subprocess
from urllib.parse import urlsplit
from public_data import validate_board

ROOT = Path(__file__).resolve().parents[2]
PUBLIC_FILES = frozenset('''
meeting.css meeting.js faq.html discovery.css discovery.js about.html app.js applications.csv community.css corrections.html
corrections.js favicon.svg feedback.css feedback.html feedback.js index.html insights.css navigation.js participation.css enrolment.css
letters.html letters.js letters.json privacy.html proposal.css proposal.html
response-checklist.md response-checklist.pdf sources.csv sources.json styles.css
suggestions.json supporters.html supporters.js supporters.json
understand.html understand.css understand.js understand-data.json richmond-schools.csv
'''.split())
MAINTENANCE_FILES = frozenset('''
.nojekyll .gitignore README.md CODEX-HANDOFF.md .github/workflows/pages.yml
.github/scripts/check_site.py .github/scripts/public_data.py
.github/scripts/test_security.py .github/scripts/test_site_structure.py
AGENTS.md TESTING.md CHANGELOG.md UX-DESIGN-DECISIONS.md package.json package-lock.json playwright.config.js
tests/browser/fixtures.js tests/browser/server.js tests/browser/mobile.spec.js
tests/browser/desktop.spec.js tests/browser/no-javascript.spec.js
tests/browser/contributions.spec.js tests/browser/evidence.spec.js tests/browser/boards.spec.js
tests/browser/visitor-journeys.spec.js tests/browser/understand.spec.js .github/scripts/build_understand.py .github/scripts/test_understand.py
'''.split())
CSP = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; base-uri 'none'; object-src 'none'; frame-src 'none'; form-action 'self' https://formspree.io; upgrade-insecure-requests"
SECRET_PATTERNS = [
    r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
    r'\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,})\b',
    r'\bAKIA[0-9A-Z]{16}\b',
    r'\b(?:sk_live_|sk-proj-|sk-ant-api)[A-Za-z0-9_-]{20,}',
]


def require(ok, message):
    if not ok: raise ValueError(message)


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.csp = False
        self.referrer = False
        self.inputs = {}
        self.feed(text)
        require(self.csp and self.referrer, 'Missing security or referrer policy.')

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        require(not any(k.startswith('on') or k == 'style' for k in a), 'Inline handler or style is forbidden.')
        require(tag not in {'base', 'iframe', 'object', 'embed', 'style'}, 'Unexpected active or embedded content.')
        if tag == 'meta' and a.get('http-equiv', '').lower() == 'content-security-policy':
            require(a.get('content') == CSP, 'Security policy has changed; review it explicitly.')
            self.csp = True
        if tag == 'meta' and a.get('name') == 'referrer':
            require(a.get('content') == 'strict-origin-when-cross-origin', 'Keep form domain validation compatible without leaking query strings.')
            self.referrer = True
        if tag in {'script', 'link', 'img', 'form'}:
            require(self.csp, 'Policy must precede all resources and forms.')
        if tag == 'script':
            script = urlsplit(a.get('src', ''))
            require(not script.scheme and not script.netloc and not script.fragment
                    and script.path in PUBLIC_FILES and script.path.endswith('.js')
                    and (not script.query or re.fullmatch(r'v=[0-9]+', script.query)),
                    'Only reviewed local scripts with optional numeric versions are allowed.')
        if tag in {'link', 'img'}:
            resource = a.get('href') if tag == 'link' else a.get('src')
            # Canonical/document metadata links are not loaded resources.
            if tag == 'img' or a.get('rel') in {'stylesheet', 'icon'}:
                require(resource in PUBLIC_FILES, 'Unexpected external or missing resource.')
        if tag == 'a':
            url = urlsplit(a.get('href', ''))
            require(url.scheme in {'', 'https', 'mailto'}, 'Unsafe link scheme.')
        if tag == 'form' and a.get('id') != 'record-filters':
            require(a.get('action') == 'https://formspree.io/f/mwlpollw' and a.get('method', '').lower() == 'post', 'Unexpected form destination or method.')
        if tag == 'input':
            self.inputs[a.get('id', '')] = a
            if a.get('type') == 'checkbox':
                require('checked' not in a, 'Consent must not be preselected.')


def validate_site(root=ROOT):
    root = Path(root)
    files = set(subprocess.check_output(['git', 'ls-files', '--cached', '--others', '--exclude-standard'], cwd=root, text=True).splitlines())
    require(files <= PUBLIC_FILES | MAINTENANCE_FILES, 'Unexpected repository files: ' + ', '.join(sorted(files - PUBLIC_FILES - MAINTENANCE_FILES)))
    require(PUBLIC_FILES <= files, 'Missing required public files.')
    for name in files:
        p = root / name
        require(not p.is_symlink() and p.resolve().is_relative_to(root.resolve()) and p.is_file(), 'Symlink or missing file: ' + name)
        data = p.read_bytes().decode('utf-8', errors='replace')
        require(not any(re.search(pattern, data) for pattern in SECRET_PATTERNS), 'Possible credential in ' + name + ' (value withheld).')
        if name.endswith('.html'):
            page = Page(data)
            if name == 'letters.html':
                require(all('disabled' in page.inputs.get(field, {}) for field in ('council-name', 'council-postcode')), 'Council identity must be disabled before consent is checked.')
        if name.endswith('.js'):
            require(not re.search(r'\b(?:innerHTML|outerHTML|insertAdjacentHTML|eval)\b|document\.write\s*\(', data), 'Unsafe DOM/code execution sink in ' + name)
    for kind in ('suggestions', 'letters', 'supporters'):
        validate_board(json.loads((root / (kind + '.json')).read_text()), kind)
    return len(PUBLIC_FILES)


def stage_site(output, root=ROOT):
    validate_site(root)
    output = Path(output).resolve()
    require(not output.exists(), 'Use a fresh output directory.')
    require(not output.is_relative_to(Path(root).resolve()), 'Build output must be outside the repository.')
    output.mkdir(parents=True)
    for name in sorted(PUBLIC_FILES):
        shutil.copyfile(Path(root) / name, output / name)
    return len(PUBLIC_FILES)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--stage', type=Path)
    args = parser.parse_args()
    count = stage_site(args.stage) if args.stage else validate_site()
    print(f'Validated {count} public files; private metadata and unexpected fields rejected.')
