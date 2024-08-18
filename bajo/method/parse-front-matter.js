function parseFrontMatter (input) {
  const { isPlainObject, isArray } = this.app.bajo.lib._
  const { fromYaml, fromToml, fromJson } = this.app.bajoConfig

  const handlers = []
  handlers.push(fromYaml, fromToml, fromJson)
  let success
  for (const handler of handlers) {
    if (success) break
    try {
      const result = handler(input, true)
      if (isPlainObject(result) || isArray(result)) success = result
    } catch (err) {}
  }
  return success ?? {}
}

export default parseFrontMatter
