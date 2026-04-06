#!/bin/zsh

set -euo pipefail

if [ "$#" -lt 4 ]; then
  echo "用法：scripts/new_post.sh 分类目录名 分类中文名 文章slug 文章标题"
  exit 1
fi

category_slug="$1"
category_name="$2"
post_slug="$3"
post_title="$4"

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
target_dir="$root_dir/content/blog/$category_slug"
target_file="$target_dir/$post_slug.md"
today="$(date +%F)"

mkdir -p "$target_dir"

if [ -e "$target_file" ]; then
  echo "文章已存在：$target_file"
  exit 1
fi

cat > "$target_file" <<EOF
---
title: $post_title
date: $today
category: $category_name
categorySlug: $category_slug
summary: 请在这里填写文章摘要。
---

# $post_title

请从这里开始写正文。
EOF

python3 "$root_dir/scripts/build_blog.py"
echo "已创建文章：$target_file"
