# Portfolio Generator

A website that builds websites. Fill in a form (name, skills, projects, links), watch a live preview update as you type, and download a ready-to-host portfolio as a single HTML file.

No backend, no database, no build step. Just HTML, CSS and JavaScript.

## Features

- Live preview that updates on every keystroke
- Add or remove as many projects as you like
- Three themes: Light, Dark, Sunset
- Downloads one standalone `.html` file (no external dependencies)
- Form data is saved in the browser (`localStorage`), so a refresh does not lose your work
- "Fill sample data" button to see how it looks in one click
- User input is escaped and links are validated, so the generated page is safe

## How to run

Open `index.html` in any browser. That is it.

Or serve it locally:

```bash
npx serve .
```

## How it works

| File | What it does |
|---|---|
| `index.html` | The page layout: form on the left, preview on the right |
| `style.css` | Styling of the generator itself |
| `generator.js` | `buildPortfolio(data)` turns form data into a full HTML page (string) |
| `app.js` | Reads the form, saves data, updates the preview, handles the download |

The flow:

1. User types in the form
2. `app.js` updates the `state` object
3. `buildPortfolio(state)` returns the portfolio as an HTML string
4. The string is shown inside an `<iframe>` (preview) or saved as a file (download)

## Concepts used

- DOM manipulation and event handling
- Template literals for generating HTML
- Arrays and objects (`map`, `filter`, `splice`)
- `localStorage`
- `Blob` and `URL.createObjectURL` for file downloads
- Basic security: HTML escaping and URL validation

## Deploy your generated portfolio

1. Click **Download portfolio**
2. Rename the file to `index.html`
3. Drag it into [Netlify Drop](https://app.netlify.com/drop), or push it to a GitHub repo and enable GitHub Pages

## Ideas to extend

- Profile photo upload
- More themes and font choices
- "Experience" and "Education" sections
- Resume download button
- Copy-to-clipboard for the generated HTML
