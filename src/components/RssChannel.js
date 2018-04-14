import React from "react"
import DataSource from "../data"
import { Panel, Header } from "@enact/moonstone/Panels"
import { Item } from "@enact/moonstone/Item"
import Scroller from "@enact/moonstone/Scroller"
import BodyText from "@enact/moonstone/BodyText"
import Popup from "@enact/moonstone/Popup"
import VideoPlayer from "@enact/moonstone/VideoPlayer"
import PropTypes from "prop-types"

export default class RssChannel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPopup: false,
    }
    this.handleItemClicked = this.handleItemClicked.bind(this)
    this.handlePopupClosed = this.handlePopupClosed.bind(this)
  }

  static get propTypes() {
    return {
      item:           PropTypes.object,
      onPushPanel:    PropTypes.func,
      onStartLoading: PropTypes.func,
      onStopLoading:  PropTypes.func,
    }
  }

  async handleItemClicked(selectedItem) {
    this.props.onStartLoading()
    const { title, enclosure: { _type, _url } } = selectedItem
    switch (_type) {
      case "application/rss+xml": {
        const { rss: { channel: { item: items } } } = await DataSource.fetchXmlInJson(_url)
        this.props.onStopLoading()
        this.props.onPushPanel(<Panel key={_url}>
          <Header title={title} titleBelow={_url}>
            {/*<div dangerouslySetInnerHTML={{ __html: description }}></div>*/}
          </Header>
          <Scroller>
            <RssChannel items={items}
                        onPushPanel={this.props.onPushPanel}
                        onStartLoading={this.props.onStartLoading}
                        onStopLoading={this.props.onStopLoading}/>
          </Scroller>
        </Panel>)
        break
      }
      case "video/mp4":
      case "video/html":
        this.props.onStopLoading()
        this.props.onPushPanel(<Panel>
            <VideoPlayer title={title}>
              <source src={_url} type={_type}/>
            </VideoPlayer>
        </Panel>)
        break
      default:
        this.props.onStopLoading()
        this.setState({
          showPopup:    true,
          popupMessage: `Unknown type of source: ${_type}`,
        })
    }
  }

  handlePopupClosed() {
    this.setState({
      showPopup:    false,
      popupMessage: "",
    })
  }

  render() {
    const itemsToRender = this.props.items.map(item => <Item key={item._url} onClick={() => this.handleItemClicked(item)}>
      <BodyText>{item.title}</BodyText>
    </Item>)

    return <Scroller>
      <Popup open={this.state.showPopup} showCloseButton onClose={this.handlePopupClosed}>
        <BodyText>{this.state.popupMessage}</BodyText>
      </Popup>
      {itemsToRender}
    </Scroller>
  }
}
