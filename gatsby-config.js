module.exports = {
  siteMetadata: {
    title: "Ying Feng Official Website",
    author: "Ying Feng",
    siteUrl: "https://fengying.org",
    description: "A Developer Blog and Portfolio created by Ying Feng",
    keywords: ["Software Engineering", "Web Development", "JavaScript"],
  },
  plugins: [
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-92894007-1",
        head: false,
        anonymize: true,
        sampleRate: 100,
        siteSpeedSampleRate: 100, // default 1% users will be measured
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-dark-mode",
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/,
        },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "src",
        path: `${__dirname}/src`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        commonmark: true,
        footnotes: true,
        pedantic: true,
        gfm: true,
        plugins: [
          {
            resolve: "gatsby-remark-vscode",
            options: {
              theme: {
                default: "Monokai",
                dark: "Solarized Light",
                parentSelector: {
                  ".light": "Monokai",
                  ".dark": "Solarized Light",
                },
              },
              inlineCode: {
                marker: ">",
                className: "grvsc-inline-code",
                theme: {
                  default: "Solarized Light",
                },
              },
            },
          },
          {
            resolve: "gatsby-remark-audio",
            options: {
              preload: "auto",
              loop: false,
              controls: true,
              muted: false,
              autoplay: false,
            },
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-postcss",
      options: {
        postCssPlugins: [require("postcss-preset-env")({ stage: 0 })],
      },
    },
  ],
}
