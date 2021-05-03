import React from "react"
import { graphql } from "gatsby"
import Seo from "../components/seo.js"
import Favicon from "../components/favicon.js"
import Navigation from "../components/navigation.js"
import Container from "../components/container.js"
import HeaderAlt from "../components/headerAlt.js"
import Footer from "../components/footer.js"

const NotFound = ({ data, location }) => {
  return (
    <div>
      <Seo
      title={`404 Page | ${data.site.siteMetadata.title}`}
      description={`404 Page from ${data.site.siteMetadata.title}`}
      pathname={location.pathname}
      ></Seo>
      <Favicon></Favicon>
      <Navigation></Navigation>
      <Container>
        <HeaderAlt prelude = {{
          title: "Ooops ...",
          caption: "It looks like that page doesn't exist."
        }}></HeaderAlt>
       <Footer placement='floor'></Footer>
      </Container>
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

export default NotFound