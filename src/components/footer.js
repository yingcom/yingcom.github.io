import React from "react"
import { normal, altered } from "./footer.module.css"

const Footer = (props) => {
  const placement = props.placement === 'altered' ? altered : normal
  return (
    <div className={placement}>
      Copyright © 2017-{new Date().getFullYear()} Ying Feng. All rights reserved.
    </div>
  )
}

export default Footer