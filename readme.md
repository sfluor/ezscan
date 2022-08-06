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

- fix height issue on mobiles
- fix touch events
- figure out why we can't load big images
- auto detect borders on submitted image
- center image in image editor
- tune PDF parameters:
- - Portrait / Landscape
- - Tune padding
- - Compact mode (more than one image per document)
- performances (try wasm for image processing ?)
- compress images when saving PDF ?
