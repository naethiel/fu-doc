# Search MDN Documentation through the command line

Inspired by `go doc`, `tldr` and other CLI-oriented dev documentation, fu-doc is a small command line tool to quickly search through MDN docs.

It can output full MDN pages as markdown, but it is mostly useful to get a quick reminder on things like parameters, return values, usage etc without leaving your terminal.

**Warning:** This is an early stage project which is not yet published on NPM.

## Install

1. `git clone git@github.com:naethiel/fu-doc.git`
2. `cd fu-doc && npm i`
3. `npm run tsc` to build the dist from TS sources.
4. `npm link` to make it available as a global `fu-doc` command.

## Usage

`$ fu <query>`. 

## Example

Anything relative to JS, HTML, CSS:

`fu array.reduce`

`fu querySelector`

`fu flexbox`
etc ...

