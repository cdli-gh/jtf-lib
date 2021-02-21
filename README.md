[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

## jtf-lib

NodeJS package and CLI for the JTF format.

### JTF format

JTF (JSON transliteration format) is a JSON-based format designed for storing cuneiform textual data and metadata. It builds on [ATF](http://oracc.museum.upenn.edu/doc/help/editinginatf/index.html), a text-based transliteration format used for cuneiform texts in [CDLI](http://www.cdli.ucla.edu/) and [ORACC](http://oracc.museum.upenn.edu).

The advantage of JTF is that it provides a deep JSON mapping for cuneiform data, making processing, modification, extension, mapping to other formats, and other common tasks more simple.

<!-- ToDo: Add details, JTF format description and schema -->

### Package Functions

- ATF parser and converter to JTF (uses [NearlyJS](https://nearley.js.org/)).
- JTF Autoformatter
- Signlist search

<!-- 
ToDo: Add tutorial.
- Installation
- Command line API
- Use in NodeJS applications
- Use in Python
-->

### Installation

[Install](https://nodejs.org/en/download/) NodeJS.

Install jtf-lib:
`npm install cdli-gh/jtf-lib` 

With yarn:
`yarn add cdli-gh/jtf-lib`
<!-- ToDo: Register npm package at www.npmjs.com -->

<!--
### Quick start

Command line:

- Convert ATF to JTF
- Load, save etc.
- CRUD functions

--> 

### About
By Ilya Khait. Published under the [MIT Licence](https://opensource.org/licenses/MIT).