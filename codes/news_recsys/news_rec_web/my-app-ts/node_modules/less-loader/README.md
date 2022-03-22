<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# less-loader

A Less loader for webpack. Compiles Less to CSS.

## Getting Started

To begin, you'll need to install `less` and `less-loader`:

```console
$ npm install less less-loader --save-dev
```

Then add the loader to your `webpack` config. For example:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        loader: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
    ],
  },
};
```

And run `webpack` via your preferred method.

## Options

|                   Name                    |         Type         |         Default          | Description                                            |
| :---------------------------------------: | :------------------: | :----------------------: | :----------------------------------------------------- |
|     **[`lessOptions`](#lessoptions)**     | `{Object\|Function}` | `{ relativeUrls: true }` | Options for Less.                                      |
|  **[`additionalData`](#additionalData)**  | `{String\|Function}` |       `undefined`        | Prepends/Appends `Less` code to the actual entry file. |
|       **[`sourceMap`](#sourcemap)**       |     `{Boolean}`      |    `compiler.devtool`    | Enables/Disables generation of source maps.            |
| **[`webpackImporter`](#webpackimporter)** |     `{Boolean}`      |          `true`          | Enables/Disables the default Webpack importer.         |
|  **[`implementation`](#implementation)**  |  `{Object\|String}`  |          `less`          | Setup Less implementation to use.                      |

### `lessOptions`

Type: `Object|Function`
Default: `{ relativeUrls: true }`

You can pass any Less specific options to the `less-loader` through the `lessOptions` property in the [loader options](https://webpack.js.org/configuration/module/#rule-options-rule-query). See the [Less documentation](http://lesscss.org/usage/#command-line-usage-options) for all available options in dash-case. Since we're passing these options to Less programmatically, you need to pass them in camelCase here:

#### `Object`

Use an object to pass options through to Less.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
      },
    ],
  },
};
```

#### `Function`

Allows setting the options passed through to Less based off of the loader context.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: (loaderContext) => {
                // More information about available properties https://webpack.js.org/api/loaders/
                const { resourcePath, rootContext } = loaderContext;
                const relativePath = path.relative(rootContext, resourcePath);

                if (relativePath === "styles/foo.less") {
                  return {
                    paths: ["absolute/path/c", "absolute/path/d"],
                  };
                }

                return {
                  paths: ["absolute/path/a", "absolute/path/b"],
                };
              },
            },
          },
        ],
      },
    ],
  },
};
```

### `additionalData`

Type: `String|Function`
Default: `undefined`

Prepends `Less` code before the actual entry file.
In this case, the `less-loader` will not override the source but just **prepend** the entry's content.

This is especially useful when some of your Less variables depend on the environment:

> ℹ Since you're injecting code, this will break the source mappings in your entry file. Often there's a simpler solution than this, like multiple Less entry files.

#### `String`

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              additionalData: `@env: ${process.env.NODE_ENV};`,
            },
          },
        ],
      },
    ],
  },
};
```

#### `Function`

##### Sync

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              additionalData: (content, loaderContext) => {
                // More information about available properties https://webpack.js.org/api/loaders/
                const { resourcePath, rootContext } = loaderContext;
                const relativePath = path.relative(rootContext, resourcePath);

                if (relativePath === "styles/foo.less") {
                  return "@value: 100px;" + content;
                }

                return "@value: 200px;" + content;
              },
            },
          },
        ],
      },
    ],
  },
};
```

##### Async

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              additionalData: async (content, loaderContext) => {
                // More information about available properties https://webpack.js.org/api/loaders/
                const { resourcePath, rootContext } = loaderContext;
                const relativePath = path.relative(rootContext, resourcePath);

                if (relativePath === "styles/foo.less") {
                  return "@value: 100px;" + content;
                }

                return "@value: 200px;" + content;
              },
            },
          },
        ],
      },
    ],
  },
};
```

### `sourceMap`

Type: `Boolean`
Default: depends on the `compiler.devtool` value

By default generation of source maps depends on the [`devtool`](https://webpack.js.org/configuration/devtool/) option. All values enable source map generation except `eval` and `false` value.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};
```

### `webpackImporter`

Type: `Boolean`
Default: `true`

Enables/Disables the default `webpack` importer.

This can improve performance in some cases. Use it with caution because aliases and `@import` at-rules starting with `~` will not work.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              webpackImporter: false,
            },
          },
        ],
      },
    ],
  },
};
```

### `implementation`

Type: `Object | String`

> ⚠ less-loader compatible with Less 3 and 4 versions

The special `implementation` option determines which implementation of Less to use. Overrides the locally installed `peerDependency` version of `less`.

**This option is only really useful for downstream tooling authors to ease the Less 3-to-4 transition.**

#### Object

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              implementation: require("less"),
            },
          },
        ],
      },
    ],
  },
};
```

#### String

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              implementation: require.resolve("less"),
            },
          },
        ],
      },
    ],
  },
};
```

## Examples

### Normal usage

Chain the `less-loader` with the [`css-loader`](https://github.com/webpack-contrib/css-loader) and the [`style-loader`](https://github.com/webpack-contrib/style-loader) to immediately apply all styles to the DOM.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
          },
        ],
      },
    ],
  },
};
```

Unfortunately, Less doesn't map all options 1-by-1 to camelCase. When in doubt, [check their executable](https://github.com/less/less.js/blob/3.x/bin/lessc) and search for the dash-case option.

### Source maps

To enable sourcemaps for CSS, you'll need to pass the `sourceMap` property in the loader's options. If this is not passed, the loader will respect the setting for webpack source maps, set in `devtool`.

**webpack.config.js**

```js
module.exports = {
  devtool: "source-map", // any "source-map"-like devtool is possible
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};
```

If you want to edit the original Less files inside Chrome, [there's a good blog post](https://medium.com/@toolmantim/getting-started-with-css-sourcemaps-and-in-browser-sass-editing-b4daab987fb0). The blog post is about Sass but it also works for Less.

### In production

Usually, it's recommended to extract the style sheets into a dedicated file in production using the [MiniCssExtractPlugin](https://github.com/webpack-contrib/mini-css-extract-plugin). This way your styles are not dependent on JavaScript.

### Imports

First we try to use built-in `less` resolve logic, then `webpack` resolve logic (aliases and `~`).

#### Webpack Resolver

`webpack` provides an [advanced mechanism to resolve files](https://webpack.js.org/configuration/resolve/).
`less-loader` applies a Less plugin that passes all queries to the webpack resolver if `less` could not resolve `@import`.
Thus you can import your Less modules from `node_modules`.

```css
@import "bootstrap/less/bootstrap";
```

Using `~` is deprecated and can be removed from your code (**we recommend it**), but we still support it for historical reasons.
Why you can removed it? The loader will first try to resolve `@import` as relative, if it cannot be resolved, the loader will try to resolve `@import` inside [`node_modules`](https://webpack.js.org/configuration/resolve/#resolve-modules).
Just prepend them with a `~` which tells webpack to look up the [`modules`](https://webpack.js.org/configuration/resolve/#resolve-modules).

```css
@import "~bootstrap/less/bootstrap";
```

Default resolver options can be modified by [`resolve.byDependency`](https://webpack.js.org/configuration/resolve/#resolvebydependency):

**webpack.config.js**

```js
module.exports = {
  devtool: "source-map", // any "source-map"-like devtool is possible
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  resolve: {
    byDependency: {
      // More options can be found here https://webpack.js.org/configuration/resolve/
      less: {
        mainFiles: ["custom"],
      },
    },
  },
};
```

It's important to only prepend it with `~`, because `~/` resolves to the home-directory. webpack needs to distinguish between `bootstrap` and `~bootstrap`, because CSS and Less files have no special syntax for importing relative files. Writing `@import "file"` is the same as `@import "./file";`

#### Less Resolver

If you specify the `paths` option, modules will be searched in the given `paths`. This is `less` default behavior. `paths` should be an array with absolute paths:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                paths: [path.resolve(__dirname, "node_modules")],
              },
            },
          },
        ],
      },
    ],
  },
};
```

### Plugins

In order to use [plugins](http://lesscss.org/usage/#plugins), simply set the `plugins` option like this:

**webpack.config.js**

```js
const CleanCSSPlugin = require('less-plugin-clean-css');

module.exports = {
  ...
    {
      loader: 'less-loader',
      options: {
        lessOptions: {
          plugins: [
            new CleanCSSPlugin({ advanced: true }),
          ],
        },
      },
    },
  ...
};
```

> ℹ️ Access to the [loader context](https://webpack.js.org/api/loaders/#the-loader-context) inside the custom plugin can be done using the `pluginManager.webpackLoaderContext` property.

```js
module.exports = {
  install: function (less, pluginManager, functions) {
    functions.add("pi", function () {
      // Loader context is available in `pluginManager.webpackLoaderContext`

      return Math.PI;
    });
  },
};
```

### Extracting style sheets

Bundling CSS with webpack has some nice advantages like referencing images and fonts with hashed urls or [hot module replacement](https://webpack.js.org/concepts/hot-module-replacement/) in development. In production, on the other hand, it's not a good idea to apply your style sheets depending on JS execution. Rendering may be delayed or even a [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) might be visible. Thus it's often still better to have them as separate files in your final production build.

There are two possibilities to extract a style sheet from the bundle:

- [`extract-loader`](https://github.com/peerigon/extract-loader) (simpler, but specialized on the css-loader's output)
- [MiniCssExtractPlugin](https://github.com/webpack-contrib/mini-css-extract-plugin) (more complex, but works in all use-cases)

### CSS modules gotcha

There is a known problem with Less and [CSS modules](https://github.com/css-modules/css-modules) regarding relative file paths in `url(...)` statements. [See this issue for an explanation](https://github.com/webpack-contrib/less-loader/issues/109#issuecomment-253797335).

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/less-loader.svg
[npm-url]: https://npmjs.com/package/less-loader
[node]: https://img.shields.io/node/v/less-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/less-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/less-loader
[tests]: https://github.com/webpack-contrib/less-loader/workflows/less-loader/badge.svg
[tests-url]: https://github.com/webpack-contrib/less-loader/actions
[cover]: https://codecov.io/gh/webpack-contrib/less-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/less-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=less-loader
[size-url]: https://packagephobia.now.sh/result?p=less-loader
