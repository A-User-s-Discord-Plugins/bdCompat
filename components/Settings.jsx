'use strict'

const { React } = require('@vizality/webpack')
const { settings: { SwitchItem }, FormNotice, KeyboardShortcut } = require('@vizality/components')

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
          title={"Plugin in development"}
          body={
            <p>This plugin is in development stages and it contains a lot of bugs that're trying to fix it. Please be patient and expect bugs. Also maybe you see some perfomance issues. When you see that happening, please refresh Discord by pressing this keybind: <KeyboardShortcut shortcut="mod+r" /></p>
          }
        /><br></br><br></br>
        <SwitchItem value={this.props.getSetting('disableWhenStopFailed')}
        onChange={() => this.props.toggleSetting('disableWhenStopFailed')}>
          Disable plugin when failed to stop
        </SwitchItem>
        <PluginList pluginManager={window.pluginModule} />
      </div>
    )
  }
}