import React from "react"
import { graphql } from "gatsby"
import Seo from "../components/seo.js"
import Favicon from "../components/favicon.js"
import Navigation from "../components/navigation.js"
import Container from "../components/containerAlt.js"
import Jumbotron from "../components/jumbotron.js"
import Footer from "../components/footer.js"

export default function Home({ data, location }) {
  return (
    <div>
      <Seo
        title={`Home | ${data.site.siteMetadata.title}`}
        description={data.site.siteMetadata.description}
        pathname={location.pathname}
      ></Seo>
      <Favicon></Favicon>
      <Navigation></Navigation>
      <Container>
        <Jumbotron></Jumbotron>
        <Footer placement='altered'></Footer>
      </Container>
    </div>
  )
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`