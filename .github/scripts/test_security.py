import copy
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from check_site import CSP, Page, PUBLIC_FILES, ROOT, stage_site, validate_site
from public_data import STATEMENT, STATEMENT_VERSION, validate_board


def fixture(kind):
    prefix = {'suggestions': 'idea', 'letters': 'letter', 'supporters': 'supporter'}[kind]
    review = {'suggestions': 'AI reviewed', 'letters': 'Human reviewed', 'supporters': 'Confirmed with contributor; human reviewed'}[kind]
    row = {'id': prefix + '-0123456789ab', 'date': '2026-09-21', 'review': review, 'displayName': 'Example neighbour'}
    if kind != 'supporters': row['body'] = 'Please keep the community informed about the next meeting.'
    if kind == 'suggestions': row['status'] = 'Received'
    board = {'version': 1, kind: [row]}
    if kind == 'supporters': board.update(statement=STATEMENT, statementVersion=STATEMENT_VERSION)
    return board


class PublicDataTests(unittest.TestCase):
    def test_valid_boards_and_legacy_anonymous_suggestion(self):
        for kind in ('suggestions', 'letters', 'supporters'):
            validate_board(fixture(kind), kind)
        old = fixture('suggestions'); old['suggestions'][0].pop('displayName')
        validate_board(old, 'suggestions')

    def test_private_fields_at_either_level_fail_closed(self):
        for kind in ('suggestions', 'letters', 'supporters'):
            for key in ('email', 'council_name', 'council_postcode', 'queue_key', 'approval_reference'):
                for at_root in (True, False):
                    board = fixture(kind)
                    (board if at_root else board[kind][0])[key] = 'fictional private test data'
                    with self.subTest(kind=kind, key=key, root=at_root), self.assertRaises(ValueError):
                        validate_board(board, kind)

    def test_duplicates_invalid_types_dates_review_and_markup_rejected(self):
        for kind in ('suggestions', 'letters', 'supporters'):
            for patch in ({'id': '../invalid'}, {'date': '2026-02-31'}, {'review': 'Approved'}, {'displayName': {'email': 'test@example.invalid'}}, {'displayName': '<svg onload=alert(1)>'}):
                board = fixture(kind); board[kind][0].update(patch)
                with self.subTest(kind=kind, patch=patch), self.assertRaises(ValueError): validate_board(board, kind)
            board = fixture(kind); board[kind].append(copy.deepcopy(board[kind][0]))
            with self.assertRaises(ValueError): validate_board(board, kind)


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory(); self.addCleanup(temp.cleanup)
        self.base = Path(temp.name); self.root = self.base / 'site'; self.root.mkdir()
        for name in PUBLIC_FILES: shutil.copyfile(ROOT / name, self.root / name)
        subprocess.run(['git', 'init', '-q', str(self.root)], check=True)

    def test_stage_contains_only_intended_public_assets(self):
        (self.root / 'README.md').write_text('Maintenance notes')
        stage_site(self.base / 'output', self.root)
        self.assertEqual({p.name for p in (self.base / 'output').iterdir()}, PUBLIC_FILES)

    def test_raw_inbox_or_unknown_file_stops_deployment(self):
        (self.root / 'intake.json').write_text('{}')
        with self.assertRaises(ValueError): stage_site(self.base / 'output', self.root)
        self.assertFalse((self.base / 'output').exists())

    def test_bad_board_stops_deployment_even_when_browser_would_hide_field(self):
        board = fixture('letters'); board['letters'][0]['email'] = 'test@example.invalid'
        (self.root / 'letters.json').write_text(json.dumps(board))
        with self.assertRaises(ValueError): validate_site(self.root)

    def test_symlink_stops_deployment(self):
        (self.base / 'private').write_text('private')
        (self.root / 'letters.json').unlink()
        (self.root / 'letters.json').symlink_to(self.base / 'private')
        with self.assertRaises(ValueError): validate_site(self.root)

    def test_disabled_private_fields_and_csp_are_required(self):
        p = self.root / 'letters.html'; p.write_text(p.read_text().replace('id="council-name" disabled', 'id="council-name"'))
        with self.assertRaises(ValueError): validate_site(self.root)
        with self.assertRaises(ValueError): Page('<script src="app.js"></script>')
        with self.assertRaises(ValueError): Page('<meta http-equiv="Content-Security-Policy" content="' + CSP + '"><img src="favicon.svg" onerror="alert(1)">')


if __name__ == '__main__': unittest.main()
