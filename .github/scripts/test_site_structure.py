"""Check published links, shared navigation and source-download consistency."""
from collections import Counter
import csv
from html.parser import HTMLParser
import json
import posixpath
import unittest
from urllib.parse import parse_qs, unquote, urlsplit

from check_site import PUBLIC_FILES, ROOT


class Document(HTMLParser):
    VOID_TAGS = frozenset('area base br col embed hr img input link meta param source track wbr'.split())

    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.references = []
        self.scripts = []
        self.navigation = {name: [] for name in ('desktop-explore', 'mobile-menu', 'participation-nav')}
        self.source_ids = []
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
        if tag == 'a' and 'href' in attrs:
            for name in self.navigation:
                if any(name in ancestor_classes for _, ancestor_classes in self.stack):
                    self.navigation[name].append(attrs['href'])
        if tag not in self.VOID_TAGS:
            self.stack.append((tag, classes))

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
        html_ids = self.pages['index.html'].source_ids
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
