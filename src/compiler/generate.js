const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function genProps(attrs) {
  // { "id": "app", "id": "app" }
  let str = ''
  attrs.forEach((attr) => {
    if (attr.name === 'style') {
      const styleValue = attr.value.split(';')

      let style = ''
      styleValue.forEach((item) => {
        const [name, value] = item.split(':')
        style += `${JSON.stringify(name.trim())}:${JSON.stringify(
          value.trim()
        )},`
      })

      str += `style: {${style.slice(0, -1)}},`
    } else {
      str += `${attr.name}: ${JSON.stringify(attr.value)},`
    }
  })
  return `{${str.slice(0, -1)}}`
}

function genChildren(children) {
  return children.map((item) => genChild(item)).join(',')
}

function genChild(el) {
  if (el.type === 1) {
    return generate(el)
  } else {
    const text = el.text
    if (!defaultTagRE.test(text)) {
      return `_v('${text}')`
    }
    // 有表达式
    // {{ message }} -> _v(_s(message))
    // aa {{ message }} bb -> _v("aa " + _s(message) + " bb")
    // aa {{ message }} bb {{ name }} cc -> _v("aa " + _s(message) + " bb " + _s(name) + " cc")
    let lastIndex = (defaultTagRE.lastIndex = 0)
    let tokens = []
    let match

    while ((match = defaultTagRE.exec(text))) {
      let index = match.index
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }

    return `_v(${tokens.join('+')})`
  }
}

export function generate(ast) {
  const attrs = ast.attrs
  const children = ast.children

  let code = `_c('${ast.tag}',${
    attrs && attrs.length ? genProps(attrs) : 'undefined'
  }${children && children.length ? ',' + genChildren(children) : ''})`

  return code
}
