# Changes to PostCSS Is Pseudo Class

### 2.0.1 (March 5, 2022)

- Preserve selector order as much as possible. Fixes issues where pseudo elements `::before` were moved.

### 2.0.0 (January 31, 2022)

- Remove `skip` flag in `onComplexSelectors` option.

If a complex selector is encountered that has no known equivalent, it will always be skipped and preserved now.

The previous behavior was to remove `:is()` even if that broke the selector.

### 1.0.1 (January 17, 2022)

- Fix selector order

### 1.0.0 (January 13, 2022)

- initial release
