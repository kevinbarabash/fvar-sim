import opentype from 'opentype.js'

console.log(opentype)

const svgNS = 'http://www.w3.org/2000/svg'

const svg = document.createElementNS(svgNS, 'svg')
svg.setAttribute('width', 250)
svg.setAttribute('height', 750)
svg.setAttribute('viewBox', '50 -1250 1000 3000')

const g = document.createElementNS(svgNS, 'g')
g.setAttribute('fill', 'rgba(0, 0, 0, 0.25)')
g.setAttribute('stroke', 'black')
svg.appendChild(g)

document.body.appendChild(svg)

const glyphName = 'radical'

for (let i = 1; i <= 4; i++) {
    opentype.load(`/fonts/KaTeX_Size${i}-Regular.ttf`, (err, font) => {
        console.log(font)
        const index = font.glyphNames.nameToGlyphIndex(glyphName)
        const radical = font.glyphs.glyphs[index]
        const path = radical.path
        console.log(path.commands.map(c => c.type).join(''))
        const d = path.toSVG(2)

        g.innerHTML = g.innerHTML + d
    })
}
