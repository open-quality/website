const fs = require('node:fs')
const path = require('node:path')
const MarkdownIt = require('markdown-it')

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
})

function loadStories(dir) {
  const absolute = path.join(process.cwd(), dir)
  if (!fs.existsSync(absolute)) return []

  return fs
    .readdirSync(absolute)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(absolute, file), 'utf-8')
      const html = md.render(raw)
      return {
        slug,
        raw,
        html,
        sourcePath: path.join(dir, file),
      }
    })
}

module.exports = {
  articles: loadStories('content/articles'),
  shorts: loadStories('content/short'),
}
