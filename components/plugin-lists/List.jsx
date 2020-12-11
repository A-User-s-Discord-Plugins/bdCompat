'use strict'

const { shell: { openExternal } } = require('electron')

const { React, i18n: { Messages } }  = require('@vizality/webpack')
const { Switch, Button, Icon, Anchor} = require('@vizality/components')
const { open: openModal } = require('@vizality/modal')

const BDPluginSettingsModal = require('../modals/BDPluginSettings.jsx')

// let Details = () => <div>Failed to load vizality module manager's details component!</div>
// try {
//   Details = require('../../pc-moduleManager/components/parts/Details')
// } catch (e) {
//   console.error('Failed to load vizality module manager\'s details component! Settings won\'t render correctly.', e)
// }

module.exports = class Plugin extends React.Component {
  render () {
    this.pluginStatus = window.pluginModule.isEnabled(this.props.plugin.getName())

    // We're reusing vizality's classes
    return (
      <div className='vz-addon-card vzbdcompat-horizontal vzbdcompat-plugin'>
        <div className='vzbdcompat-center vz-addon-card-content-wrapper'>
          <div className="vz-addon-card-metadata">
            <div className="vz-addon-card-name-version">
              <h4 className='vz-addon-card-name'>
                {this.props.plugin.getName()}
              </h4>
              <span className="vz-addon-card-version vzbdcompat-plugin-version">
                {this.props.plugin.getVersion()}
              </span>
              {this.props.meta.source &&
                <Anchor className="vzbdcompat-link" onClick={() => openExternal(this.props.meta.source)}>
                  {Messages.BDCOMAPT_PLUGIN.plugin_links.source_code}
                </Anchor>
              }

              {this.props.meta.website &&
                <Anchor className="vzbdcompat-link" onClick={() => openExternal(this.props.meta.website)}>
                  {Messages.BDCOMAPT_PLUGIN.plugin_links.website}
                </Anchor>
              }
            </div>
            <div className="vz-addon-card-author">
              {this.props.plugin.getAuthor()}
            </div>
          </div>
        </div>

        <div className="vzbdcompat-horizontal">
          <Icon name='Trash'
            tooltip="Delete"
            color="#f04747"
            className="vzbdcompat-cursor-pointer"
            onClick={() => window.BdApi.showConfirmationModal(
              'Delete Plugin',
              `Are you sure you want to delete **${this.props.plugin.getName()}**? This can't be undone!`,
              { confirmText: 'Delete', danger: true, onConfirm: this.props.onDelete }
            )}
          />

          {typeof this.props.plugin.getSettingsPanel === 'function' && this.pluginStatus &&

            <Icon name='Gear'
              className="vzbdcompat-cursor-pointer vzbdcompat-little-space"
              tooltip="Settings"
              onClick={() => openModal(() => <BDPluginSettingsModal plugin={this.props.plugin} />)}
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
