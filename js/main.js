import Alpine from 'https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.10.5/module.esm.min.js'
import { showGuru } from './guru-error.js'

const dataFile = 'data/mame.xml'
const pageSize = 150

window.addEventListener('load', startApp)

function startApp() {
  Alpine.data('gameComponent', () => ({
    games: [],
    err: null,
    filterRom: '',
    filterManu: '',
    filterDesc: '',
    filterClones: false,
    filteredGames: [],
    page: 0,
    pageCount: 0,
    filterCount: 0,

    // Magic AlpineJS method, called when component is loaded
    init: async function () {
      try {
        this.games = await loadData()
      } catch (e) {
        showGuru(e, true, true)
        this.err = e
        return
      }

      this.$watch('page', () => {
        this.runFilter()
      })

      this.runFilter()
    },

    // Run the filter and update filteredGames which updates the page
    runFilter: function () {
      const filtResult = this.games.filter((g) => {
        if (
          g['@_name'].startsWith(this.filterRom) &&
          g.manufacturer.toLowerCase().includes(this.filterManu) &&
          g.description.toString().toLowerCase().includes(this.filterDesc) &&
          (!this.filterClones || !g['@_cloneof'])
        ) {
          return true
        }

        return false
      })

      this.filterCount = filtResult.length
      this.filteredGames = filtResult.slice(this.page * pageSize, (this.page + 1) * pageSize)
      this.pageCount = Math.ceil(this.filterCount / pageSize)
    },
  }))

  // Needed to start AlpineJS when using ES6 modules
  Alpine.start()
}

// Helper function to load the XML data file
async function loadData() {
  console.log('Loading data...')

  const dataResp = await fetch(dataFile)
  if (!dataResp.ok) {
    throw new Error(`Failed to load ${dataFile}: ${dataResp.status}`)
  }
  const xmlContent = await dataResp.text()
  const parser = new fxparser.XMLParser({ ignoreAttributes: false })
  const rawData = parser.parse(xmlContent)

  console.log(`Loaded ${rawData.mame.game.length} games`)

  // Sort the games by description
  const sortedGames = rawData.mame.game.sort((a, b) => {
    const aName = a.description.toString().toLowerCase()
    const bName = b.description.toString().toLowerCase()
    if (aName < bName) {
      return -1
    }
    if (aName > bName) {
      return 1
    }
    return 0
  })

  return sortedGames
}
