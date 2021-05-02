import React from "react"
import { outerWrapper, wrapper, intro, intro_title, intro_caption } from "./headerAlt.module.css"

const HeaderAlt = (props) => {
  const { title, caption } = props.prelude
  return (
  <div className={outerWrapper}>
    <div className={wrapper}>
      <div className={intro}>
        <div className={intro_title}>{title}</div>
        <div className={intro_caption}>{caption}</div>
      </div>
    </div>
  </div>
  )
}

export default HeaderAlt