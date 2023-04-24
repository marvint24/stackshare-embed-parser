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

let JSONResult: StackShareCategory[] = []

let stackshareResponse = await fetch("https://embed.stackshare.io/stacks/embed/3bd65ed6468388c08b3c0a8bd772f1")
let stackshareHtml = await stackshareResponse.text()
let dom = new jsdom.JSDOM(stackshareHtml)
let categories = dom.window.document.querySelectorAll(".layer-wrapper")

let data = 0
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

    if (base64img) {
      data += base64img?.length
    }
  }
}
console.log(data)
