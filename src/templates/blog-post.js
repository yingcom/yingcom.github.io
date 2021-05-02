import React from "react"
import { Link, graphql } from "gatsby"
import Seo from "../components/seo.js"
import Favicon from "../components/favicon.js"
import Navigation from "../components/navigation.js"
import Container from "../components/container.js"
import Header from "../components/header.js"
import Footer from "../components/footer.js"
import { post_container, post_content, siblinks, link } from "./blog-post.module.css"

const BlogPost = ({ data, location}) => {
  const { frontmatter, html, timeToRead, excerpt } = data.current
  const { previous, next } = data

  return (
    <div>
      <Seo
        title={`${frontmatter.title} | ${data.site.siteMetadata.title}`}
        description={frontmatter.preview || excerpt}
        pathname={location.pathname}
      ></Seo>
      <Favicon></Favicon>
      <Navigation></Navigation>
      <Container>

        <Header prelude = {{
          group: "Blog",
          title: frontmatter.title,
          date: frontmatter.date,
          timeToRead: timeToRead
        }}></Header>

        <div className={post_container}>
          <div className={post_content} dangerouslySetInnerHTML={{ __html: html }} />

          <div className={siblinks}>
            <span>
              {previous && (
                <Link to={previous.fields.slug} rel="prev" className={link}>
                  Prev: {previous.frontmatter.title}
                </Link>
              )}
            </span>
            <span>
              {next && (
                <Link to={next.fields.slug} rel="next" className={link}>
                  Next: {next.frontmatter.title}
                </Link>
              )}
            </span>
          </div>

        </div>
        <Footer></Footer>
      </Container>
    </div>
  )
}

export const pageQuery = graphql`
  query(
    # $id: String
    $slug: String!
    $previousPostId: String
    $nextPostId: String
    ) {
    site {
      siteMetadata {
        title
      }
    }
    # current: markdownRemark(id: { eq: $id } ) {
    current: markdownRemark(fields: { slug: { eq: $slug } }) {
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        preview
        date(formatString: "YYYY-MM-DD")
      }
      timeToRead
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
export default BlogPost