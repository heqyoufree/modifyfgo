'use strict'
var setting = require('./setting.json')
// USER SETTING
// user setting path
const profile = setting.profile
// Proxy Port
const proxyPort = setting.proxyPort
// Web UI
const webInterface = setting.webInterface
// Web Port
const webInterfacePort = setting.webInterfacePort
// show anyproxy log in console
const silent = setting.silent
// keyword of update user setting
const updateKeyword = setting.updateKeyword
module.exports = {
  profile: profile,
  proxyPort: proxyPort,
  webInterface: webInterface,
  webInterfacePort: webInterfacePort,
  silent: silent,
  updateKeyword: updateKeyword
}
