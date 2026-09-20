from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[2]
OLD = "https://www.umamanualidades.com/"
NEW = "https://umamanualidades.com/"

LINK_TAG_RE = re.compile(r"<link\b[^>]*>", re.I)
META_TAG_RE = re.compile(r"<meta\b[^>]*>", re.I)
LDJSON_RE = re.compile(
    r"<script\b(?=[^>]*\btype=[\"'][^>]*application/ld\+json[^>]*[\"'])[^>]*>.*?</script>",
    re.I | re.S,
)
CANONICAL_TAG_RE = re.compile(
    r"<link\b(?=[^>]*\brel=[\"'][^\"']*\bcanonical\b[^\"']*[\"'])[^>]*>",
    re.I,
)
HREF_RE = re.compile(r"\bhref=[\"']([^\"']+)[\"']", re.I)
ROBOTS_TAG_RE = re.compile(
    r"<meta\b(?=[^>]*\bname=[\"']robots[\"'])[^>]*>",
    re.I,
)
CONTENT_RE = re.compile(r"\bcontent=[\"']([^\"']*)[\"']", re.I)


def replace_host(value: str) -> str:
    return value.replace(OLD, NEW).replace("http://www.umamanualidades.com/", NEW)


def normalize_seo_markup(text: str) -> str:
    def link_cb(match: re.Match[str]) -> str:
        tag = match.group(0)
        lower = tag.lower()
        if "canonical" in lower or "hreflang=" in lower:
            return replace_host(tag)
        return tag

    def meta_cb(match: re.Match[str]) -> str:
        tag = match.group(0)
        lower = tag.lower()
        if "og:url" in lower or "twitter:url" in lower:
            return replace_host(tag)
        return tag

    text = LINK_TAG_RE.sub(link_cb, text)
    text = META_TAG_RE.sub(meta_cb, text)
    text = LDJSON_RE.sub(lambda m: replace_host(m.group(0)), text)
    return text


def canonical_from_html(text: str) -> str | None:
    tag_match = CANONICAL_TAG_RE.search(text)
    if not tag_match:
        return None
    href = HREF_RE.search(tag_match.group(0))
    if not href:
        return None
    url = replace_host(href.group(1).strip())
    parts = urlsplit(url)
    if parts.scheme != "https" or parts.netloc not in {"umamanualidades.com", "www.umamanualidades.com"}:
        return None
    clean = urlunsplit(("https", "umamanualidades.com", parts.path or "/", "", ""))
    return clean


def is_noindex(text: str) -> bool:
    match = ROBOTS_TAG_RE.search(text)
    if not match:
        return False
    content = CONTENT_RE.search(match.group(0))
    return bool(content and "noindex" in content.group(1).lower())


def read_text(path: Path) -> str:
    return path.read_bytes().decode("utf-8-sig", errors="strict")


def write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8", newline="\n")


html_files = sorted(ROOT.rglob("*.html"))
modified = 0
canonicals: set[str] = set()

for path in html_files:
    rel = path.relative_to(ROOT)
    text = read_text(path)
    normalized = normalize_seo_markup(text)
    if normalized != text:
        write_text(path, normalized)
        modified += 1
        text = normalized

    if rel.as_posix() == "404.html" or is_noindex(text):
        continue
    canonical = canonical_from_html(text)
    if canonical:
        canonicals.add(canonical)

# Preserve the rich image sitemap already present for category/page hubs.
page_sitemap = ROOT / "page-sitemap.xml"
page_tree = ET.parse(page_sitemap)
ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
page_urls = {
    replace_host((loc.text or "").strip())
    for loc in page_tree.findall(".//sm:loc", ns)
    if (loc.text or "").strip()
}

# Put every remaining canonical/indexable HTML URL into a complementary sitemap.
content_urls = sorted(canonicals - page_urls)
content_xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]
for url in content_urls:
    content_xml.extend(["  <url>", f"    <loc>{url}</loc>", "  </url>"])
content_xml.append("</urlset>")
write_text(ROOT / "content-sitemap.xml", "\n".join(content_xml) + "\n")

index_xml = """<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="https://umamanualidades.com/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://umamanualidades.com/page-sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://umamanualidades.com/content-sitemap.xml</loc>
  </sitemap>
</sitemapindex>
"""
write_text(ROOT / "sitemap_index.xml", index_xml)

robots = ROOT / "robots.txt"
robots_text = read_text(robots)
robots_text = re.sub(
    r"(?mi)^Sitemap:\s*\S+\s*$",
    "Sitemap: https://umamanualidades.com/sitemap_index.xml",
    robots_text,
)
write_text(robots, robots_text)

llms = ROOT / "llms.txt"
if llms.exists():
    llms_text = replace_host(read_text(llms))
    llms_text = llms_text.replace(
        "- [Posts sitemap](https://umamanualidades.com/post-sitemap.xml): Sitemap of individual tutorials and articles.",
        "- [Content sitemap](https://umamanualidades.com/content-sitemap.xml): Sitemap of individual tutorials and articles.",
    )
    write_text(llms, llms_text)

# Hard validation.
ET.parse(ROOT / "page-sitemap.xml")
ET.parse(ROOT / "content-sitemap.xml")
ET.parse(ROOT / "sitemap_index.xml")

if len(canonicals) < 1000:
    raise SystemExit(f"Unexpectedly low canonical count: {len(canonicals)}")
if len(page_urls | set(content_urls)) < 1000:
    raise SystemExit("Combined sitemap coverage unexpectedly low")

print(f"HTML files scanned: {len(html_files)}")
print(f"HTML files normalized: {modified}")
print(f"Indexable canonical URLs: {len(canonicals)}")
print(f"Existing page sitemap URLs: {len(page_urls)}")
print(f"Complementary content sitemap URLs: {len(content_urls)}")
print(f"Combined sitemap URLs: {len(page_urls | set(content_urls))}")
