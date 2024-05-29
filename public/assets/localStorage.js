const $ = (el) => document.getElementById(el)
const sites = [
  "https://www.greenfielddemo.com/localStorage.html",
  "https://www.hello.dev/localStorage.html",
  "https://www.hello.coop/localStorage.html",
  "https://console.hello.coop/localStorage.html",
  "https://playground.hello.dev/localStorage.html",
  "https://wallet.hello.coop/localStorage.html",
  "https://quickstart.hello.coop/localStorage.html",
  "https://blog.hello.coop/localstorage/"
]
const hydrate = () => {
  $("hostname").textContent = window.location.hostname
  processParams()
  addList()
  plausibleIgnoreState()
}

const processParams = () => {
  const params = new URLSearchParams(window.location.search)
  if (!params.get("action") || !params.get("sites")) {
    cleanURL()
    return
  }
  if (params.get("action") === "ignoreAll") {
    console.info("Setting plausible_ignore at " + window.location.hostname)
    localStorage.setItem("plausible_ignore", true)
  } else if (params.get("action") === "clearAll") {
    console.info("Clearing localStorage at " + window.location.hostname)
    localStorage.clear()
  }
  let _sites = params.get("sites")
  _sites = _sites.split(",")
  _sites.pop()
  if (!_sites.length) {
    cleanURL()
    return
  }
  params.set("sites", _sites.toString())
  const url = new URL(_sites[_sites.length - 1])
  url.search = params
  window.location.href = url
}

const ignoreAll = () => {
  const url = makeParams("ignoreAll")
  window.location.href = url
}

const clearAll = () => {
  const url = makeParams("clearAll")
  window.location.href = url
}

const cleanURL = () => {
  window.history.pushState(
    {},
    document.title,
    window.location.href.substring(0, window.location.href.indexOf("?"))
  )
}

const makeParams = (type) => {
  let params = new URLSearchParams()
  if (type === "clearAll") {
    params.append("action", "clearAll")
  } else if (type === "ignoreAll") {
    params.append("action", "ignoreAll")
  }
  params.append("sites", sites.toString())
  const url = new URL(sites[sites.length - 1])
  url.search = params
  return url
}

const plausibleIgnoreState = () => {
  const checkboxRef = $("plausible_ignore")
  if (localStorage.getItem("plausible_ignore")) {
    plausible_ignore.checked = true
  }
  checkboxRef.addEventListener("change", () => {
    if (checkboxRef.checked) {
      console.info("plausible_ignore added to localStorage")
      localStorage.setItem("plausible_ignore", true)
    } else {
      console.info("plausible_ignore removed from localStorage")
      localStorage.removeItem("plausible_ignore")
    }
  })
}

const addList = () => {
  const linksRef = $("links")
  for (const site of sites) {
    if (site === window.location.href) continue
    const link = new URL(site)
    const liEl = document.createElement("li")
    const aEl = document.createElement("a")
    aEl.textContent = link.hostname
    aEl.href = link
    aEl.classList.add("underline")
    liEl.appendChild(aEl)
    linksRef.appendChild(liEl)
  }
}