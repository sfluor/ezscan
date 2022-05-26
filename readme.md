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


- app works offline + 
```jsx
    <span> 📶 Works offline: you don't need to be connected to internet, once you visited the website once you can keep using the app.</span>
```
- add version hash on the footer
- figure out why we can't load big images
- fix PDF save if the image is horizontal
- tune PDF parameters (sizes / more than one image per page. etc)
- center image
- show loading
- fix the favicon
- use a web worker for distorting
- auto detect borders on submitted image
- precommit hooks
- compress images when saving PDF ?
- favicon
- manifest.json for SPA like on android
- fix camera input on firefox mobile
- performances
