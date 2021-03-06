import kind from "@enact/core/kind"
import MoonstoneDecorator from "@enact/moonstone/MoonstoneDecorator"
import React from "react"
import MainPanels from "../views/MainPanel"
import css from "./App.less"

const App = kind({
  name: "App",

  styles: {
    css,
    className: "app",
  },

  render: (props) => (
    <div {...props}>
      <MainPanels/>
    </div>
  ),
})

export default MoonstoneDecorator(App)
