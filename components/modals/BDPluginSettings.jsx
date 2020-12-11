'use strict'

const { React } = require('@vizality/webpack')
const { Modal } = require('@vizality/components')
const { getModuleByDisplayName } = require('@vizality/webpack')
const { close: closeModal } = require('@vizality/modal')

const FormTitle = getModuleByDisplayName('FormTitle', false)

module.exports = class BDPluginSettings extends React.Component {
  constructor (props) {
    super(props)
    this.settingsRef = el => {
      const { plugin } = this.props
      if(!el) return
      const panel = plugin.getSettingsPanel()
      if(typeof panel == 'string') el.innerHTML = panel
      else el.append(panel)
    }
  }

  render () {
    const { plugin } = this.props

    return (
      <Modal size={Modal.Sizes.LARGE}>
        <Modal.Header>
          <FormTitle tag={FormTitle.Tags.H4}>{plugin.getName()} Settings</FormTitle>
          <Modal.CloseButton onClick={closeModal}/>
        </Modal.Header>
        <Modal.Content>
          <div class='plugin-settings' ref={this.settingsRef} id={'plugin-settings-' + plugin.getName()}></div>
        </Modal.Content>
      </Modal>
    )
  }
}
