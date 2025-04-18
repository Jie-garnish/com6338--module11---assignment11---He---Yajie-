const getPoemBtn = document.getElementById('get-poem')
const poemEl = document.getElementById('poem')
const poemURL = 'https://poetrydb.org/random,linecount/1;12/author,title,lines.json'

const getJSON = url => fetch(url).then(res => res.json())

const pipe = (...fns) => firstArg => fns.reduce((returnValue, fn) => fn(returnValue), firstArg)

const makeTag = tag => str => `<${tag}>${str}</${tag}>`

const makePoemHTML = poemJSON => {
  const { title, author, lines } = poemJSON[0]

  const makeH2 = makeTag('h2')
  const makeH3 = makeTag('h3')
  const makeEm = makeTag('em')
  const makeP = makeTag('p')

  const titleHTML = makeH2(title)
  const authorHTML = makeH3(makeEm(`by ${author}`))

  const stanzas = []
  let stanzaLines = []

  for (const line of lines) {
    if (line === '') {
      if (stanzaLines.length) {
        stanzas.push(makeP(stanzaLines.join('<br>')))
        stanzaLines = []
      }
    } else {
      stanzaLines.push(line)
    }
  }

  if (stanzaLines.length) {
    stanzas.push(makeP(stanzaLines.join('<br>')))
  }

  return [titleHTML, authorHTML, ...stanzas].join('')
}

getPoemBtn.onclick = async function() {
  try {
    const poemData = await getJSON(poemURL)
    poemEl.innerHTML = makePoemHTML(poemData)
  } catch (error) {
    poemEl.innerHTML = `<p>Error fetching poem: ${error.message}</p>`
  }
}