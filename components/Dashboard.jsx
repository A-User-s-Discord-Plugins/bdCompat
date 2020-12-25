'use strict'

const { React, i18n: { Messages }, getModuleByDisplayName } = require('@vizality/webpack')
const { FormNotice, Anchor, Button, SearchBar, Icon } = require('@vizality/components')
const { open: openModal } = require('@vizality/modal')
const { shell } = require('electron')

const SettingsModal = require('./modals/PluginSettingsModal.jsx')
const ListPlugin = require('./plugin-lists/List.jsx')
const CardPlugin = require('./plugin-lists/Card.jsx')

const Image = getModuleByDisplayName("Image")

module.exports = class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      search: '',
    }
  }

  render () {
    const { getSetting } = this.props;
    const plugins = this.__getPlugins()
    
    return (
      <div>
        <FormNotice
          imageData={{
            width: 60,
            height: 60,
            src: '/assets/0694f38cb0b10cc3b5b89366a0893768.svg'
          }}
          type={FormNotice.Types.WARNING}
          title={Messages.BDCOMAPT_INDEV_NOTICE.title}
          body={<div>{Messages.BDCOMAPT_INDEV_NOTICE.description} <Anchor href="https://github.com/A-User-s-Discord-Plugins/bdCompat#faq">{Messages.BDCOMAPT_INDEV_NOTICE.openFAQ}</Anchor></div>}
        /><br></br><br></br>

        <div className="vz-addons-list-sticky-bar-wrapper">
          <div className="vz-addons-list-sticky-bar vzbdc-aligment-fix">
            <Icon name='Gear'
              className="vzbdc-cursor-pointer"
              style={{ display: "flex", justifyContent: "center" }}
              onClick={(e) => {
                e.stopPropagation();
                openModal(() => <SettingsModal stuff={this.props} />)
              }}
              tooltip={Messages.BDCOMPAT_SETTINGS.settings_button}
            />
            
            <div className="vz-addons-list-search-options">
              <SearchBar
                placeholder={Messages.BDCOMAPT_PLUGIN_SEARCH.title}
                query={this.state.search}
                onChange={(val) => this.setState({ search: val })}
              />
              <div className="vzbdc-little-space">
                <Icon name='Folder'
                  onClick={() => {
                    shell.openPath(window.ContentManager.pluginsFolder)
                  }}
                  className="vzbdc-cursor-pointer"
                  tooltip={Messages.BDCOMAPT_OPEN_PLUGINS_FOLDER}
                />
              </div>
            </div>
          </div>
        </div>
        <br />

        <div className='vizality-entities-manage-items'>
          {
            //es6 goes brrrrrrrrrrrrr
            getSetting('showMethod', "Card") == "List"
              ?
              //here it'll render the setting if showMethod is setted to List
              <div className="vz-addons-list" vz-display="compact">
                {
                  plugins.map((plugin) =>
                    <ListPlugin
                      plugin={plugin.plugin}
                      meta={plugin}

                      onEnable={() => window.pluginModule.enablePlugin(plugin.plugin.getName())}
                      onDisable={() => window.pluginModule.disablePlugin(plugin.plugin.getName())}
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

                      onEnable={() => window.pluginModule.enablePlugin(plugin.plugin.getName())}
                      onDisable={() => window.pluginModule.disablePlugin(plugin.plugin.getName())}
                      onDelete={() => this.__deletePlugin(plugin.plugin.getName())}
                    />
                  )
                }
              </div>
          }

        </div>
        <div className="description-3_Ncsb vzbdc-horizontal vzbdc-thanks">
          Ported with <Image width={25} height={25} src="/assets/0483f2b648dcc986d01385062052ae1c.svg" zoomable={false} /> by A user</div>
      </div>
    )
  }
  
  __getPlugins() {
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