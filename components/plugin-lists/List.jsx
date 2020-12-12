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
      <div className='vz-addon-card vzbdcompat-horizontal vzbdcompat-plugin'
        onContextMenu={e => openContextMenu(e, () => <BDPluginContextMenu
          plugin={this.props.plugin}
          meta={this.props.meta}
           />
          )}
        >
        <div className='vzbdcompat-center vz-addon-card-content-wrapper'>
          <div className="vz-addon-card-metadata">
            <div className="vz-addon-card-name-version">
              <h4 className='vz-addon-card-name'>
                {this.props.plugin.getName()}
              </h4>
              <span className="vz-addon-card-version vzbdcompat-plugin-version">
                {this.props.plugin.getVersion()}
              </span>
            </div>
            <div className="vz-addon-card-author">
              {this.props.plugin.getAuthor()}
            </div>
          </div>
        </div>

        <div className="vzbdcompat-horizontal">
          {/* <Icon name='Trash'
            tooltip="Delete"
            color="#f04747"
            className="vzbdcompat-cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); //Fix issue where the modal opens 2 times
              window.BdApi.showConfirmationModal(
                'Delete Plugin',
                `Are you sure you want to delete **${this.props.plugin.getName()}**? This can't be undone!`,
                { confirmText: 'Delete', danger: true, onConfirm: this.props.onDelete }
              )
            }
            }
          /> */}

          {typeof this.props.plugin.getSettingsPanel === 'function' && this.pluginStatus &&

            <Icon name='Gear'
              className="vzbdcompat-cursor-pointer vzbdcompat-little-space"
              tooltip={Messages.BDCOMPAT_SETTINGS.settings_button}
              onClick={(e) => {
                  e.stopPropagation(); //Fix issue where the modal opens 2 times
                  openModal(() => <BDPluginSettingsModal plugin={this.props.plugin} />)
                }
              }
            >
            </Icon>
          }

          <div className="vzbdcompat-little-space">
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
