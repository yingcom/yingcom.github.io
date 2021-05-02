import React from "react"
import { Helmet } from "react-helmet"

export default function Favicon() {
  return (
    <Helmet>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg"></link>
      <link rel="alternate icon" href="/favicon.ico"></link>
      <link rel="mask-icon" href="/favicon.svg" color="#b95d90"></link>
    </Helmet>
  )
}