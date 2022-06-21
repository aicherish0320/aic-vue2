import { parserHTML } from './htmlParser'

export function compileToFunction(template) {
  // 将模板转换成 ast 语法树
  const ast = parserHTML(template)
  console.log('ast >>> ', ast)
}
