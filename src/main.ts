import jsdom from "jsdom"

interface StackShareCategory {
  name: string
  tools: {
    name: string
    base64img: string
    type: string
  }[]
}

function replaceNewLines(str: string | undefined | null) {
  if (!str) return undefined
  return str.replace(/(\r\n|\n|\r)/gm, "")
}

export default async function parseStackShare(url: string): Promise<StackShareCategory[]> {
  let JSONResult: StackShareCategory[] = []

  let stackshareResponse = await fetch(url)
  let stackshareHtml = await stackshareResponse.text()
  if (!stackshareHtml) throw new Error("No HTML response from StackShare")
  let dom = new jsdom.JSDOM(stackshareHtml)
  let categories = dom.window.document.querySelectorAll(".layer-wrapper")

  for (let category of categories) {
    let tools = category.querySelectorAll(".service-function-wrapper")
    for (let tool of tools) {
      let name = tool.querySelector("span.stack-service-name-under")?.textContent
      name = replaceNewLines(name)

      let type = tool.querySelector("div.function-name-under")?.textContent
      type = replaceNewLines(type)

      let imgUrl = tool.querySelector("div.stack-service-logo>img")?.getAttribute("src")
      let base64img: string | null = null

      if (!imgUrl) {
        base64img = null
      } else {
        let imageData = await fetch(imgUrl)
        let buffer = await imageData.arrayBuffer()
        base64img = Buffer.from(buffer).toString("base64")
      }
    }
  }

  return JSONResult
}
