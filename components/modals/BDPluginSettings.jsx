'use strict'

const { React, getModuleByDisplayName } = require('@vizality/webpack')
const { Modal, ErrorBoundary } = require('@vizality/components')
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
          <div className='plugin-settings' id={'plugin-settings-' + plugin.getName()}>
            <ErrorBoundary>{this.renderPluginSettings()}</ErrorBoundary>
          </div>
        </Modal.Content>
      </Modal>
    )
  }
  
  renderPluginSettings() {
    let panel
    try {
      panel = this.props.plugin.getSettingsPanel()
    } catch (e) {
      console.error(e)

      const error = (e.stack || e.toString()).split('\n')
        .filter(l => !l.includes('discordapp.com/assets/') && !l.includes('discord.com/assets/'))
        .join('\n')
        .split(resolve(__dirname, '..', '..')).join('')

      return <div className='vz-error-boundary vz-dashboard-error-boundary colorStandard-2KCXvj'>
        <h1 class="vz-error-boundary-header vz-dashboard-content-header base-1x0h_U content-3QAtGj">Huh, that's odd.</h1>
        <div class="vz-error-boundary-text">An error occurred while rendering the plugin settings:</div>
        <div className="vz-error-boundary-block vz-error-boundary-error-stack thin-1ybCId scrollerBase-289Jih">{error}</div>
      </div>
    }
    if (panel instanceof Node || typeof panel === 'string') {
      return <div ref={el => el ? panel instanceof Node ? el.append(panel) : el.innerHTML = panel : void 0}></div>
    }
    return typeof panel === 'function' ? React.createElement(panel) : panel
  }
}
