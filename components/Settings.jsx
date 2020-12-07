'use strict'

const { React, i18n: { Messages } } = require('@vizality/webpack')
const { settings: { SwitchItem }, FormNotice } = require('@vizality/components')

const PluginList = require('./PluginList.jsx')

module.exports = class Settings extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        <FormNotice
          imageData={{
            width: 60,
            height: 60,
            src: '/assets/0694f38cb0b10cc3b5b89366a0893768.svg'
          }}
          type={FormNotice.Types.WARNING}
          title={Messages.BDCOMAPT_INDEV_NOTICE.title}
          body={Messages.BDCOMAPT_INDEV_NOTICE.description}
        /><br></br><br></br>
        <SwitchItem value={this.props.getSetting('disableWhenStopFailed')}
        onChange={() => this.props.toggleSetting('disableWhenStopFailed')}>
          {Messages.BDCOMAPT_DISABLE_PLUGIN_FAILED_STOP}
        </SwitchItem>
        <PluginList pluginManager={window.pluginModule} />
      </div>
    )
  }
}