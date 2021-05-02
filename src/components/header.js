import React from "react"
import IconHashtag from "../assets/icon-hashtag.svg"
import IconCalendar from "../assets/icon-calendar.svg"
import IconClock from "../assets/icon-clock.svg"
import { outerWrapper, wrapper, intro, intro_title, meta, meta_item, meta_icon, meta_text } from "./header.module.css"

const Header = (props) => {
  const { title, group, date, timeToRead } = props.prelude
  return (
  <div className={outerWrapper}>
    <div className={wrapper}>
      <div className={intro}>
        <div className={intro_title}>{title}</div>
      </div>
      <div className={meta}>
        <div className={meta_item}>
          <IconHashtag className={meta_icon} />
          <span className={meta_text}>{group}</span>
        </div>
        <div className={meta_item}>
          <IconCalendar className={meta_icon} />
          <span className={meta_text}>{date}</span>
        </div>
        <div className={meta_item}>
          <IconClock className={meta_icon} />
          <span className={meta_text}>{timeToRead} mins</span>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Header