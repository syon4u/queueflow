# Web fonts

All families in this directory are licensed under the SIL Open Font License,
Version 1.1 (https://openfontlicense.org). The files are the `latin` subsets
served by Google Fonts (variable fonts where the family is variable),
downloaded on 2026-09-09 with a Chrome user agent from the CSS endpoints
listed below. Instrument Serif and Merriweather are byte-for-byte the Google
files. Inter and Bricolage Grotesque (the two preloaded faces) had their
variable axes restricted to the ranges the app uses with fontTools 4.64
(`fontTools.varLib.instancer`, names unchanged — neither family declares a
Reserved Font Name):

- Inter: `wght` 100–900 -> 400–700 (48 432 -> 36 092 bytes)
- Bricolage Grotesque: `wght` 200–800 -> 600–700, `wdth` 75–100 -> 80–100,
  `opsz` 12–96 kept (131 312 -> 109 992 bytes)

| File | Family / axes | Google Fonts version | Copyright |
| --- | --- | --- | --- |
| `inter-latin-400-700.woff2` | Inter, wght 400–700 (axis-restricted, see above) | v20 (`https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700`) | © The Inter Project Authors (rsms.me/inter) |
| `bricolage-grotesque-latin-600-700.woff2` | Bricolage Grotesque, opsz 12–96, wdth 80–100, wght 600–700 (axis-restricted, see above) | v9 (`https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,600..700`) | © The Bricolage Grotesque Project Authors (github.com/ateliertriay/bricolage) |
| `instrument-serif-italic-latin-400.woff2` | Instrument Serif, italic 400 | v5 (`https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1`) | © The Instrument Serif Project Authors (github.com/Instrument/instrument-serif) |
| `merriweather-latin-400-700.woff2` | Merriweather, wght 400–700, wdth 100 | v33 (`https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700`) | © The Merriweather Project Authors (github.com/SorkinType/Merriweather) |

Source file URLs (fonts.gstatic.com):

- Inter: `/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2`
- Bricolage Grotesque: `/s/bricolagegrotesque/v9/3y996as8bTXq_nANBjzKo3IeZx8z6up5L-iNGfyOPPs.woff2`
- Instrument Serif: `/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zAjjH7Motmp5g.woff2`
- Merriweather: `/s/merriweather/v33/u-4e0qyriQwlOrhSvowK_l5UcA6zuSYEqOzpPe3HOZJ5eX1WtLaQwmYiSeqqJ-mXq1Gi.woff2`

The `@font-face` declarations (with the matching `unicode-range`) are in
`src/styles/fonts.css`.
