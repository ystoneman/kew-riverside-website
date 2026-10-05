"""Build the legacy Pages artifact after ordinary public-allowlist validation.

Source pages remain complete and unchanged for separate-domain promotion and
no-JavaScript fallback. This transformer adds no CNAME or server-side redirect.
"""
import argparse
import html
from pathlib import Path
import re
import shutil

from check_site import PUBLIC_FILES, CSP

ROOT = Path(__file__).resolve().parent
GENERATED = {'cutover-redirect.js', 'cutover.css'}


def build(source, output):
    source, output = Path(source), Path(output)
    if output.exists():
        raise ValueError('Output must be a new directory.')
    entries = list(source.rglob('*'))
    if any(path.is_symlink() for path in entries):
        raise ValueError('Symlinks are forbidden in the staged site.')
    files = {path.relative_to(source).as_posix() for path in entries if path.is_file()}
    if files != PUBLIC_FILES:
        raise ValueError('Input must contain exactly the validated public allowlist.')
    # Validate every changed page before creating any output.
    transformed = {}
    for name in sorted(files):
        if not name.endswith('.html') or name == 'visit/index.html':
            continue
        text = (source / name).read_text()
        marker = '<meta name="referrer" content="strict-origin-when-cross-origin">'
        if text.count(marker) != 1 or CSP not in text or '</head>' not in text:
            raise ValueError('Missing reviewed security/header structure: ' + name)
        if not re.fullmatch(r'[a-z0-9-]+\.html', name):
            raise ValueError('Unreviewed HTML path: ' + name)
        injection = ('<script src="cutover-redirect.js?v=2026100501" data-page="' + name + '"></script>'
                     '<link rel="stylesheet" href="cutover.css?v=2026100501">')
        text = text.replace(marker, marker + injection, 1)
        text = re.sub(r'<script src="analytics\.js\?v=\d+" defer></script>', '', text)
        if name == 'privacy.html':
            analytics_notice = ('<section id="analytics"><h2>Website analytics</h2>'
                                '<p>Analytics is disabled on this previous website address, including '
                                'its saved-letter recovery pages. Existing browser choices are not '
                                'transferred or cleared. On the new website, both analytics levels '
                                'start off until you choose one. '
                                '<a href="https://savekewriversideprimaryschool.org/privacy.html#analytics">'
                                'Read the current analytics information and choices</a>.</p></section>')
            text, count = re.subn(r'<section id="analytics">.*?</section>', analytics_notice, text, count=1, flags=re.S)
            if count != 1:
                raise ValueError('Missing analytics privacy section.')
        destination = 'https://savekewriversideprimaryschool.org/' + ('' if name == 'index.html' else name)
        text = re.sub(r'<link rel="canonical" href="[^"]+">', '', text)
        text = text.replace('</head>', '<link rel="canonical" href="' + destination + '"></head>', 1)
        notice = ('<section class="cutover-notice" aria-label="Website moved">'
                  '<p><strong>New website:</strong> <a class="cutover-link" href="' +
                  html.escape(destination, quote=True) + '">savekewriversideprimaryschool.org</a>.</p>')
        if name in {'letters.html', 'sent.html'}:
            notice += ('<p>Saved letters stay here. Copy your words below before continuing; '
                       'they do not transfer automatically.</p>')
        notice += '<noscript><p>JavaScript is off. Use the link above to open the new site. This page remains available here.</p></noscript></section>'
        if name == 'letters.html':
            text, count = re.subn(r'(<form id="letter-form"[^>]*>)', lambda m: m[1] + notice, text, count=1)
        else:
            text, count = re.subn(r'(<main\b[^>]*>)', lambda m: m[1] + notice, text, count=1)
        if count != 1:
            raise ValueError('Missing notice placement: ' + name)
        transformed[name] = text
    shutil.copytree(source, output)
    for name, text in transformed.items():
        (output / name).write_text(text)
    shutil.copyfile(ROOT / 'old_site_redirect.js', output / 'cutover-redirect.js')
    shutil.copyfile(ROOT / 'old_site_redirect.css', output / 'cutover.css')
    return len(files) + len(GENERATED)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    print('Built', build(args.source, args.output), 'reviewed legacy public assets.')
