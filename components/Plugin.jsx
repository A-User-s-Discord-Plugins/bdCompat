'use strict'

const { shell: { openExternal } } = require('electron')

const { React, i18n: { Messages } }  = require('@vizality/webpack')
const { Tooltip, Switch, Button, Card, Divider, Icon} = require('@vizality/components')
const { open: openModal } = require('@vizality/modal')

const SettingsModal = require('./PluginSettings.jsx')

let Details = () => <div>Failed to load vizality module manager's details component!</div>
// try {
//   Details = require('../../pc-moduleManager/components/parts/Details')
// } catch (e) {
//   console.error('Failed to load vizality module manager\'s details component! Settings won\'t render correctly.', e)
// }

module.exports = class Plugin extends React.Component {
  render () {
    this.props.enabled = this.props.meta.__started

    // We're reusing powercord's plugin manager classes
    return (
      <Card className='vz-addon-card powercord-product bdc-plugin vzbdcompat-card'>
        <div className='vzbdcompat-center vz-addon-card-content-wrapper powercord-product-header'>
          <h4 className='vzbdcompat-quickaligment'>{this.props.plugin.getName()}</h4>
          <div class='bdc-spacer'></div>
          <div className="vzbdcompat-horizontal">
            {this.props.meta.source &&
              <Button
                onClick={() => openExternal(this.props.meta.source)}
                look={Button.Looks.LINK}
                size={Button.Sizes.SMALL}
                color={Button.Colors.TRANSPARENT}
              >
                Source code
              </Button>
              }

            {this.props.meta.website &&
              <Button
                onClick={() => openExternal(this.props.meta.website)}
                look={Button.Looks.LINK}
                size={Button.Sizes.SMALL}
                color={Button.Colors.TRANSPARENT}
              >
                Website
              </Button>
              }
            </div>
        </div>
        <Divider />

        <div className="vzbdcompat-marginOnTop vzbdcompat-author">
             Author: {this.props.plugin.getAuthor()};<br></br>
             Version: {this.props.plugin.getVersion()};<br></br>
             Description: {this.props.plugin.getDescription()}
        </div>
        {/* <Details
          svgSize={24} license=''
          author={this.props.plugin.getAuthor()}
          version={this.props.plugin.getVersion()}
          description={this.props.plugin.getDescription()}
        /> */}

        <div class='bdc-spacer'></div>
        <Divider />

        <div className='vzbdcompat-marginOnTop vzbdcompat-horizontal powercord-plugin-footer powercord-product-footer bdc-justifystart'>
          <Button
            onClick={() => window.BdApi.showConfirmationModal(
              'Delete Plugin',
              `Are you sure you want to delete **${this.props.plugin.getName()}**? This can't be undone!`,
              { confirmText: 'Delete', danger: true, onConfirm: this.props.onDelete }
            )}
            color={Button.Colors.RED}
            look={Button.Looks.FILLED}
            size={Button.Sizes.SMALL}
          >
            {Messages.APPLICATION_CONTEXT_MENU_UNINSTALL}
          </Button>

          <div class='bdc-spacer'></div>
          {typeof this.props.plugin.getSettingsPanel === 'function' && this.props.enabled &&

            <Icon name='Gear'
              className="vzbdcompat-cursor-pointer"
              onClick={() => openModal(() => <SettingsModal plugin={this.props.plugin} />)}
              tooltip= "Settings"
            >
            </Icon>
          }
          {typeof this.props.plugin.getSettingsPanel === 'function' &&
            <div class='bdc-margin'></div>
          }

          <Switch value={this.props.enabled} onChange={() => this.togglePlugin()} />
        </div>
      </Card>
    )
  }

  togglePlugin () {
    if (this.props.enabled) {
      this.props.onDisable()
    } else {
      this.props.onEnable()
    }

    this.forceUpdate()
  }
}
