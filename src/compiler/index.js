import { generate } from './generate'
import { parserHTML } from './htmlParser'

export function compileToFunction(template) {
  // 将模板转换成 ast 语法树
  const ast = parserHTML(template)
  // 代码优化 标记静态节点
  // 代码生成
  const code = generate(ast)
  const render = new Function(`with(this){return ${code} }`)
  console.log('ast >>> ', ast)
  console.log('code >>> ', code)
  console.log('render >>> ', render.toString())
}
