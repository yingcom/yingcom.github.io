A developer blog and portfolio made with Gatsby

Start with `npm i && npm run dev`

Check at `http://localhost:8000` & `http://localhost:8000/___graphql`

The top-level files and directories in a Gatsby project.

    .
    ├── node_modules
    ├── public (generated output folder, ignored by git)
    ├── docs (copied from the `public` in postbuild, tracked by git for GitHub Pages hosting)
    └─┬ src
      ├── _content (markdown files in custom subfolders e.g.`blog` and `tunes`)
      ├── assets
      ├── components
      ├── pages
      ├── styles
      └── templates
    ├── static (`.nojekyll` & `CNAME` for GitHub Pages hosting)
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    └── README.md
