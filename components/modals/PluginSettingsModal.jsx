const { i18n: { Messages }, React, getModuleByDisplayName } = require('@vizality/webpack')
const { close: closeModal } = require('@vizality/modal')
const { settings: { SwitchItem, RadioGroup }, Modal } = require('@vizality/components')

const FormTitle = getModuleByDisplayName('FormTitle', false)

// let config = vizality.manager.plugins.get('bdCompat').settings

module.exports = class PluginSettings extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<>
            <Modal size={Modal.Sizes.LARGE}>
                <Modal.Header>
                    <FormTitle tag={FormTitle.Tags.H4}>{Messages.BDCOMPAT_SETTINGS.title}</FormTitle>
                    <Modal.CloseButton onClick={closeModal} />
                </Modal.Header>
                <Modal.Content>
                    
                    <SwitchItem
                        value={this.props.stuff.getSetting('disableWhenStopFailed', true)}
                        onChange={() => {
                            this.props.stuff.toggleSetting('disableWhenStopFailed')
                            this.forceUpdate()
                        }}>
                        {Messages.BDCOMPAT_SETTINGS.disable_plugin_failed_stop}
                    </SwitchItem>

                    <RadioGroup
                        options={[
                            { name: Messages.BDCOMPAT_SETTINGS.display_method.list, value: "List"},
                            { name: Messages.BDCOMPAT_SETTINGS.display_method.card, value: "Card"}
                        ]}
                        value={this.props.stuff.getSetting('showMethod', "Card")}
                        onChange={e => {
                            this.props.stuff.updateSetting('showMethod', e.value)
                            this.forceUpdate();
                        }}
                    > {Messages.BDCOMPAT_SETTINGS.display_method.title} </RadioGroup>
                </Modal.Content>
            </Modal>
        </>)
    }

    getConfig (setting, fallbackValue) {
        this.props.stuff.getSetting(setting, fallbackValue)
    }
    setConfig (setting, value) {
        this.props.stuff.updateSetting(setting, value)
    }
    toggleConfig (setting) {
        this.props.stuff.toggleSetting(setting)
    }
    update () {
        this.forceUpdate()
    }
}
