'use strict'

const { shell: { openPath } } = require('electron')

const { React } = require('@vizality/webpack')
const { Button, Divider } = require('@vizality/components')
const { TextInput } = require('@vizality/components/settings')

const Plugin = require('./Plugin.jsx')

module.exports = class PluginList extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {
      search: '',
    }
  }
  render () {
    const plugins = this.__getPlugins()

    return (
      <div className='vizality-entities-manage vizality-text'>
        <div className='vizality-entities-manage-header vzbdcompat-search-open-plugins-folder'>
          <TextInput
            value={this.state.search}
            onChange={(val) => this.setState({ search: val })}
            placeholder='What are you looking for?'
          >
            Search plugins
          </TextInput>
          <Button
            onClick={() => openPath(window.ContentManager.pluginsFolder)}
            size={Button.Sizes.SMALL}
            color={Button.Colors.PRIMARY}
            look={Button.Looks.OUTLINED}
          >
            Open Plugins Folder
          </Button>
          <Divider />
          <h3 className="vzbdcompat-marginOnTop"><b>NOTE:</b> There is an wild issue where the switch doesn't update if you enable a plugin. So, after enabling a plugin, please exit from this settings page and then go back to it. <br></br><br></br>- A user</h3>
        </div>

        <div className='vizality-entities-manage-items'>
          {plugins.map((plugin) =>
            <Plugin
              plugin={plugin.plugin}
              meta={plugin}

              onEnable={() => this.props.pluginManager.enablePlugin(plugin.plugin.getName())}
              onDisable={() => this.props.pluginManager.disablePlugin(plugin.plugin.getName())}
              onDelete={() => this.__deletePlugin(plugin.plugin.getName())}
            />
          )}
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