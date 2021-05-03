import React from "react"
import { graphql } from "gatsby"
import Seo from "../components/seo.js"
import Favicon from "../components/favicon.js"
import Navigation from "../components/navigation.js"
import Carousel from "../components/carousel.js"
import Footer from "../components/footer.js"

const Sketch = ({ data, location }) => {
  return (
    <div>
      <Seo
        title={`Sketch | ${data.site.siteMetadata.title}`}
        description={`JavaScript Playground from ${data.site.siteMetadata.title}`}
        pathname={location.pathname}
      ></Seo>
      <Favicon></Favicon>
      <Navigation></Navigation>
      <Carousel></Carousel>
      <Footer placement='floor'></Footer>
    </div>
  )
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default Sketch
