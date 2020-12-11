const { shell: { openExternal } } = require('electron')

const { React, i18n: { Messages } } = require('@vizality/webpack')
const { Tooltip, Switch, Button, Card, Divider, Icon } = require('@vizality/components')
const { open: openModal } = require('@vizality/modal')

const BDPluginSettingsModal = require('../modals/BDPluginSettings.jsx')

// let Details = () => <div>Failed to load vizality module manager's details component!</div>
// try {
//   Details = require('../../pc-moduleManager/components/parts/Details')
// } catch (e) {
//   console.error('Failed to load vizality module manager\'s details component! Settings won\'t render correctly.', e)
// }

module.exports = class Plugin extends React.Component {
    render() {
        this.pluginStatus = window.pluginModule.isEnabled(this.props.plugin.getName())

        // We're reusing vizality's classes
        return (
            <div className='vz-addon-card vzbdcompat-card'>
                <div className='vzbdcompat-center vz-addon-card-content-wrapper vzbdcompat-header'>
                    <div className="vz-addon-card-metadata">
                        <div className="vz-addon-card-name-version">
                            <h4 className='vz-addon-card-name'>
                                {this.props.plugin.getName()}
                            </h4>
                            <span className="vz-addon-card-version">
                                {this.props.plugin.getVersion()}
                            </span>
                        </div>
                        <div className="vz-addon-card-author">
                            {this.props.plugin.getAuthor()}
                        </div>
                    </div>

                    <div class='bdc-spacer'></div>
                    <div className="vzbdcompat-horizontal">
                        {this.props.meta.source &&
                            <Button
                                onClick={() => openExternal(this.props.meta.source)}
                                look={Button.Looks.LINK}
                                size={Button.Sizes.SMALL}
                                color={Button.Colors.TRANSPARENT}
                            >
                                {Messages.BDCOMAPT_PLUGIN.plugin_links.source_code}
                            </Button>
                        }

                        {this.props.meta.website &&
                            <Button
                                onClick={() => openExternal(this.props.meta.website)}
                                look={Button.Looks.LINK}
                                size={Button.Sizes.SMALL}
                                color={Button.Colors.TRANSPARENT}
                            >
                                {Messages.BDCOMAPT_PLUGIN.plugin_links.website}
                            </Button>
                        }
                    </div>
                </div>

                <div className="vzbdcompat-marginOnTop vzbdcompat-author">
                    {this.props.plugin.getDescription()}
                </div>

                <div class='bdc-spacer'></div>
                <Divider />

                <div className='vzbdcompat-marginOnTop vzbdcompat-horizontal powercord-plugin-footer powercord-product-footer bdc-justifystart'>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation(); //Fix issue where the modal opens 2 times
                            window.BdApi.showConfirmationModal(
                                'Delete Plugin',
                                `Are you sure you want to delete **${this.props.plugin.getName()}**? This can't be undone!`,
                                { confirmText: 'Delete', danger: true, onConfirm: this.props.onDelete }
                            )
                            }
                        }

                        color={Button.Colors.RED}
                        look={Button.Looks.FILLED}
                        size={Button.Sizes.SMALL}
                    >
                        {Messages.APPLICATION_CONTEXT_MENU_UNINSTALL}
                    </Button>

                    <div class='bdc-spacer'></div>
                    {typeof this.props.plugin.getSettingsPanel === 'function' && this.pluginStatus &&

                        <Icon name='Gear'
                            className="vzbdcompat-cursor-pointer"
                            onClick={(e) => {
                                    e.stopPropagation(); //Fix issue where the modal opens 2 times
                                    openModal(() => <BDPluginSettingsModal plugin={this.props.plugin} />)
                                }
                            }
                            tooltip="Settings"
                        >
                        </Icon>
                    }
                    {typeof this.props.plugin.getSettingsPanel === 'function' &&
                        <div class='bdc-margin'></div>
                    }

                    <Switch value={this.pluginStatus} onChange={() => this.togglePlugin()} onClick={() => this.forceUpdate()} />
                </div>
            </div>
        )
    }

    togglePlugin() {
        if (this.pluginStatus) {
            this.props.onDisable()

        } else {
            this.props.onEnable()
        }
        this.forceUpdate()
    }
}
