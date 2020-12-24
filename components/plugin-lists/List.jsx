'use strict'

const { React, i18n: { Messages }, contextMenu: { openContextMenu } }  = require('@vizality/webpack')
const { Switch, Icon } = require('@vizality/components')
const { open: openModal } = require('@vizality/modal')

const BDPluginSettingsModal = require('../modals/BDPluginSettings.jsx')
const BDPluginContextMenu = require('../context-menus/Plugins.jsx')

module.exports = class Plugin extends React.Component {
  render () {
    this.pluginStatus = window.pluginModule.isEnabled(this.props.plugin.getName())

    console.log(openModal)

    // We're reusing vizality's classes
    return (
      <div className='vz-addon-card vzbdc-horizontal vzbdc-plugin'
        onContextMenu={e => openContextMenu(e, () => <BDPluginContextMenu
          plugin={this.props.plugin}
          meta={this.props.meta}
           />
          )}
        >
        <div className='vzbdc-center vz-addon-card-content-wrapper'>
          <div className="vz-addon-card-metadata">
            <div className="vz-addon-card-name-version">
              <h4 className='vz-addon-card-name'>
                {this.props.plugin.getName()}
              </h4>
              <span className="vz-addon-card-version vzbdc-plugin-version">
                {this.props.plugin.getVersion()}
              </span>
            </div>
            <div className="vz-addon-card-author">
              {this.props.plugin.getAuthor()}
            </div>
          </div>
        </div>

        <div className="vzbdc-horizontal">
          {typeof this.props.plugin.getSettingsPanel === 'function' && this.pluginStatus &&

            <Icon name='Gear'
              className="vzbdc-cursor-pointer vzbdc-little-space"
              tooltip={Messages.BDCOMPAT_SETTINGS.settings_button}
              onClick={(e) => {
                  e.stopPropagation(); //Fix issue where the modal opens 2 times
                  openModal(() => <BDPluginSettingsModal plugin={this.props.plugin} />)
                }
              }
            >
            </Icon>
          }

          <div className="vzbdc-little-space">
            <Switch value={this.pluginStatus}
              onChange={() => this.togglePlugin()}
              onClick={() => this.forceUpdate()}
            />
          </div>
        </div>
      </div>
    )
  }

  togglePlugin () {
    if (this.pluginStatus) {
      this.props.onDisable()
      
    } else {
      this.props.onEnable()
    }
    this.forceUpdate()
  }
}
