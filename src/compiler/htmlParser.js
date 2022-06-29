const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/

export function parserHTML(html) {
  html = html.trim()
  // 构建父子关系
  // 使用 stack 型结构
  const stack = []
  let root

  function createASTElement(tag, attrs, parent) {
    return {
      type: 1,
      tag,
      attrs,
      children: [],
      parent
    }
  }

  function start(tagName, attrs) {
    const parent = stack[stack.length - 1]
    const element = createASTElement(tagName, attrs, parent)
    // 初始化根
    if (!root) {
      root = element
    }

    if (parent) {
      parent.children.push(element)
      element.parent = parent
    }

    stack.push(element)
    // console.log('start >>> ', tagName, attrs)
  }
  function end(tagName) {
    stack.pop()
    // console.log('end >>> ', tagName)
  }
  function text(chars) {
    // console.log('chars >>> ', chars)
    const parent = stack[stack.length - 1]
    chars = chars.replace(/\s/g, '')
    if (chars) {
      parent.children.push({
        type: 2,
        text: chars
      })
    }
  }

  function advance(len) {
    html = html.substring(len)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (!start) return
    const match = {
      tagName: start[1],
      attrs: []
    }
    advance(start[0].length)

    let end, attr
    while (
      !(end = html.match(startTagClose)) &&
      (attr = html.match(attribute))
    ) {
      match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
      advance(attr[0].length)
    }

    if (end) {
      advance(end[0].length)
    }

    return match
  }
  while (html) {
    let index = html.indexOf('<')
    if (index === 0) {
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        // 开始标签
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch
      if ((endTagMatch = html.match(endTag))) {
        // 结束标签
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
    }

    if (index > 0) {
      let chars = html.substring(0, index)
      text(chars)
      advance(chars.length)
    }
  }

  return root
}
