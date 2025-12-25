# Oh My CV!

[![CI](https://github.com/heridotlife/oh-my-cv/actions/workflows/ci.yml/badge.svg)](https://github.com/heridotlife/oh-my-cv/actions/workflows/ci.yml)
[![CodeQL](https://github.com/heridotlife/oh-my-cv/actions/workflows/codeql.yml/badge.svg)](https://github.com/heridotlife/oh-my-cv/actions/workflows/codeql.yml)
[![WCAG 2.1 AA/AAA](https://img.shields.io/badge/WCAG%202.1-AA%2FAAA-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)](https://ohmycv.heri.life)

Microsoft Word and LaTeX are too overkill for a resume.

So, why not write it in Markdown?

Have fun: [ohmycv.heri.life](https://ohmycv.heri.life/)

&nbsp;

## Important Notice

- Highly recommend using **Chromium-based browsers**, e.g., [Chrome](https://www.google.com/chrome/) and [Microsoft Edge](https://www.microsoft.com/edge).
- **Backup your data**: Cloud backup is coming soon, but isn't available yet. For now, please regularly export and back up your data by clicking the `Save As` button.

&nbsp;

## Features

- Write your resume in Markdown and enjoy a real-time preview — it's smooth!
- Export to PDF in A4 and US Letter sizes
- Automatically paginate your resume like in Microsoft Word
- Customize page margins, theme colors, line heights, fonts, and more
- Pick any fonts from [Google Fonts](https://fonts.google.com/)
- Easily add icons using [Iconify](https://github.com/iconify/iconify) (search for icons on [Icônes](https://icones.js.org/))
- TeX support ([KaTeX](https://github.com/KaTeX/KaTeX))
- Add cross-references (ideal for academic CVs)
- Correct casing automatically (e.g., 'Github' to 'GitHub')
- Insert line breaks (`\\[10px]`) or start a new page (`\newpage`) just as you would in LaTeX
- Customize CSS
- Manage multiple resumes
- It works offline ([PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps))
- Your data in your hands:
  - All data is saved locally in your browser (see [here](https://localforage.github.io/localForage/) for details)
  - Hosted on [Cloudflare Pages](https://pages.cloudflare.com/) as an open-source static website, which doesn't (have the ability to) collect your data
  - No user tracking or ads
- Dark mode

&nbsp;

## Accessibility

This project is committed to web accessibility and follows **WCAG 2.1 AA/AAA** guidelines:

- ✅ **Color Contrast**: 10:1 ratio (exceeds AAA requirement of 7:1)
- ✅ **Link Accessibility**: All links are visually distinguishable with underlines
- ✅ **Semantic HTML**: Proper landmarks and ARIA attributes
- ✅ **Keyboard Navigation**: Full keyboard support for all interactive elements
- ✅ **Screen Reader Support**: Valid ARIA structure throughout the application
- ✅ **Runtime Testing**: Automated accessibility auditing via [axe-core](https://github.com/dequelabs/axe-core)

For accessibility issues or suggestions, please [open an issue](https://github.com/heridotlife/oh-my-cv/issues).

&nbsp;

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm serve
```

### Code Quality

```bash
# Run linter
pnpm lint

# Check code formatting
pnpm prettier:check

# Format code
pnpm prettier

# Type check
pnpm type-check
```

&nbsp;

## Contribution

Contributions are welcome! Please read the [Contributing Guide](.github/CONTRIBUTING.md) before getting started.

### Code of Conduct

Please note that this project follows a [Code of Conduct](.github/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

&nbsp;

## Credits

- This project is a fork of [Renovamen/oh-my-cv](https://github.com/Renovamen/oh-my-cv). Huge thanks to the original author for the amazing work!
- [billryan/resume](https://github.com/billryan/resume)

&nbsp;

## License

[GPL-3.0](LICENSE)
