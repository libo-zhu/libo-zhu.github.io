# 博客使用说明

这个站点的博客已经改成了 `Markdown + 分类目录 + 自动生成索引` 的方式。

你以后写博客，核心只需要记住这几件事：

1. 文章写在 `content/blog/` 下面
2. 每个分类对应一个文件夹
3. 每新增或修改文章后，执行一次索引生成脚本
4. 本地预览确认没问题后，再提交到 GitHub

---

## 一、博客目录结构

博客相关文件主要在这些位置：

- `content/blog/`
  所有博客文章都放在这里
- `content/blog/<分类目录>/`
  每个分类一个文件夹
- `data/blog-manifest.json`
  博客文章索引文件，博客页面就是读取这个文件来显示分类和文章列表
- `blog.html`
  博客列表页
- `post.html`
  博客详情页
- `scripts/build_blog.py`
  扫描所有 Markdown 文章，重新生成博客索引
- `scripts/new_post.sh`
  一键创建新文章并自动更新博客索引

---

## 二、新写一篇博客，要做哪几步

推荐流程如下。

### 第 1 步：确定文章分类

先想清楚这篇文章属于哪个分类，例如：

- `tech-notes`
  技术笔记
- `project-review`
  项目复盘
- `essay`
  随笔记录

这里有两个概念：

- 分类目录名：英文或拼音，给程序和路径用
- 分类中文名：页面上展示给读者看

例如：

- 分类目录名：`tech-notes`
- 分类中文名：`技术笔记`

---

### 第 2 步：创建 Markdown 文件

文章要放到对应分类目录下。

例如你要写一篇技术笔记：

```bash
content/blog/tech-notes/my-second-post.md
```

如果这个分类目录还不存在，也可以新建。

---

### 第 3 步：写文章头部信息

每篇文章开头都要写这一段：

```md
---
title: 我的第二篇文章
date: 2026-04-06
category: 技术笔记
categorySlug: tech-notes
summary: 这里写文章摘要，列表页会显示这段内容。
---
```

这几个字段的含义：

- `title`
  文章标题
- `date`
  文章日期，建议格式固定为 `年-月-日`，例如 `2026-04-06`
- `category`
  分类中文名
- `categorySlug`
  分类目录名
- `summary`
  文章摘要，博客列表页会展示

这个头部下面再开始写正文，例如：

```md
# 我的第二篇文章

这里开始写正文。

## 一个小节

- 支持列表
- 支持代码块
- 支持标题
```

---

## 三、最推荐的方式：直接用脚本创建文章

你不一定每次都要手动建文件，推荐直接用这个命令：

```bash
./scripts/new_post.sh tech-notes 技术笔记 my-second-post "我的第二篇文章"
```

这条命令会自动帮你完成两件事：

1. 创建文章文件
2. 自动更新博客索引

它的参数顺序是：

```bash
./scripts/new_post.sh 分类目录名 分类中文名 文章slug 文章标题
```

例如：

```bash
./scripts/new_post.sh project-review 项目复盘 bronzes-platform-review "铜韵慧识项目复盘"
```

执行后会自动生成：

```bash
content/blog/project-review/bronzes-platform-review.md
```

---

## 四、如果我要新建一个“新分类”，怎么做

不用额外配配置文件，直接第一次写这个分类的文章就行。

比如你想新增一个分类叫“随笔记录”：

```bash
./scripts/new_post.sh essay 随笔记录 spring-notes "四月阶段性复盘"
```

它会自动：

1. 创建 `content/blog/essay/` 目录
2. 在里面创建文章
3. 更新博客索引
4. 在博客页面里把这个新分类显示出来

也就是说：

- 新分类不需要手动注册
- 第一次创建该分类下的文章时，它就会自动出现

---

## 五、文章写完后，怎么更新博客

如果你是手动新建或手动修改 Markdown 文件，那么改完以后要执行：

```bash
python3 scripts/build_blog.py
```

这个命令会重新扫描 `content/blog/` 下所有文章，并更新：

```bash
data/blog-manifest.json
```

如果你用的是 `scripts/new_post.sh` 来创建文章，那么这一步它已经自动帮你做了。

但是：

- 你新建文章后要更新一次
- 你修改文章标题、日期、分类、摘要后，也最好再执行一次

这样博客列表页的数据才一定是最新的。

---

## 六、怎么本地预览博客页面

不要直接双击 HTML 文件打开，因为浏览器通常会拦截本地 `json` 和 `md` 文件读取。

正确方式是在项目根目录执行：

```bash
python3 -m http.server
```

然后打开：

```text
http://localhost:8000
```

你可以重点检查：

- 首页能不能进入博客页
- 博客分类是否显示正确
- 文章列表是否出现
- 点进文章详情后内容是否正常

---

## 七、发布前建议检查什么

每次准备提交到 GitHub Pages 前，建议按这个顺序检查：

1. Markdown 文件是不是放在正确分类目录下
2. 文章头部信息有没有写完整
3. 是否执行过 `python3 scripts/build_blog.py`
4. 本地页面能否正常打开
5. 博客列表里能否看到新文章
6. 点进详情页后内容是否正常显示

---

## 八、一个完整示例

假设你要新增一篇“技术笔记”文章，标题叫《SpringBoot 项目部署记录》。

### 方式 1：用脚本创建

执行：

```bash
./scripts/new_post.sh tech-notes 技术笔记 springboot-deploy-log "SpringBoot 项目部署记录"
```

然后去编辑这个文件：

```bash
content/blog/tech-notes/springboot-deploy-log.md
```

写完以后本地预览即可。

---

### 方式 2：手动创建

先手动新建文件：

```bash
content/blog/tech-notes/springboot-deploy-log.md
```

写入：

```md
---
title: SpringBoot 项目部署记录
date: 2026-04-06
category: 技术笔记
categorySlug: tech-notes
summary: 记录一次 SpringBoot 项目部署过程中的环境配置和问题排查。
---

# SpringBoot 项目部署记录

这里开始写正文。
```

然后执行：

```bash
python3 scripts/build_blog.py
```

---

## 九、你以后最常用的两个命令

创建新文章：

```bash
./scripts/new_post.sh tech-notes 技术笔记 my-post "文章标题"
```

重新生成博客索引：

```bash
python3 scripts/build_blog.py
```

---

## 十、简单记忆版

如果你只想记最短流程，就记下面这个：

1. 在 `content/blog/分类目录/` 下写 `.md`
2. 文章开头写好 `title`、`date`、`category`、`categorySlug`、`summary`
3. 执行 `python3 scripts/build_blog.py`
4. 用 `python3 -m http.server` 本地预览
5. 没问题就提交到 GitHub
