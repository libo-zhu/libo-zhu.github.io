#!/usr/bin/env python3

import json
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "content" / "blog"
OUTPUT_PATH = ROOT / "data" / "blog-manifest.json"


def parse_front_matter(path: Path):
    text = path.read_text(encoding="utf-8")
    lines = text.replace("\r\n", "\n").split("\n")
    attributes = {}

    if lines and lines[0].strip() == "---":
        index = 1
        while index < len(lines) and lines[index].strip() != "---":
            line = lines[index]
            if ":" in line:
                key, value = line.split(":", 1)
                attributes[key.strip()] = value.strip().strip("'\"")
            index += 1

    return attributes


def estimate_reading_time(path: Path):
    text = path.read_text(encoding="utf-8")
    words = max(len(text.split()), 1)
    minutes = max(1, round(words / 220))
    return f"约 {minutes} 分钟"


def build_manifest():
    posts = []
    category_counts = {}
    category_names = {}

    for md_path in sorted(CONTENT_DIR.rglob("*.md")):
        attributes = parse_front_matter(md_path)
        slug = md_path.stem
        category_slug = attributes.get("categorySlug", md_path.parent.name)
        category_name = attributes.get("category", category_slug)

        category_counts[category_slug] = category_counts.get(category_slug, 0) + 1
        category_names[category_slug] = category_name

        posts.append(
            {
                "slug": slug,
                "title": attributes.get("title", slug),
                "summary": attributes.get("summary", ""),
                "date": attributes.get("date", ""),
                "categorySlug": category_slug,
                "categoryName": category_name,
                "path": md_path.relative_to(ROOT).as_posix(),
                "readingTime": estimate_reading_time(md_path),
            }
        )

    posts.sort(key=lambda item: item["date"], reverse=True)
    categories = [
        {
            "slug": slug,
            "name": category_names[slug],
            "count": category_counts[slug],
        }
        for slug in sorted(category_counts)
    ]

    manifest = {
        "generatedAt": str(date.today()),
        "categories": categories,
        "posts": posts,
    }
    OUTPUT_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    build_manifest()
