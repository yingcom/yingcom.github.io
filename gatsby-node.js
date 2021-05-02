const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "MarkdownRemark") {
    // basePath is relative to the `options.path` setting in the `gatsby-source-filesystem` entries of the `gatsby-config.js`
    const slug = createFilePath({ node, getNode, basePath: "_content/" })
    createNodeField({
      node,
      name: "slug",
      value: `${slug}`,
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const blogIndexTemplate = path.resolve("./src/templates/blog-index.js")
  const blogPostTemplate = path.resolve("./src/templates/blog-post.js")
  const tunesIndexTemplate = path.resolve("./src/templates/tunes-index.js")
  const tunesPostTemplate = path.resolve("./src/templates/tunes-post.js")

  const result = await graphql(`
    {
      blog: allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
        filter: { fields: { slug: { regex: "/^/post/" } } }
      ) {
        group(field: frontmatter___tags) {
          fieldValue
          totalCount
        }
        nodes {
          id
          fields {
            slug
          }
        }
      }
      tunes: allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
        filter: { fields: { slug: { regex: "/^/tunes/" } } }
        # filter: { frontmatter: { tags: {eq: "music" } } }
        # filter: { fileAbsolutePath: { regex: "/\\/tunes\\//" } }
      ) {
        nodes {
          id
          fields {
            slug
          }
        }
      }
    }
  `)
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild("Error while running GraphQL query.")
    return
  }

  // const posts = result.data.allMarkdownRemark.edges
  // const posts = result.data.blog.edges
  const posts = result.data.blog.nodes

  const postsPerPage = 3
  const postPages = Math.ceil(posts.length / postsPerPage)

  // Blog index page with pagination
  Array.from({ length: postPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog/` : `/blog/p${i + 1}`,
      component: blogIndexTemplate,
      context: {
        currentPage: i + 1,
        limit: postsPerPage, //
        skip: i * postsPerPage, //
      },
    })
  })

  // posts page
  posts.forEach((post, index) => {
    // posts in ascending order
    // const previousPostId = index === 0 ? null : posts[index - 1].id
    // const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

    // posts in descending order
    const previousPostId = index === posts.length - 1 ? null : posts[index + 1].id
    const nextPostId = index === 0 ? null : posts[index - 1].id

    createPage({
      path: post.fields.slug,
      component: blogPostTemplate,
      context: {
        slug: post.fields.slug,
        id: post.id,
        previousPostId,
        nextPostId,
      },
    })
  })

  // Tunes index page with pagination
  const tunes = result.data.tunes.nodes
  const tunesPerPage = 3
  const tunePages = Math.ceil(tunes.length / tunesPerPage)

  Array.from({ length: tunePages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/tunes/` : `/tunes/p${i + 1}`,
      component: tunesIndexTemplate,
      context: {
        currentPage: i + 1,
        limit: tunesPerPage,
        skip: i * tunesPerPage,
      },
    })
  })

  // tunes page
  tunes.forEach((tune, index) => {
    // tunes in descending order
    const previousTuneId = index === tunes.length - 1 ? null : tunes[index + 1].id
    const nextTuneId = index === 0 ? null : tunes[index - 1].id

    createPage({
      path: tune.fields.slug,
      component: tunesPostTemplate,
      context: {
        slug: tune.fields.slug,
        id: tune.id,
        previousTuneId,
        nextTuneId,
      },
    })
  })
}
