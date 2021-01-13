'use strict'

const { Plugin } = require('@vizality/entities')
const i18n = require('./i18n');
const process = require('process')
const { AddonAPI, BDApi, BDV2, ContentManager, PluginManager } = require('./modules')
const Dashboard = require('./components/Dashboard')

module.exports = class BDCompat extends Plugin {
  start () {
    //Inject CSS
    this.injectStyles('./styles/bdc-original-styles.css')
    this.injectStyles('./styles/bd-toasts.css')
    this.injectStyles('./styles/vzbdc-styles.css')

    // Inject i18n
    vizality.api.i18n.injectAllStrings(i18n);

    //Inject dashboard
    this.registerSettings(Dashboard)

    // Check if hot reload is enabled and if it is it'll alert the user
    if (vizality.settings.get('hotReload', false)){
      vizality.api.notices.sendToast('bdcompat-hot-reload-warning', {
        header: "Hot-reload issues",
        content: "Please disable hot reload. bdCompat has perfomance issues with Vizality's hot reload feature and having this enabled can cause Discord to freeze.",
        timeout: 16e3,
        buttons: [{
          text: "Gonna do later",
          color: 'grey',
          onClick: () => {
            vizality.api.notices.closeToast('bdcompat-hot-reload-warning');
          }
        }, {
          text: "Go to settings",
          color: 'green',
          onClick: () => {
            vizality.api.notices.closeToast('bdcompat-hot-reload-warning');
            vizality.api.router.navigate('settings');
          }
        }]
      });
    }

    // Inject BD API stuff
    this.defineGlobals()
  }

  stop () {
    vizality.api.settings.unregisterSettings(this.addonId) 
    if (window.pluginModule) window.pluginModule.destroy()
    if (window.ContentManager) window.ContentManager.destroy()
    this.destroyGlobals()
  }

  defineGlobals () {
    window.bdConfig = { dataPath: __dirname }
    window.settingsCookie = {}

    window.bdplugins = {}
    window.pluginCookie = {}
    window.bdpluginErrors = []

    window.bdthemes = {}
    window.themeCookie = {}
    window.bdthemeErrors = []

    // window.BdApi = BDApi

    // Orignally BdApi is an object, not a class
    window.BdApi = {}
    Object.getOwnPropertyNames(BDApi).filter(m => typeof BDApi[m] == 'function' || typeof BDApi[m] == 'object').forEach(m => {
      window.BdApi[m] = BDApi[m]
    })
    window.Utils = { monkeyPatch: BDApi.monkeyPatch, suppressErrors: BDApi.suppressErrors, escapeID: BDApi.escapeID }

    window.BDV2 = BDV2
    window.ContentManager = new ContentManager
    window.pluginModule   = new PluginManager(window.ContentManager.pluginsFolder, this.settings)

    // DevilBro's plugins checks whether or not it's running on ED
    // This isn't BetterDiscord, so we'd be better off doing this.
    // eslint-disable-next-line no-process-env
    process.env.injDir = __dirname

    window.BdApi.Plugins = new AddonAPI(window.bdplugins, window.pluginModule)
    window.BdApi.Themes  = new AddonAPI({}, {})

    this.log('Defined BetterDiscord globals')
  }

  destroyGlobals () {
    const globals = ['bdConfig', 'settingsCookie', 'bdplugins', 'pluginCookie', 'bdpluginErrors', 'bdthemes',
      'themeCookie', 'bdthemeErrors', 'BdApi', 'Utils', 'BDV2', 'ContentManager', 'pluginModule']

    globals.forEach(g => {
      delete window[g]
    })

    // eslint-disable-next-line no-process-env
    delete process.env.injDir

    this.log('Destroyed BetterDiscord globals')
  }
}
