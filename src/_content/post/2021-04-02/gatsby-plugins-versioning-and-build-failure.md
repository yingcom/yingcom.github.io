---
date: "2021-04-02"
title: "Gatsby Plugins Versioning and Build Failure"
tags: ["coding", "Gatsby", "CSS", "PostCSS"]
preview: "Trouble shooting gatsby-plugin-postcss in Gatsby v2 and v3"
---

# CSS Plugins and Build Failure
There are different options for styling website in Gatsby.
1. Global CSS
2. CSS modules (built-in support in Gatsby)
3. CSS-in-JS (plugins required)
4. SASS/SCSS (plugins required)

I don't like mixing CSS with markup or any unnecessary inline CSS, so CSS-in-JS is dropped. SASS/SCSS requires extra plugins and it would be an overkill for a small website. I use CSS modules and global CSS for this blog, because Gatsby has built-in support for CSS modules and no extra config is required. At the final phase of development of this site, it suddenly dawned on me that I needed PostCSS for browser compatibility, which I forgot to install from the beginning. So I installed the packages


```sh
npm install postcss gatsby-plugin-postcss postcss-preset-env --save-dev
```

and adjust the plugins configurations in `md>gatsby-config.js` according to the documentation.

```js
  plugins: [
    {
      resolve: "gatsby-plugin-postcss",
      options: {
        postCssPlugins: [require(`postcss-preset-env`)({ stage: 0 })],
      }
    }
  }
```

However, it broke the development server with many error messages similar to the following:

```
ERROR #98123  WEBPACK
Generating development JavaScript bundle failed
Style Loader Invalid Options
options should NOT have additional properties
File: src/components/navigation.module.css
```

Somehow the stylesheets using CSS modules ([filename].module.css) were not loaded by Webpack, while the global stylesheet ([filename].css) had no such problem.

# Versioning Problem

Gatsby v3 was just released when I installed the gatsby-plugin-postcss plugin. There were lots of [breaking changes](https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v2-to-v3/#handling-breaking-changes) between Gatsby v2 and v3. Webpack and CSS Modules were on the list. At first I thought the build failure was caused by misconfigurations of CSS loaders in Webpack.

However, after turning off gatsby-plugin-postcss@^4.1.0 in Gatsby v2, the build process went back to normal. It seems the problem came from the plugin itself. According to the [changelog of gatsby-plugin-postcss](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-postcss/CHANGELOG.md), there was a version mismatch between the plugin and Gatsby, which could cause the build to fail.

>gatsby-plugin-postcss@^3.6 is compatible with gatsby@^2.32  
>gatsby-plugin-postcss@^4.1 is compatible with gatsby@^3.2

This website was initially developed in Gatsby v2. If I rolled backed to gatsby-plugin-postcss@^3.6.0 with Gatsby v2, the build didn't fail with the gatsby-plugin-postcss enabled this time. A more future-proofing solution is migrating to Gatsby v3 and [rewriting the import syntax for CSS modules](https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v2-to-v3/#css-modules-are-imported-as-es-modules).

A build failure due to version mismatch is common in software development. However, trouble shooting becomes somewhat annoying when the official plugins compatibility with different versions of Gatsby is not documented clearly. Debugging errors thrown by Webpack in Gatsby is not pleasant. Gatsby uses Webpack under the hood, but the Webpack config file is not exposed at the top level. You need to check the Webpack config in Gatsby's source codes on GitHub, and if necessary, overwrite it in your local `md>gatsby-node.js` file.
