import React from "react"
import { Link } from "gatsby"
import IconBookmark from "../assets/icon-bookmark.svg"
import IconCode from "../assets/icon-code.svg"
import IconMusic from "../assets/icon-music-note.svg"
import { outerWrapper, wrapper, intro, intro_title, intro_caption, meta, meta_item, meta_icon, meta_text } from "./jumbotron.module.css"

const Jumbotron = () => {
  return (
  <div className={outerWrapper}>
    <div className={wrapper}>
      <div className={intro}>
        <div className={intro_title}>Ying Feng</div>
        <div className={intro_caption}>Software Engineer</div>
        {/* <div className={intro_tags}></div> */}
      </div>
      <div className={meta}>
        <div className={meta_item}>
          <IconBookmark className={meta_icon} />
          <Link to={`/blog/`} className={meta_text}>Blog</Link>
        </div>
        <div className={meta_item}>
          <IconCode className={meta_icon} />
          <Link to={`/sketch/`} className={meta_text}>Sketch</Link>
        </div>
        <div className={meta_item}>
          <IconMusic className={meta_icon} />
          <Link to={`/tunes/`} className={meta_text}>Tunes</Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Jumbotron