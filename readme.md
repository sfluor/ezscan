# ezscan

[![Netlify Status](https://api.netlify.com/api/v1/badges/50a74bb9-f1a7-4b41-b9a2-5c8f6fafda8d/deploy-status)](https://app.netlify.com/sites/ezscan/deploys)

![Build Status](https://github.com/sfluor/ezscan/workflows/Node%20CI/badge.svg?branch=master)


### Serve locally

Run `yarn serve`

### Tests

To run tests you can do `yarn test`

### Format

To format the code you can do `yarn format`

## Todos


- images imported instead of public dir
- do not operate on the canvas image (can loose precision) (just use it as a mean to know where the user wants to distort) but use a bigger canvas when doing the distortion
- allow to reorder images / have more than one images / delete images
- allow to rotate images
- auto detect borders
- precommit hooks
- typescript
- export to PDF
- compress images
- friendlier UI (home page, list of screens, etc.)
- favicon
- manifest.json for SPA like on android
- bundle JSpdf correctly
- remove capture='camera' to allow to import gallery images on mobile
- performances
