# 博客维护说明

这个站点现在支持用 Markdown 来维护博客内容。

## 目录结构

- `content/blog/`：博客文章目录
- `content/blog/<分类目录>/`：每个分类一个文件夹
- `data/blog-manifest.json`：博客索引文件，由脚本自动生成
- `blog.html`：博客列表页
- `post.html`：文章详情页

## 新增一篇文章

推荐直接使用脚本：

```bash
./scripts/new_post.sh tech-notes 技术笔记 my-second-post "我的第二篇文章"
```

执行后会自动完成两件事：

1. 创建新的 Markdown 文件
2. 重新生成 `data/blog-manifest.json`

本地预览时建议使用简单静态服务器，例如：

```bash
python3 -m http.server
```

然后在浏览器访问 `http://localhost:8000`。直接双击 HTML 文件打开时，浏览器通常会因为 `file://` 限制而无法读取本地 `json` 和 `md` 文件。

## 新增一个分类

不需要单独建配置。第一次创建文章时，传入新的分类目录名和分类中文名即可，例如：

```bash
./scripts/new_post.sh essay 随笔记录 spring-day-notes "春天的阶段性复盘"
```

脚本会自动创建新分类目录，并把它加入博客索引。

## 手动维护方式

如果你更喜欢手动创建 Markdown 文件，也可以：

1. 在 `content/blog/<分类目录>/` 下新建 `.md` 文件
2. 按下面格式写文章头部信息
3. 执行 `python3 scripts/build_blog.py`

```md
---
title: 文章标题
date: 2026-04-06
category: 技术笔记
categorySlug: tech-notes
summary: 这里写摘要
---
```

## 当前支持的 Markdown 能力

- 标题
- 段落
- 无序列表 / 有序列表
- 引用
- 行内代码
- 代码块
- 链接
- 图片
