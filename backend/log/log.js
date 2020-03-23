const fs = require('fs')
const path = require('path')

const logStream  = fs.createWriteStream(path.join(__dirname, 'game.log'))

function appendLog(text) {
    logStream.write(text)
}
module.exports = {
    appendLog
}
