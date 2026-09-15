# Chenglin Li's academic homepage

A static site for GitHub Pages. No build step or package installation is required.

## Preview locally

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open <http://127.0.0.1:4173>.

## Update the site

- `index.html` contains the biography, news, and publications. Edit content here.
- `styles.css` defines the responsive layout and visual styles.
- `script.js` adds section navigation highlighting, subtle reveal effects, and the reduced-motion control. Content and expandable details also work without JavaScript.
- `assets/pdf/CV_Chenglin.pdf` is the linked CV.
- `pages/` preserves old URLs with redirects to the homepage. The former project listings are no longer displayed.

After editing CSS or JavaScript, update the corresponding `?v=` value in `index.html` so returning visitors receive the new assets.

## Content references

- [ICON preprint](https://arxiv.org/abs/2605.17184): publication metadata and May 2026 release.
- [RAVEN preprint](https://arxiv.org/abs/2510.06573): updated study description and [CHI 2026 DOI](https://doi.org/10.1145/3772318.3791616).

Keep submission status separate from accepted venues. The existing ICON submission status is retained.

## Before publishing

Run `node --check script.js` and `git diff --check`. Check the page on desktop and mobile, expand the abstracts and earlier news, and verify navigation, reduced motion, and local asset links. The domain is configured in `CNAME`.
