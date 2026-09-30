"""Artifact boundary tests: source preservation, recovery placement and fail closed."""
from pathlib import Path
import tempfile
import unittest
from build_old_site_redirect import build, GENERATED
from check_site import ROOT, PUBLIC_FILES, CSP, stage_site


class LegacyArtifactTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.source = Path(self.tmp.name) / 'source'
        stage_site(self.source)
        self.output = Path(self.tmp.name) / 'output'

    def test_artifact_has_only_public_files_and_reviewed_generated_assets(self):
        self.assertEqual(build(self.source, self.output), len(PUBLIC_FILES) + 2)
        files = {p.relative_to(self.output).as_posix() for p in self.output.rglob('*') if p.is_file()}
        self.assertEqual(files, PUBLIC_FILES | GENERATED)
        self.assertNotIn('CNAME', files)
        for name in PUBLIC_FILES:
            with self.subTest(name=name):
                self.assertEqual((self.source / name).read_bytes(), (ROOT / name).read_bytes())
                if not name.endswith('.html') or name == 'visit/index.html':
                    self.assertEqual((self.output / name).read_bytes(), (ROOT / name).read_bytes())
                else:
                    text = (self.output / name).read_text()
                    self.assertIn(CSP, text)
                    self.assertLess(text.index('cutover-redirect.js'), text.index('theme.js'))
                    self.assertNotIn('src="analytics.js', text)
                    self.assertIn('class="cutover-link"', text)
                    self.assertNotIn('http-equiv="refresh"', text)
        letters = (self.output / 'letters.html').read_text()
        self.assertLess(letters.index('<form id="letter-form"'), letters.index('class="cutover-notice"'))
        self.assertIn('https://formspree.io/f/' + ('xjykjyrk' if 'xjykjyrk' in (ROOT / 'letters.html').read_text() else 'mwlpollw'), letters)
        self.assertIn('id="return-clear"', letters)
        self.assertIn('id="letter-consent"', letters)
        self.assertIn('id="forget-letter"', (self.output / 'sent.html').read_text())

    def test_extra_missing_symlink_and_existing_output_rejected(self):
        (self.source / 'private.txt').write_text('fictional private data')
        with self.assertRaises(ValueError): build(self.source, self.output)
        self.assertFalse(self.output.exists())
        (self.source / 'private.txt').unlink()
        (self.source / 'index.html').unlink()
        with self.assertRaises(ValueError): build(self.source, self.output)
        (self.source / 'index.html').symlink_to(ROOT / 'index.html')
        with self.assertRaises(ValueError): build(self.source, self.output)
        self.output.mkdir()
        (self.output / 'keep.txt').write_text('keep')
        with self.assertRaises(ValueError): build(self.source, self.output)
        self.assertEqual((self.output / 'keep.txt').read_text(), 'keep')
