<!-- markdownlint-disable MD033 MD036 MD041 -->

![griko.id](https://www.datocms-assets.com/42475/1619221965-social.png)

<div align="center">

Website monorepo for <https://griko.id> and previous versions

</div>

---

**Table of contents**

- [Packages](#packages)
- [Dependencies](#dependencies)
- [Clone and prep locally](#clone-and-prep-locally)
- [Scope commands](#scope-commands)
- [Compliance](#compliance)
- [License](#license)

---

## Packages

- [eslint](./packages/eslint-config) - ESLint configuration with bundled dependencies
- [shared](./packages/shared) - Shared libraries, types, utilities, etc.
- [v7](./packages/v7) - Seventh version of my website

## Dependencies

- [Node.js LTS](https://nodejs.org)
  - `brew install fnm && fnm install --lts`
- [Yarn V1](https://classic.yarnpkg.com/lang/en)
  - `npm --global install yarn`
- [Lerna](https://github.com/lerna/lerna)
  - `yarn global add lerna`

## Clone and prep locally

- `gh repo clone grikomsn/griko.id`
- `cd griko.id`
- `yarn install` or `lerna bootstrap`
- `yarn lerna run validate`

## Scope commands

**Command format**

- `yarn <scope> <command>`

**v7 common scripts**

- `yarn v7 dev`
- `yarn v7 codegen --watch`

## Compliance

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fgrikomsn%2Fgriko.id.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fgrikomsn%2Fgriko.id?ref=badge_large)

## License

[MIT License, Copyright (c) 2021 Griko Nibras](./LICENSE)
