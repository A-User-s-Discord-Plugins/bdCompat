'use strict'

const { shell: { openPath } } = require('electron')

const { React, i18n: { Messages } } = require('@vizality/webpack')
const { Button, Divider } = require('@vizality/components')
const { TextInput } = require('@vizality/components/settings')

const ListPlugin = require('./plugin-lists/List.jsx')
const CardPlugin = require('./plugin-lists/Card.jsx')

module.exports = class PluginList extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {
      search: '',
    }
  }
  render () {
    const plugins = this.__getPlugins()
    const settingManager = this.props.settings

    return (
      <div className='vizality-entities-manage vizality-text'>
        <div className='vizality-entities-manage-header vzbdcompat-search-open-plugins-folder'>
          <TextInput
            value={this.state.search}
            onChange={(val) => this.setState({ search: val })}
            placeholder={Messages.BDCOMAPT_PLUGIN_SEARCH.placeholder}
          >
            {Messages.BDCOMAPT_PLUGIN_SEARCH.title}
          </TextInput>
        </div>

        <div className='vizality-entities-manage-items'>
          {
            //es6 goes brrrrrrrrrrrrr
            settingManager.getSetting('showMethod', "Card") == "List"
            ?
              //here it'll render the setting if showMethod is setted to List
              <div className="vz-addons-list" vz-display="compact">
                {
                  plugins.map((plugin) =>
                    <ListPlugin
                      plugin={plugin.plugin}
                      meta={plugin}

                      onEnable={() => this.props.pluginManager.enablePlugin(plugin.plugin.getName())}
                      onDisable={() => this.props.pluginManager.disablePlugin(plugin.plugin.getName())}
                      onDelete={() => this.__deletePlugin(plugin.plugin.getName())}
                    />
                  )
                }
              </div>
            : 
              //here it'll render the setting if showMethod is setted to Card
              <div className="vz-addons-list-items">
                {
                  plugins.map((plugin) =>
                    <CardPlugin
                      plugin={plugin.plugin}
                      meta={plugin}

                      onEnable={() => this.props.pluginManager.enablePlugin(plugin.plugin.getName())}
                      onDisable={() => this.props.pluginManager.disablePlugin(plugin.plugin.getName())}
                      onDelete={() => this.__deletePlugin(plugin.plugin.getName())}
                    />
                  )
                }
              </div>
          }
          
        </div>
      </div>
    )
  }

  __getPlugins () {
    let plugins = Object.keys(window.bdplugins)
      .map((plugin) => window.bdplugins[plugin])

    if (this.state.search !== '') {
      const search = this.state.search.toLowerCase()

      plugins = plugins.filter(({ plugin }) =>
        plugin.getName().toLowerCase().includes(search) ||
        plugin.getAuthor().toLowerCase().includes(search) ||
        plugin.getDescription().toLowerCase().includes(search)
      )
    }

    return plugins.sort((a, b) => {
      const nameA = a.plugin.getName().toLowerCase()
      const nameB = b.plugin.getName().toLowerCase()

      if (nameA < nameB) return -1
      if (nameA > nameB) return 1

      return 0
    })
  }

  __deletePlugin(pluginName) {
    this.props.pluginManager.delete(pluginName)

    this.forceUpdate()
  }
}