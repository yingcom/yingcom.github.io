import React from "react"
import { Link } from "gatsby"
import Logo from "../assets/logo.svg"
import { wrapper, logo, logo_svg, links, link } from "./navigation.module.css"
import ThemeToggle from "./ThemeToggle.js"

export default function Navigation () {
  return (
    <div className={wrapper}>
      <div className={logo}>
        <Link to={`/`}>
          <Logo className={logo_svg}/>
        </Link>
      </div>
      <div className={links}>
        <Link to={`/blog/`} className={link}><span>BLOG</span></Link>
        <Link to={`/sketch/`} className={link}><span>SKETCH</span></Link>
        <Link to={`/tunes/`} className={link}><span>TUNES</span></Link>
      </div>

      <ThemeToggle></ThemeToggle>
    </div>
  )
}

