<h1 align="center">
   <b>
        Keepo cli
   </b>
</h1>

<p align="center">A convenient way to manage secrets and use .keep files.</p>
<br />

<div align="center">

[![build][build-image]](build)
[![coverage:functions][coverage:functions-image]](coverage)
[![coverage:statements][coverage:statements-image]](coverage)
[![coverage:lines][coverage:lines-image]](coverage)
[![coverage:branches][coverage:branches-image]](coverage)
[![License][license-image]][license-url]

[build-image]: https://img.shields.io/github/actions/workflow/status/arashabdighafoori/keepo-cli/jest.yml?label=build&branch=main
[coverage:functions-image]: ./coverage/badge-functions.svg
[coverage:statements-image]: ./coverage/badge-statements.svg
[coverage:lines-image]: ./coverage/badge-lines.svg
[coverage:branches-image]: ./coverage/badge-branches.svg
[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/make-coverage-badge.svg

</div>

<br />

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [License](#license)

<br />

## Features

- Manage secrets easily
- Keep secrets encrypted and available only with keys
- List required values

<br />

## Installation

```
npm install -g keepo-cli
```

<br />

## Usage

If you have a .keep file in the repo and you know the encryption key, use `keepo init <your-encryption-key>` to initalize the directory. ( run the command in the directory with .keep file ).

To store a value, use `keepo set <key> <value>`
or use `keepo open` and edit the file in json format then save it.

To see the value of a given key, you can both use `keepo open` and then discard the file or `keepo get <key>`.
<br />

## License

[MIT](LICENSE)
