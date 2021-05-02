import React from "react"
import { Link, graphql } from "gatsby"
import Seo from "../components/seo.js"
import Favicon from "../components/favicon.js"
import Navigation from "../components/navigation.js"
import Container from "../components/container.js"
import HeaderAlt from "../components/headerAlt.js"
import Footer from "../components/footer.js"
import IconCalender from "../assets/icon-calendar.svg"
import IconClock from "../assets/icon-clock.svg"
import IconTags from "../assets/icon-tags.svg"
import { post_container, post_content, post_item, post_title, post_info, post_date, post_length, post_tags, post_preview, post_excerpt, pagelinks, link } from "./blog-index.module.css"

const TunesIndex = ({ data , location }) => {
  const { nodes } = data.tunes
  const { currentPage, pageCount } = data.tunes.pageInfo

  return (
    <div>
      <Seo
        title= {`Tunes | ${data.site.siteMetadata.title}`}
        description={`Musical Notes from ${data.site.siteMetadata.title}`}
        pathname={location.pathname}
      ></Seo>
      <Favicon></Favicon>
      <Navigation></Navigation>
      <Container>

        <HeaderAlt prelude = {{
          title: "Tunes",
          caption: "Let the music flow"
        }}></HeaderAlt>

        <div className={post_container}>
          <div className={post_content}>
            { nodes.map((node) => {
              return (
                <div key={node.id} className={post_item}>
                  <Link to={node.fields.slug} className={post_title}>
                    {node.frontmatter.title}
                  </Link>
                  <div className={post_info}>
                    <div className={post_date}>
                      <IconCalender></IconCalender>
                      <span>{node.frontmatter.date}</span>
                    </div>
                    <div className={post_length}>
                      <IconClock></IconClock>
                      {/* <span>{node.timeToRead} mins</span> */}
                      {/* <span>{node.frontmatter.playbackTime} mins</span> */}
                      { node.frontmatter.playbackTime ?
                        <span>{(Number(node.frontmatter.playbackTime) + Number(node.timeToRead))} mins</span>
                      : <span>{node.timeToRead} mins</span>
                      }

                    </div>
                    <div className={post_tags}>
                      { node.frontmatter.tags.length > 0 ? <IconTags></IconTags> : null}
                      <span>{node.frontmatter.tags.length > 0 && node.frontmatter.tags.join(" ") }</span>
                    </div>
                  </div>
                  {/* <p className={post_preview}>{node.frontmatter.preview}</p>
                  <p className={post_excerpt}>{node.excerpt}</p> */}

                  { node.frontmatter.preview ?
                    <p className={post_preview}> {node.frontmatter.preview} </p> 
                  : <p className={post_excerpt}> {node.excerpt} </p>
                  }

                </div>
              )}
            )}
          </div>
          <div className={pagelinks}>
            <span>
              { currentPage > 1 && (
                <Link to={(currentPage === 2 ? '/tunes/' : `/tunes/p${currentPage - 1}`)}
                      rel="prev" className={link}> Previous
                </Link>
              )}
            </span>
            <span>
              { currentPage < pageCount && (
                <Link to={`/tunes/p${currentPage + 1}`}
                      rel="next" className={link}> Next
                </Link>
              )}
            </span>
          </div>
        </div>
        <Footer></Footer>
      </Container>
    </div>
  )}


export const query = graphql`
  query($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    tunes: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
      filter: {fields: {slug: {regex: "/^\/tunes/"}}}
    ) {
      pageInfo {
        currentPage
        pageCount
      }
      nodes {
        id
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD")
          preview
          tags
          playbackTime
        }
        excerpt(truncate: false)
        timeToRead
      }
    }
  }
`

export default TunesIndex