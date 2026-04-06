const BLOG_MANIFEST_PATH = "data/blog-manifest.json";

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "blog") {
    renderBlogIndex().catch(handleFatalError);
  }
  if (page === "post") {
    renderPostPage().catch(handleFatalError);
  }
});

async function loadManifest() {
  const response = await fetch(BLOG_MANIFEST_PATH);
  if (!response.ok) {
    throw new Error("博客索引加载失败");
  }
  return response.json();
}

async function renderBlogIndex() {
  const manifest = await loadManifest();
  const params = new URLSearchParams(window.location.search);
  const currentCategory = params.get("category") || "all";

  const categoryList = document.getElementById("category-list");
  const postList = document.getElementById("post-list");
  const blogListTitle = document.getElementById("blog-list-title");
  const blogListMeta = document.getElementById("blog-list-meta");

  const allCategory = {
    slug: "all",
    name: "全部文章",
    count: manifest.posts.length,
  };

  const categories = [allCategory, ...manifest.categories];
  categoryList.innerHTML = categories
    .map((category) => {
      const isActive = category.slug === currentCategory;
      return `<button class="chip${isActive ? " active" : ""}" data-category="${escapeHtml(
        category.slug
      )}">${escapeHtml(category.name)} (${category.count})</button>`;
    })
    .join("");

  categoryList.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.category;
      const url = new URL(window.location.href);
      if (next === "all") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", next);
      }
      window.location.href = url.toString();
    });
  });

  const filteredPosts =
    currentCategory === "all"
      ? manifest.posts
      : manifest.posts.filter((post) => post.categorySlug === currentCategory);

  const activeCategory = categories.find((category) => category.slug === currentCategory) || allCategory;
  blogListTitle.textContent = activeCategory.name;
  blogListMeta.textContent = `共 ${filteredPosts.length} 篇文章`;

  if (filteredPosts.length === 0) {
    postList.innerHTML = '<div class="empty-state">这个分类下还没有文章，可以先新增一篇 Markdown 试试。</div>';
    return;
  }

  postList.innerHTML = filteredPosts
    .map(
      (post) => `
        <article class="post-card">
          <h3><a class="text-link" href="post.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h3>
          <div class="post-card-meta">
            <span>${escapeHtml(post.categoryName)}</span>
            <span>${escapeHtml(post.date)}</span>
            <span>${escapeHtml(post.readingTime)}</span>
          </div>
          <p>${escapeHtml(post.summary)}</p>
        </article>
      `
    )
    .join("");
}

async function renderPostPage() {
  const manifest = await loadManifest();
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  if (!slug) {
    throw new Error("缺少文章标识");
  }

  const post = manifest.posts.find((item) => item.slug === slug);
  if (!post) {
    throw new Error("未找到对应文章");
  }

  const response = await fetch(post.path);
  if (!response.ok) {
    throw new Error("文章内容加载失败");
  }

  const rawMarkdown = await response.text();
  const { body } = parseFrontMatter(rawMarkdown);

  document.title = `${post.title} | 朱力波`;
  document.getElementById("post-category").textContent = post.categoryName;
  document.getElementById("post-title").textContent = post.title;
  document.getElementById("post-meta").innerHTML = `
    <span>${escapeHtml(post.date)}</span>
    <span>${escapeHtml(post.readingTime)}</span>
  `;
  document.getElementById("post-summary").textContent = post.summary;
  document.getElementById("post-content").innerHTML = renderMarkdown(body);
}

function handleFatalError(error) {
  const target = document.getElementById("post-content") || document.getElementById("post-list");
  if (target) {
    target.innerHTML = `<div class="empty-state">${escapeHtml(error.message || "页面加载失败")}</div>`;
  }
}

function parseFrontMatter(content) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  if (lines[0] !== "---") {
    return { attributes: {}, body: content };
  }

  const attributes = {};
  let index = 1;
  while (index < lines.length && lines[index] !== "---") {
    const line = lines[index];
    const separator = line.indexOf(":");
    if (separator > -1) {
      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();
      attributes[key] = stripQuotes(value);
    }
    index += 1;
  }

  return {
    attributes,
    body: lines.slice(index + 1).join("\n").trim(),
  };
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function renderMarkdown(markdown) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      i += 1;
      const codeLines = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(
        `<pre><code class="language-${escapeHtml(language)}">${escapeHtml(codeLines.join("\n"))}</code></pre>`
      );
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i += 1;
      }
      blocks.push(`<blockquote>${quoteLines.map(renderInline).join("<br>")}</blockquote>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
      continue;
    }

    const paragraphLines = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("> ") &&
      !/^(#{1,4})\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i])
    ) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }
    blocks.push(`<p>${renderInline(paragraphLines.join(" "))}</p>`);
  }

  return blocks.join("\n");
}

function renderInline(text) {
  let html = escapeHtml(text);
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  return html;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
