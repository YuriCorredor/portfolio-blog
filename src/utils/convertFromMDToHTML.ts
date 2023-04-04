import showdown from 'showdown'

const customClassElementMap = {
  h1: 'title-2xl',
  h2: 'title-xl',
  h3: 'title-lg',
  h4: 'title-md',
  h5: 'title-sm',
  p: 'paragraph',
  a: 'anchor',
  code: 'code',
  blockquote: 'blockquote',
  ul: 'unordered',
  ol: 'ordered',
  li: 'list-item',
  table: 'table',
  thead: 'table-head',
  th: 'table-head-cell',
  td: 'table-cell',
  tr: 'table-row',
  details: 'details',
  summary: 'summary',
}

function addCustomClassToHTMLElements(element: string) {
  Object.entries(customClassElementMap).forEach(([key, value]) => {
    let regex = new RegExp(`<${key} `, 'g')
    element = element.replace(regex, `<${key} class="${value}"`)
    regex = new RegExp(`<${key}>`, 'g')
    element = element.replace(regex, `<${key} class="${value}">`)
  })
  return element
}

const converter = new showdown.Converter({
  tables: true,
  backslashEscapesHTMLTags: true,
})
converter.addExtension({
  type: 'output',
  filter: addCustomClassToHTMLElements,
})

export function makeHTMLFromMarkdown(markdown: string) {
  return converter.makeHtml(markdown)
}
