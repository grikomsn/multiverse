const fs = require('fs')

fs.openSync('./out/.nojekyll', 'w')
fs.writeFile('./out/CNAME', 'griko.id')
