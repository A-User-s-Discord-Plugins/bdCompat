'use strict'
const { shell } = require('electron')

const { React, contextMenu: { closeContextMenu }, i18n: { Messages } } = require('@vizality/webpack');
const { ContextMenu } = require('@vizality/components');
const { open: openModal } = require('@vizality/modal')

const BDPluginSettingsModal = require('../modals/BDPluginSettings.jsx')

module.exports = class PluginContextMenu extends React.Component{
    render(){
        this.pluginStatus = window.pluginModule.isEnabled(this.props.plugin.getName())

        return( 
            <ContextMenu onClose={closeContextMenu}>
                {this.props.meta.source &&
                    <ContextMenu.Item
                        id='source-code'
                        label={Messages.BDCOMAPT_PLUGIN.plugin_links.source_code}
                        action={() => { shell.openExternal(this.props.meta.source)}}
                    />
                }
                {this.props.meta.website &&
                    <ContextMenu.Item
                        id='website'
                        label={Messages.BDCOMAPT_PLUGIN.plugin_links.website}
                        action={() => { shell.openExternal(this.props.meta.website) }}
                    />
                }
                
                <ContextMenu.Separator />

                <ContextMenu.Item
                    id='toggle'
                    label={this.pluginStatus ? "Disable" : "Enable"}
                    action={() => {
                        if (this.pluginStatus) {
                            window.pluginModule.disablePlugin(this.props.plugin.getName())
                        } else {
                            window.pluginModule.enablePlugin(this.props.plugin.getName())
                        }
                        vizality.api.router.navigate(`/vizality/dashboard/plugins/bdCompat`);
                    }}
                />
                {typeof this.props.plugin.getSettingsPanel === 'function' && this.pluginStatus &&
                    <ContextMenu.Item
                        id='settings'
                        label={Messages.BDCOMPAT_SETTINGS.settings_button}
                        action={(e) => {
                            e.stopPropagation(); //Fix issue where the modal opens 2 times
                            openModal(() => <BDPluginSettingsModal plugin={this.props.plugin} />)
                        }}
                    />
                }
                <ContextMenu.Item
                    id='uninstall'
                    label={Messages.APPLICATION_CONTEXT_MENU_UNINSTALL}
                    color='colorDanger'
                    action={(e) => {
                        e.stopPropagation(); //Fix issue where the modal opens 2 times
                        window.BdApi.showConfirmationModal(
                            'Delete Plugin',
                            `Are you sure you want to delete **${this.props.plugin.getName()}**? This can't be undone!`,
                            { confirmText: 'Delete', danger: true, onConfirm: this.props.onDelete }
                        )
                    }}
                />
                {/* <Menu.MenuItem
                    id='open-in-file-manager'
                    label='Open in file manager'
                    action={() => {
                        shell.showItemInFolder(`../../plugins/${this.props.plugin.getName()}.plugin.js`)
                    }}
                /> */}
            </ContextMenu>
        )
    }
}