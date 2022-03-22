# Changes to PostCSS Lab Function

### 4.1.2 (March 8, 2022)

- Fix gamut mapping giving overly unsaturated colors.
- Implement powerless color components in gamut mapping.

### 4.1.1 (February 15, 2022)

- Fix plugin name

### 4.1.0 (February 12, 2022)

- Add gamut mapping for out of gamut colors.
- Add conversion to `display-p3` as a wider gamut fallback.

[Read more about out of gamut colors](https://github.com/csstools/postcss-plugins/blob/main/plugins/postcss-lab-function/README.md#out-of-gamut-colors)

[Read more about `color(display-p3 0 0 0)`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color())

```css
.color-lab {
	color: lab(40% 56.6 39);
}

/* with a display-p3 fallback : */
.color {
	color: rgb(179, 35, 35);
	color: color(display-p3 0.64331 0.19245 0.16771);
}
```

### 4.0.4 (February 5, 2022)

- Improved `es module` and `commonjs` compatibility

### 4.0.3 (January 2, 2022)

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 4.0.2 (December 13, 2021)

- Changed: now uses `postcss-value-parser` for parsing.
- Updated: documentation
- Added: support for CSS variables with `preserve: true` option.
- Fixed: Hue values with units in `lch` functions are now correctly handled.
- Fixed: Rounding of values to match current browser behavior.

### 4.0.1 (November 18, 2021)

- Added: Safeguards against postcss-values-parser potentially throwing an error.
- Updated: postcss-value-parser to 6.0.1 (patch)

### 4.0.0 (September 17, 2021)

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 3.1.2 (April 25, 2020)

- Updated: Publish

### 3.1.1 (April 25, 2020)

- Updated: Using `walkType` to evade walker bug in `postcss-values-parser`

### 3.1.0 (April 25, 2020)

- Updated: `postcss-values-parser` to 3.2.0 (minor).

### 3.0.1 (April 12, 2020)

- Updated: Ownership moved to CSSTools.

### 3.0.0 (April 12, 2020)

- Updated: `postcss-values-parser` to 3.1.1 (major).
- Updated: Node support to 10.0.0 (major).
- Updated: Feature to use new percentage syntax.
- Removed: Support for the removed `gray()` function.

### 2.0.1 (September 18, 2018)

- Updated: PostCSS Values Parser 2.0.0

### 2.0.0 (September 17, 2018)

- Updated: Support for PostCSS 7+
- Updated: Support for Node 6+

### 1.1.0 (July 24, 2018)

- Added: Support for `gray(a / b)` as `lab(a 0 0 / b)`

### 1.0.1 (May 11, 2018)

- Fixed: Values beyond the acceptable 0-255 RGB range

### 1.0.0 (May 11, 2018)

- Initial version
