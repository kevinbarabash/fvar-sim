import opentype from 'opentype.js'

console.log(opentype)

const svgNS = 'http://www.w3.org/2000/svg'

const svg = document.createElementNS(svgNS, 'svg')
svg.setAttribute('width', 1250)
svg.setAttribute('height', 750)
svg.setAttribute('viewBox', '50 -1250 5000 3000')

const g = document.createElementNS(svgNS, 'g')
g.setAttribute('fill', 'rgba(0, 0, 0, 0.25)')
g.setAttribute('stroke', 'black')
g.setAttribute('transform', `translate(250, 500) scale(1,-1)`)
svg.appendChild(g)

document.body.appendChild(svg)

const glyphName = 'radical'
const parser = new DOMParser()

const loadFont = (url) => {
    return new Promise((resolve, reject) => {
        opentype.load(url, (err, font) => {
            if (err) {
                reject(err)
            } else {
                resolve(font)
            }
        })
    })
}

const renderGlyph = (glyph) => {
    while (g.firstElementChild) {
        g.removeChild(g.firstElementChild)
    }

    const doc = parser.parseFromString(glyph.path.toSVG(2), 'image/svg+xml')
    const path = document.createElementNS(svgNS, 'path')
    path.setAttribute('d', doc.firstElementChild.getAttribute('d'))
    g.appendChild(path)

    const commands = glyph.path.commands
    for (let i = 0; i < commands.length - 1; i++) {
        const c1 = commands[i]
        const c2 = commands[i+1]
        if (c2.type === 'L') {
            const line = document.createElementNS(svgNS, 'line')
            line.setAttribute('id', i+1)
            line.setAttribute('x1', c1.x)
            line.setAttribute('y1', c1.y)
            line.setAttribute('x2', c2.x)
            line.setAttribute('y2', c2.y)
            line.setAttribute('stroke-width', 20)
            line.addEventListener('mouseenter', () => {
                line.setAttribute('stroke', 'red')
            })
            line.addEventListener('mouseleave', () => {
                line.setAttribute('stroke', 'black')
            })
            line.addEventListener('click', () => {
                console.log(line)
            })
            g.appendChild(line)
        } else if (c2.type === 'Q') {
            const path = document.createElementNS(svgNS, 'path')
            path.setAttribute('id', i+1)
            path.setAttribute('d', `M${c1.x} ${c1.y}Q${c2.x1} ${c2.y1} ${c2.x} ${c2.y}`);
            path.setAttribute('stroke-width', 20)
            path.addEventListener('mouseenter', () => {
                path.setAttribute('stroke', 'red')
            })
            path.addEventListener('mouseleave', () => {
                path.setAttribute('stroke', 'black')
            })
            path.addEventListener('click', (e) => {
                console.log(path)
                console.log(glyph.path.commands)
                const id = e.target.id
                const command = glyph.path.commands[id]
                glyph.path.commands[id] = {
                    type: 'L',
                    x: command.x,
                    y: command.y,
                }
                glyph.path = glyph.path
                renderGlyph(glyph)
            })
            g.appendChild(path)
        }
    }
}

loadFont('/fonts/KaTeX_Size1-Regular.ttf').then((font) => {
    console.log(font)
    const index = font.glyphNames.nameToGlyphIndex(glyphName)
    const radical = font.glyphs.glyphs[index]
    renderGlyph(radical)
})
