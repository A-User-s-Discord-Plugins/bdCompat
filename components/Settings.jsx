'use strict'

const { React, i18n: { Messages }, getModule, getModuleByDisplayName } = require('@vizality/webpack')
const { FormNotice, Anchor, Button, Divider } = require('@vizality/components')
const { open: openModal } = require('@vizality/modal')

const PluginList = require('./PluginList.jsx')
const SettingsModal = require('./modals/PluginSettingsModal.jsx')

const Image = getModuleByDisplayName("Image")

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

        <div className="vzbdcompat-horizontal">
          <Button
            onClick={() => openModal(() => <SettingsModal stuff={this.props} />)}
            size={Button.Sizes.SMALL}
            color={Button.Colors.BRAND}
            look={Button.Looks.FILLED}
          >
            Settings
          </Button>
          <Button
            onClick={() => openPath(window.ContentManager.pluginsFolder)}
            size={Button.Sizes.SMALL}
            color={Button.Colors.PRIMARY}
            look={Button.Looks.OUTLINED}
            className="vzbdcompat-little-space"
          >
            {Messages.BDCOMAPT_OPEN_PLUGINS_FOLDER}
          </Button>
        </div>
        <Divider />
        <br />

        <PluginList pluginManager={window.pluginModule} settings={this.props} />

        <div className="description-3_Ncsb vzbdcompat-horizontal vzbdcompat-thanks">
          Ported with 
          <Image
            width= {25}
            height= {25}
            src= "/assets/0483f2b648dcc986d01385062052ae1c.svg"
            zoomable= {false}
        /> by A user</div>
      </div>
    )
  }
}