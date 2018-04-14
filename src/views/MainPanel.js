import Panels, { Panel, Header } from "@enact/moonstone/Panels"
import React from "react"
import RssChannel from "../components/RssChannel"
import Spinner from "@enact/moonstone/Spinner"

export default class MainPanels extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      panels:     [],
      panelIndex: 0,
      isLoading:  false,
    }
    this.handlePanelPushed = this.handlePanelPushed.bind(this)
    this.handleBackPressed = this.handleBackPressed.bind(this)
    this.handleStartLoading = this.handleStartLoading.bind(this)
    this.handleStopLoading = this.handleStopLoading.bind(this)
  }

  componentWillMount() {
    const { panels } = this.state
    panels.push(<Panel key="cstv">
      <Header title="CSTV" titleBelow="A video player which playing podcast and media feed base on RSS."/>
        <RssChannel items={[{
          title:       "myrss.nu/drama",
          description: "http://myrss.nu/drama",
          enclosure:   { _url: "http://myrss.nu/drama", _type: "application/rss+xml" },
        }]}
                    onPushPanel={this.handlePanelPushed}
                    onStartLoading={this.handleStartLoading}
                    onStopLoading={this.handleStopLoading}/>
    </Panel>)
    this.setState({ panels })
  }

  handleStartLoading() {
    this.setState({
      isLoading: true,
    })
  }

  handleStopLoading() {
    this.setState({
      isLoading: false,
    })
  }

  handlePanelPushed(panel) {
    const { panels } = this.state
    panels.push(panel)
    this.setState({
      panels,
      panelIndex: panels.length - 1,
      isLoading:  false,
    })
  }

    handleBackPressed() {
    const { panels } = this.state
    panels.pop()
    this.setState({
      panels,
      panelIndex: panels.length - 1,
    })
  }

  render() {
    const { panels, panelIndex, isLoading } = this.state
    const panelsToRender = panels.map(panel => panel)

    let spinner
    if (isLoading) {
      spinner = <Spinner centered blockClickOn="screen" scrim transparent/>
    }

    return (
      <div>
        {spinner}
        <Panels id={"theMainPanels"} noCloseButton noAnimation={false} index={panelIndex}
                onBack={this.handleBackPressed}>
          {panelsToRender}
        </Panels>
      </div>
    )
  }
}
