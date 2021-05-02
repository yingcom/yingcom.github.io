import React from 'react'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import { toggle_wrapper, toggle, slider } from "./themeToggle.module.css"

class ThemeToggle extends React.Component {
  render() {
    return (
      <ThemeToggler>
        {({ theme, toggleTheme }) => {
          return (
            <div className={toggle_wrapper}>
              <label className={toggle} htmlFor="ck">
                <input id="ck" type="checkbox"
                  tabIndex={0}
                  onKeyPress={e => {
                    // only for Enter Key, as Space Key is the default key to toggle checkbox
                    if (e.which === 13) {
                      toggleTheme(e.target.checked ? 'light' : 'dark')
                    }
                  }}
                  onChange={e =>
                    toggleTheme(e.target.checked ? 'dark' : 'light')
                  }
                  checked={theme === 'dark'}
                />
                <div className={slider}></div>
              </label>
            </div>
          )
        }}
      </ThemeToggler>
    )
  }
}

export default ThemeToggle