(function () {
  const {setImmediate} = require('timers')
  const {ipcRenderer} = require('electron')
  window.ipcRenderer = ipcRenderer
  window.setImmediate = setImmediate
  window.require = require
  if (location.protocol === 'file:') {
    window.test = 'preload'
    window.process = process
    if (process.env.sandboxmain) {
      window.test = {
        env: process.env,
        execPath: process.execPath,
        platform: process.platform
      }
    }
  } else if (location.href !== 'about:blank') {
    addEventListener('DOMContentLoaded', () => {
      ipcRenderer.on('touch-the-opener', () => {
        let errorMessage = null
        try {
          const openerDoc = opener.document // eslint-disable-line no-unused-vars
        } catch (error) {
          errorMessage = error.message
        }
        ipcRenderer.send('answer', errorMessage)
      })
      ipcRenderer.send('child-loaded', window.opener == null, document.body.innerHTML, location.href)
    }, false)
  }
})()
