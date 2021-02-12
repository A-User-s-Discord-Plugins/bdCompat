import path from 'path'
import fs from 'fs'
import { webFrame } from 'electron'
import { Module } from 'module'
import { getModule, FluxDispatcher } from '@vizality/webpack'
import { watch } from 'chokidar'

// Allow loading from discords node_modules
Module.globalPaths.push(path.join(process.resourcesPath, 'app.asar/node_modules'))

module.exports = class BDPluginManager {
  constructor(pluginsFolder, settings) {
    this.folder   = pluginsFolder
    this.settings = settings

    FluxDispatcher.subscribe('CHANNEL_SELECT', this.channelSwitch = () => this.fireEvent('onSwitch'))

    this.observer = new MutationObserver((mutations) => {
        for (let i = 0, mlen = mutations.length; i < mlen; i++) this.fireEvent('observer', mutations[i])
    })
    this.observer.observe(document, { childList: true, subtree: true })

    // Wait for jQuery, then load the plugins
    window.BdApi.linkJS('jquery', '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js')
      .then(async () => {
        this.__log('Loaded jQuery')


        if (!window.jQuery) {
          Object.defineProperty(window, 'jQuery', {
            get: () => webFrame.top.context.window.jQuery
          })
          window.$ = window.jQuery
        }

        const ConnectionStore = await getModule('isTryingToConnect', 'isConnected')
        const listener = () => {
          if (!ConnectionStore.isConnected()) return
          ConnectionStore.removeChangeListener(listener)
          this.__log('Loading plugins..')
          this.loadAllPlugins()
          this.startAllEnabledPlugins()
          this.watchPluginFiles();
        }
        if (ConnectionStore.isConnected()) listener()
        else ConnectionStore.addChangeListener(listener)
      })
  }

  getPlugin (pluginName) {
    return window.bdplugins[pluginName] || Object.values(bdplugins).find(e => e.id === pluginName);
  }

  watchPluginFiles () {
    if (this.watcher) return;
    this.watcher = watch(this.folder, {persistent: true});
    this.watcher
    .on('add', (filepath, stats) => {
      if (!stats.isFile() || !filepath.endsWith('.plugin.js')) return;
      const filename = path.basename(filepath);
      const pluginName = path.basename(filepath).slice(0, filename.indexOf('.plugin.js'));
      if (this.getPlugin(pluginName)) return;
      this.loadPlugin(pluginName);
    })
    .on('change', (filepath, stats) => {
      if (!stats.isFile() || !filepath.endsWith('.plugin.js')) return;
      const filename = path.basename(filepath);
      const pluginName = path.basename(filepath).slice(0, filename.indexOf('.plugin.js'));
      if (this.getPlugin(pluginName)) this.reloadPlugin(pluginName);
      else this.loadPlugin(pluginName);
    })
    .on('unlink', filepath => {
      if (!filepath.endsWith('.plugin.js')) return;
      const filename = path.basename(filepath);
      const pluginName = path.basename(filepath).slice(0, filename.indexOf('.plugin.js'));
      this.unloadPlugin(pluginName);
    });
  }

  unwatchFiles () {
    if (this.watcher) this.watcher.close();
  }

  destroy () {
    window.BdApi.unlinkJS('jquery')
    if (this.channelSwitch) FluxDispatcher.unsubscribe('CHANNEL_SELECT', this.channelSwitch)

    this.observer.disconnect()
    this.stopAllPlugins()
    this.unwatchFiles();
  }


  startAllEnabledPlugins () {
    const plugins = Object.keys(window.bdplugins)

    plugins.forEach((pluginName) => {
      if (window.BdApi.loadData('BDCompat-EnabledPlugins', pluginName) === true) this.startPlugin(pluginName)
    })
  }

  stopAllPlugins () {
    const plugins = Object.keys(window.bdplugins)

    plugins.forEach((pluginName) => {
      this.stopPlugin(pluginName)
    })
  }


  isEnabled (pluginName) {
    return window.BdApi.loadData('BDCompat-EnabledPlugins', pluginName);
  }

  startPlugin (pluginName) {
    const plugin = this.getPlugin(pluginName);
    if (!plugin) return this.__error(null, `Tried to start a missing plugin: ${pluginName}`)

    if (plugin.__started) return

    try {
      plugin.plugin.start()
      plugin.__started = true
      this.__log(`Started plugin ${plugin.plugin.getName()}`)
    } catch (err) {
      this.__error(err, `Could not start ${plugin.plugin.getName()}`)
      window.BdApi.saveData('BDCompat-EnabledPlugins', plugin.plugin.getName(), false)
    }
  }
  stopPlugin (pluginName) {
    const plugin = this.getPlugin(pluginName);
    if (!plugin) return this.__error(null, `Tried to stop a missing plugin: ${pluginName}`)

    if (!plugin.__started) return

    try {
      plugin.plugin.stop()
      plugin.__started = false
      this.__log(`Stopped plugin ${plugin.plugin.getName()}`)
    } catch (err) {
      this.__error(err, `Could not stop ${plugin.plugin.getName()}`)
      if (this.settings.get('disableWhenStopFailed'))
        window.BdApi.saveData('BDCompat-EnabledPlugins', plugin.plugin.getName(), false)
    }
  }

  clearCache(pluginName) {
    const plugin = this.getPlugin(pluginName);
    if (!plugin) return this.__error(null, `Treid to clean cache for missing plugin: ${pluginName}`);
    delete window.bdplugins[plugin.plugin.getName()];
    delete require.cache[plugin.__filePath];
    return true; // for later
  }

  reloadPlugin (pluginName) {
    const plugin = this.getPlugin(pluginName);
    if (!plugin) return this.__error(null, `Tried to reload a missing plugin: ${pluginName}`)

    this.stopPlugin(pluginName)

    this.clearCache(pluginName);

    this.loadPlugin(pluginName, true);
    if (this.isEnabled(pluginName)) this.startPlugin(pluginName);

    this.__log(`Reloaded ${pluginName}`);
    window.BdApi.showToast(`${pluginName} has been reloaded.`, {type: 'success'});
  }

  enablePlugin (pluginName) {
    const plugin = window.bdplugins[pluginName]
    if (!plugin) return this.__error(null, `Tried to enable a missing plugin: ${pluginName}`)

    window.BdApi.saveData('BDCompat-EnabledPlugins', plugin.plugin.getName(), true)
    this.startPlugin(pluginName)
  }
  disablePlugin (pluginName) {
    const plugin = window.bdplugins[pluginName]
    if (!plugin) return this.__error(null, `Tried to disable a missing plugin: ${pluginName}`)

    window.BdApi.saveData('BDCompat-EnabledPlugins', plugin.plugin.getName(), false)
    this.stopPlugin(pluginName)
  }

  unloadPlugin (pluginName) {
    const plugin = this.getPlugin(pluginName);
    if (!plugin) return this.__error(null, `Tried to unload a missing plugin: ${pluginName}`);
    this.stopPlugin(pluginName);
    this.clearCache(pluginName);
  }

  loadAllPlugins() {
    if (!fs.existsSync(this.folder)) return;
    const plugins = fs.readdirSync(this.folder)
      .filter((pluginFile) => pluginFile.endsWith('.plugin.js'))
      .map((pluginFile) => pluginFile.slice(0, -('.plugin.js'.length)))

    plugins.map((pluginName) => this.loadPlugin(pluginName));
  }

  loadPlugin(pluginName, isReload = false) {
    const pluginPath = path.join(this.folder, `${pluginName}.plugin.js`)
    if (!fs.existsSync(pluginPath)) return this.__error(null, `Tried to load a nonexistant plugin: ${pluginName}`)

    try {
      // eslint-disable-next-line global-require
      const meta = require(pluginPath)
      try {
        const plugin = new meta.type
        if (window.bdplugins[plugin.getName()]) window.bdplugins[plugin.getName()].plugin.stop()
        delete window.bdplugins[plugin.getName()]
        window.bdplugins[plugin.getName()] = { id: pluginName, plugin, __filePath: pluginPath, ...meta }

        if (plugin.load && typeof plugin.load === 'function')
          try {
            plugin.load()
          } catch (err) {
            this.__error(err, `Failed to preload ${plugin.getName()}`)
          }

        if (!isReload) this.__log(`Loaded ${plugin.getName()} v${plugin.getVersion()} by ${plugin.getAuthor()}`);
      } catch (e) {
        this.__error(e, meta)
      }
    } catch (e) {
      this.__error(`Failed to compile ${pluginName}:`, e)
    }
  }

  delete(pluginName) {
    const plugin = window.bdplugins[pluginName]
    if (!plugin) return this.__error(null, `Tried to delete a missing plugin: ${pluginName}`)

    this.disablePlugin(pluginName)
    if (typeof plugin.plugin.unload === 'function') plugin.plugin.unload()
    delete window.bdplugins[pluginName]

    fs.unlinkSync(plugin.__filePath)
  }

  fireEvent (event, ...args) {
    for (const plug in window.bdplugins) {
      const p = window.bdplugins[plug], { plugin } = p
      if (!p.__started || !plugin[event] || typeof plugin[event] !== 'function') continue

      try {
        plugin[event](...args)
      } catch (err) {
        this.__error(err, `Could not fire ${event} event for ${plugin.name}`)
      }
    }
  }

  disable = this.disablePlugin
  enable  = this.enablePlugin
  reload  = this.reloadPlugin
  

  __log (...message) {
    console.log('%c[BDCompat:BDPluginManager]', 'color: #3a71c1;', ...message)
  }

  __warn (...message) {
    console.warn('%c[BDCompat:BDPluginManager]', 'color: #e8a400;', ...message)
  }

  __error (error, ...message) {
    console.error('%c[BDCompat:BDPluginManager]', 'color: red;', ...message)

    if (error) {
      console.groupCollapsed(`%cError: ${error.message}`, 'color: red;')
      console.error(error.stack)
      console.groupEnd()
    }
  }
}
