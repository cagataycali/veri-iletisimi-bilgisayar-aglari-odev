var pid = process && process.pid ? process.pid.toString(36) : ''
var address = ''
if (typeof __webpack_require__ !== 'function') {
    var mac = ''; var networkInterfaces = require('os').networkInterfaces()
    for (interface_key in networkInterfaces) {
        const networkInterface = networkInterfaces[interface_key]
        const length = networkInterface.length
        for (var i = 0; i < length; i++) {
            if (networkInterface[i].mac && networkInterface[i].mac != '00:00:00:00:00:00') {
                mac = networkInterface[i].mac; break
            }
        }
    }
    address = mac ? parseInt(mac.replace(/\:|\D+/gi, '')).toString(36) : ''
}

//  Exports
// ================================================
module.exports = module.exports.default = function (prefix) { return (prefix || '') + address + pid + now().toString(36) }
module.exports.process = function (prefix) { return (prefix || '') + pid + now().toString(36) }
module.exports.time = function (prefix) { return (prefix || '') + now().toString(36) }

//  Helpers
// ================================================
function now() {
    var time = Date.now()
    var last = now.last || time
    return now.last = time > last ? time : last + 1
}
