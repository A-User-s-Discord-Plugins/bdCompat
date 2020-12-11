'use strict'

const { React, i18n: { Messages } } = require('@vizality/webpack')
const { FormNotice, Anchor, Button} = require('@vizality/components')
const { open: openModal } = require('@vizality/modal')

const PluginList = require('./PluginList.jsx')
const SettingsModal = require('./PluginSettingsModal.jsx')

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
          body={<div>{Messages.BDCOMAPT_INDEV_NOTICE.description} <Anchor href="https://github.com/A-User-s-Discord-Plugins/bdCompat#faq">{Messages.BDCOMAPT_INDEV_NOTICE.openFAQ}</Anchor></div>}
        /><br></br><br></br>
        <Button
          onClick={() => openModal(() => <SettingsModal stuff={this.props} />)}
          size={Button.Sizes.SMALL}
          color={Button.Colors.PRIMARY}
          look={Button.Looks.OUTLINED}
        >
          Open Settings
        </Button>
        <PluginList pluginManager={window.pluginModule} settings={this.props} />
      </div>
    )
  }
}