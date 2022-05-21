# ezscan

[![Netlify Status](https://api.netlify.com/api/v1/badges/50a74bb9-f1a7-4b41-b9a2-5c8f6fafda8d/deploy-status)](https://app.netlify.com/sites/ezscan/deploys)

![Build Status](https://github.com/sfluor/ezscan/workflows/Node%20CI/badge.svg?branch=master)


### Serve locally

Run `yarn start`

### Tests

To run tests you can do `yarn test`

### Format

To format the code you can do `yarn lint-fix`

## Todos


- figure out why we can't load big images
- fix PDF save if the image is horizontal
- name PDF output
- tune PDF parameters (sizes / more than one image per page. etc)
- center image
- show loading
- translation in french
- fix the favicon
- use a web worker for distorting
- images imported instead of public dir
- auto detect borders
- precommit hooks
- compress images
- friendlier UI (home page, list of screens, etc.)
- favicon
- manifest.json for SPA like on android
- bundle JSpdf correctly
- fix camera input on firefox mobile
- performances
