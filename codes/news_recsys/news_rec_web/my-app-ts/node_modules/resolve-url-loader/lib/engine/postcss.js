/*
 * MIT License http://opensource.org/licenses/MIT
 * Author: Ben Holloway @bholloway
 */
'use strict';

var os      = require('os'),
    path    = require('path'),
    postcss = require('postcss');

var fileProtocol = require('../file-protocol');
var algerbra     = require('../position-algerbra');

var ORPHAN_CR_REGEX = /\r(?!\n)(.|\n)?/g;

/**
 * Process the given CSS content into reworked CSS content.
 *
 * @param {string} sourceFile The absolute path of the file being processed
 * @param {string} sourceContent CSS content without source-map
 * @param {{outputSourceMap: boolean, transformDeclaration:function, absSourceMap:object,
 *        sourceMapConsumer:object, removeCR:boolean}} params Named parameters
 * @return {{content: string, map: object}} Reworked CSS and optional source-map
 */
function process(sourceFile, sourceContent, params) {
  // #107 libsass emits orphan CR not considered newline, postcss does consider newline (content vs source-map mismatch)
  var correctedContent = params.removeCR && (os.EOL !== '\r') ?
    sourceContent.replace(ORPHAN_CR_REGEX, ' $1') :
    sourceContent;

  // prepend file protocol to all sources to avoid problems with source map
  return postcss([
    postcss.plugin('postcss-resolve-url', postcssPlugin)
  ])
    .process(correctedContent, {
      from: fileProtocol.prepend(sourceFile),
      map : params.outputSourceMap && {
        prev          : !!params.absSourceMap && fileProtocol.prepend(params.absSourceMap),
        inline        : false,
        annotation    : false,
        sourcesContent: true  // #98 sourcesContent missing from output map
      }
    })
    .then(result => ({
      content: result.css,
      map    : params.outputSourceMap ? fileProtocol.remove(result.map.toJSON()) : null
    }));

  /**
   * Plugin for postcss that follows SASS transpilation.
   */
  function postcssPlugin() {
    return function applyPlugin(styles) {
      styles.walkDecls(eachDeclaration);
    };

    /**
     * Process a declaration from the syntax tree.
     * @param declaration
     */
    function eachDeclaration(declaration) {
      var prefix,
          isValid = declaration.value && (declaration.value.indexOf('url') >= 0);
      if (isValid) {
        prefix = declaration.prop + declaration.raws.between;
        declaration.value = params.transformDeclaration(declaration.value, getPathsAtChar);
      }

      /**
       * Create a hash of base path strings.
       *
       * Position in the declaration is supported by postcss at the position of the url() statement.
       *
       * @param {number} index Index in the declaration value at which to evaluate
       * @throws Error on invalid source map
       * @returns {{subString:string, value:string, property:string, selector:string}} Hash of base path strings
       */
      function getPathsAtChar(index) {
        var subString    = declaration.value.slice(0, index),
            posSelector  = algerbra.sanitise(declaration.parent.source.start),
            posProperty  = algerbra.sanitise(declaration.source.start),
            posValue     = algerbra.add([posProperty, algerbra.strToOffset(prefix)]),
            posSubString = algerbra.add([posValue, algerbra.strToOffset(subString)]);

        var result = {
          subString: positionToOriginalDirectory(posSubString),
          value    : positionToOriginalDirectory(posValue),
          property : positionToOriginalDirectory(posProperty),
          selector : positionToOriginalDirectory(posSelector)
        };

        var isValid = [result.subString, result.value, result.property, result.selector].every(Boolean);
        if (isValid) {
          return result;
        }
        else if (params.sourceMapConsumer) {
          throw new Error(
            'source-map information is not available at url() declaration ' +
            (ORPHAN_CR_REGEX.test(sourceContent) ? '(found orphan CR, try removeCR option)' : '(no orphan CR found)')
          );
        } else {
          throw new Error('a valid source-map is not present (ensure preceding loaders output a source-map)');
        }
      }
    }
  }

  /**
   * Given an apparent position find the directory of the original file.
   *
   * @param startPosApparent {{line: number, column: number}}
   * @returns {false|string} Directory of original file or false on invalid
   */
  function positionToOriginalDirectory(startPosApparent) {
    // reverse the original source-map to find the original source file before transpilation
    var startPosOriginal =
      !!params.sourceMapConsumer &&
      params.sourceMapConsumer.originalPositionFor(startPosApparent);

    // we require a valid directory for the specified file
    var directory =
      !!startPosOriginal &&
      !!startPosOriginal.source &&
      fileProtocol.remove(path.dirname(startPosOriginal.source));

    return directory;
  }
}

module.exports = process;
