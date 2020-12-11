const { React, i18n: { Messages } } = require('@vizality/webpack')
const { close: closeModal } = require('@vizality/modal')
const { settings: { SwitchItem, RadioGroup }, Modal } = require('@vizality/components')
const { getModuleByDisplayName} = require('@vizality/webpack')

const FormTitle = getModuleByDisplayName('FormTitle', false)

module.exports = class PluginSettings extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        this.settings = this.props.settingStuff
        
        return (
            <Modal size={Modal.Sizes.LARGE}>
                <Modal.Header>
                    <FormTitle tag={FormTitle.Tags.H4}>BDCompat Settings</FormTitle>
                    <Modal.CloseButton onClick={closeModal} />
                </Modal.Header>
                <Modal.Content>
                    
                    <SwitchItem
                        value={this.settings.getSetting('disableWhenStopFailed', true)}
                        onChange={function () {
                            this.props.settings.toggleSetting('disableWhenStopFailed')
                            this.forceUpdate()
                        }}>
                        {Messages.BDCOMAPT_DISABLE_PLUGIN_FAILED_STOP}
                    </SwitchItem>

                    <RadioGroup
                        options={[
                            {name: "List", value: "List"},
                            {name: "Card", value: "Card"}
                        ]}
                        value={this.settings.getSetting('showMethod', "List")}
                        onChange={function(e){
                            this.settings.updateSetting('showMethod', e.value)
                            this.forceUpdate()
                        }}
                    />

                </Modal.Content>
            </Modal>
        )
    }

    // this.props.stuff.updateSetting(setting, value)
}
