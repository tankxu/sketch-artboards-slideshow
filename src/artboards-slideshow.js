import * as util from './sketch-utils'
import createSlide from './create-slide'
const userHome = require("os").homedir()
const sketch = require('sketch')

export default function(context) {
    // get sketch document
    const document = sketch.getSelectedDocument()
    const selection = document.selectedLayers
    let pageName = document.selectedPage.name
    
    let artboards = []
    let artboardIds = []

    // export options
    const options = {
        scales: '2',
        formats: 'png',
        output: `${userHome}/Downloads/${pageName}-Slideshow`,
        overwriting: true
    }


    // if no artboard selected
    if (selection.length === 0) {
        context.document.showMessage('⚠️ Please select at least one artboard or layer.');
        return;
    }

    if (selection.length >= 1) {
        artboards = selection.layers.map(layer => {
                // get parent Artboard if layer is not an artboard
                if (layer.getParentArtboard() !== undefined) {
                    layer = layer.getParentArtboard()
                }
                // return special artboard object
                if (layer.type === 'Artboard') {
                    return {
                        name: encodeURIComponent(layer.name),
                        id: layer.id,
                        backgroundColor: layer.background.color,
                        bounds: layer.frame,
                        object: layer
                    }
                }
            })
            .filter(artboard => {
                if (artboardIds.indexOf(artboard.id) > -1) {
                    return false
                }
                return artboardIds.push(artboard.id)
            })

        context.document.showMessage(`Creating preview for ${artboards.length} artboards.`)

        let slideFile = createSlide(artboards, options, pageName)
        // open export in browser
        util.runCommand('/usr/bin/open', [slideFile])
        return;
    }
}
