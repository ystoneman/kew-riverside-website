"""Check published links, shared navigation and source-download consistency."""
from collections import Counter
import csv
from html.parser import HTMLParser
import json
import posixpath
import unittest
from urllib.parse import parse_qs, unquote, urlsplit

from check_site import PUBLIC_FILES, ROOT


# Snapshot of the moved homepage IDs before the September 2026 page split.
# Keep this independent of the new pages: deleting an entry must fail the check,
# even if no current page still links to that previously shared address.
LEGACY_EVIDENCE_IDS = '''
evidence visual-preview-title school-roll-title roll-svg-title roll-svg-desc
borough-context trend-title trend-desc area-fill timeline earlier-record records
record-filters record-search topic-filter year-filter type-filter status-filter
result-count research-count clear-filters source-lessons-report source-grid
source-organisation-overview-2026 source-school-census-jan-2026
source-school-capacity-may-2025 source-hampton-wick-proposal-2026
source-consultation-richmond source-inspection-2026 source-newsletter-2026
source-committee-september-2026 source-guidance-index source-guidance-2026
source-participation source-buildings-2026 source-planning-nov-2025
source-committee-nov-2025 source-forum-july-2025 source-planning-july-2025
source-committee-june-2025 source-forum-2024 source-planning-2024 source-strategy-2023
source-inspection-2021 source-inspection-2017 source-inspection-2012
source-assessment-2011 source-visit-2009 source-inspection-2007 source-inspection-2003
source-school-home source-pfi source-school-finance source-benchmarking
source-ofsted-index source-newsletter-index source-committee-index
source-committee-meetings source-forum-index source-petitions source-petition-scheme
source-gias source-consultation-afc source-consultation-leaflet
source-consultation-faq source-consultation-response source-committee-remit
source-committee-chair source-committee-vice-chair source-committee-november-2026
no-results gaps method
'''.split()
LEGACY_OPTION_IDS = '''
options option-recovery-plan option-crowdfunding crowdfunding-funding-needed
crowdfunding-council-assessment crowdfunding-sustainability crowdfunding-recipient
crowdfunding-outreach crowdfunding-examples crowdfunding-appeal-terms
crowdfunding-expertise option-demand option-enrolment
'''.split()


class Document(HTMLParser):
    VOID_TAGS = frozenset('area base br col embed hr img input link meta param source track wbr'.split())

    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.references = []
        self.scripts = []
        self.navigation = {name: [] for name in ('desktop-explore', 'mobile-menu', 'participation-nav')}
        self.source_ids = []
        self.legacy_routes = {}
        self.legacy_links = {}
        self.stack = []
        self.feed(text)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        classes = set(attrs.get('class', '').split())
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for attribute in ('href', 'src'):
            if attribute in attrs:
                self.references.append((tag, attribute, attrs[attribute]))
        if tag == 'script' and 'src' in attrs:
            self.scripts.append(attrs['src'])
        if 'source-card' in classes:
            self.source_ids.append(attrs.get('id', ''))
        if 'legacy-route' in classes:
            self.legacy_routes[attrs.get('id', '')] = attrs.get('data-destination', '')
        if tag == 'a' and 'href' in attrs:
            for name in self.navigation:
                if any(name in ancestor_classes for _, ancestor_classes, _ in self.stack):
                    self.navigation[name].append(attrs['href'])
            for _, ancestor_classes, ancestor_attrs in self.stack:
                if 'legacy-route' in ancestor_classes:
                    self.legacy_links.setdefault(ancestor_attrs.get('id', ''), []).append(attrs['href'])
        if tag not in self.VOID_TAGS:
            self.stack.append((tag, classes, attrs))

    def handle_startendtag(self, tag, attributes):
        self.handle_starttag(tag, attributes)
        if tag not in self.VOID_TAGS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break


def local_destination(page, reference):
    """Resolve relative project-site URLs without treating a query as a filename."""
    url = urlsplit(reference)
    if url.scheme or url.netloc:
        return None
    path = unquote(url.path)
    filename = posixpath.normpath(posixpath.join(posixpath.dirname(page), path)) if path else page
    if path.endswith('/'):
        filename = posixpath.join(filename, 'index.html')
    return filename, unquote(url.fragment)


def navigation_destinations(page, references):
    # The homepage's #top and other pages' index.html both mean "Home".
    return {(filename, '' if fragment == 'top' else fragment)
            for filename, fragment in (local_destination(page, ref) for ref in references)}


class SiteStructureTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = {name: Document((ROOT / name).read_text(encoding='utf-8'))
                     for name in sorted(PUBLIC_FILES) if name.endswith('.html')}

    def test_local_links_resources_and_fragments_resolve(self):
        for name, page in self.pages.items():
            for tag, attribute, reference in page.references:
                with self.subTest(page=name, element=tag, attribute=attribute, reference=reference):
                    destination = local_destination(name, reference)
                    if destination is None:
                        continue  # External availability is not a local CI dependency.
                    filename, fragment = destination
                    self.assertIn(filename, PUBLIC_FILES, 'Link/resource is outside the published asset list')
                    self.assertTrue((ROOT / filename).is_file(), 'Linked public file is missing')
                    if fragment and filename in self.pages:
                        self.assertIn(fragment, self.pages[filename].ids, 'The destination anchor does not exist')

    def test_document_ids_are_unique(self):
        for name, page in self.pages.items():
            with self.subTest(page=name):
                duplicates = [identifier for identifier, count in Counter(page.ids).items() if count > 1]
                self.assertEqual(duplicates, [], 'Duplicate IDs make anchors and controls ambiguous')

    def test_previously_shared_homepage_anchors_keep_explicit_fallbacks(self):
        expected = {identifier: filename + '#' + identifier
                    for filename, identifiers in (('evidence.html', LEGACY_EVIDENCE_IDS),
                                                   ('options.html', LEGACY_OPTION_IDS))
                    for identifier in identifiers}
        homepage = self.pages['index.html']
        for identifier, destination in expected.items():
            with self.subTest(anchor=identifier):
                self.assertEqual(homepage.legacy_routes.get(identifier), destination,
                                 'A previously shared homepage URL lost its destination')
                self.assertIn(destination, homepage.legacy_links.get(identifier, []),
                              'Legacy destinations need usable links without JavaScript')
                filename, fragment = local_destination('index.html', destination)
                self.assertIn(fragment, self.pages[filename].ids,
                              'A legacy route must reach the original named content')

    def test_every_page_uses_the_same_versioned_navigation_script(self):
        baseline = [src for src in self.pages['index.html'].scripts if urlsplit(src).path == 'navigation.js']
        self.assertEqual(len(baseline), 1)
        self.assertTrue(parse_qs(urlsplit(baseline[0]).query).get('v'), 'Navigation fixes need a cache version')
        for name, page in self.pages.items():
            with self.subTest(page=name):
                actual = [src for src in page.scripts if urlsplit(src).path == 'navigation.js']
                self.assertEqual(actual, baseline, 'Pages must load the same navigation release exactly once')

    def test_shared_navigation_destinations_stay_consistent(self):
        baseline = self.pages['index.html'].navigation
        expected_desktop = navigation_destinations('index.html', baseline['desktop-explore'])
        self.assertTrue(expected_desktop)
        for name, page in self.pages.items():
            with self.subTest(page=name):
                desktop = navigation_destinations(name, page.navigation['desktop-explore'])
                mobile = navigation_destinations(name, page.navigation['mobile-menu'])
                participation = navigation_destinations(name, page.navigation['participation-nav'])
                self.assertEqual(desktop, expected_desktop, 'Desktop destinations differ between pages')
                self.assertEqual(mobile, desktop | {('index.html', '')}, 'Mobile menu must retain every desktop destination and Home')
                self.assertEqual(participation, {('letters.html', ''), ('feedback.html', '')})

    def test_source_library_and_downloads_contain_the_same_records(self):
        records = json.loads((ROOT / 'sources.json').read_text(encoding='utf-8'))['records']
        with (ROOT / 'sources.csv').open(encoding='utf-8-sig', newline='') as stream:
            rows = list(csv.DictReader(stream))
        json_ids = [record['id'] for record in records]
        csv_ids = [row['Record reference'] for row in rows]
        html_ids = self.pages['evidence.html'].source_ids
        self.assertTrue(json_ids, 'The source library must not disappear silently')
        self.assertEqual(len(json_ids), len(set(json_ids)), 'Duplicate JSON record reference')
        self.assertEqual(len(csv_ids), len(set(csv_ids)), 'Duplicate CSV record reference')
        self.assertCountEqual(csv_ids, json_ids)
        self.assertCountEqual(html_ids, ['source-' + record_id for record_id in json_ids])
        by_id = {record['id']: record for record in records}
        columns = {'Title': 'title', 'Publisher': 'publisher', 'Document date': 'date',
                   'Document type': 'type', 'Topic': 'topic', 'Review status': 'status',
                   'Summary': 'summary', 'Source URL': 'url',
                   'Document location and context': 'locator', 'Access checked': 'accessChecked', 'Year': 'year'}
        for row in rows:
            for column, key in columns.items():
                with self.subTest(record=row['Record reference'], column=column):
                    value = by_id[row['Record reference']][key]
                    self.assertEqual(row[column], '' if value is None else str(value))


if __name__ == '__main__':
    unittest.main()
