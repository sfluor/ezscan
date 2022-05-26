# ezscan

[![Netlify Status](https://api.netlify.com/api/v1/badges/50a74bb9-f1a7-4b41-b9a2-5c8f6fafda8d/deploy-status)](https://app.netlify.com/sites/ezscan/deploys)

![Build Status](https://github.com/sfluor/ezscan/workflows/Node%20CI/badge.svg?branch=master)


### Serve locally

Run `yarn start`

### Tests

To run tests you can do `yarn test`

### Format

To format the code you can do `yarn lint-fix`

### Dev

To find icons: https://marella.me/material-design-icons/demo/svg/

## Todos

- fix camera input on firefox mobile
- fix height issue on mobiles
- figure out why we can't load big images
- show loading
- black and white filter
- fix the favicon
- center image
- app works offline + 
```jsx
    <span> 📶 Works offline: you don't need to be connected to internet, once you visited the website once you can keep using the app.</span>
```
- manifest.json for SPA like on android
- auto detect borders on submitted image
- add version hash on the footer
- tune PDF parameters:
- - Portrait / Landscape
- - Tune padding
- - Compact mode (more than one image per document)
- performances
- compress images when saving PDF ?
