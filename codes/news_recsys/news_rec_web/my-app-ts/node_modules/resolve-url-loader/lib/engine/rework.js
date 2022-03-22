/*
 * MIT License http://opensource.org/licenses/MIT
 * Author: Ben Holloway @bholloway
 */
'use strict';

var path    = require('path'),
    convert = require('convert-source-map');

var fileProtocol = require('../file-protocol');

var rework = requireOptionalPeerDependency('rework'),
    visit  = requireOptionalPeerDependency('rework-visit');

/**
 * Process the given CSS content into reworked CSS content.
 *
 * @param {string} sourceFile The absolute path of the file being processed
 * @param {string} sourceContent CSS content without source-map
 * @param {{outputSourceMap: boolean, transformDeclaration:function, absSourceMap:object,
 *        sourceMapConsumer:object}} params Named parameters
 * @return {{content: string, map: object}} Reworked CSS and optional source-map
 */
function process(sourceFile, sourceContent, params) {

  // embed source-map in css
  //  prepend file protocol to all sources to avoid problems with source map
  var contentWithMap = sourceContent + (
    params.absSourceMap ?
      convert.fromObject(fileProtocol.prepend(params.absSourceMap)).toComment({multiline: true}) :
      ''
  );

  // need to prepend file protocol to source as well to avoid problems with source map
  var reworked = rework(contentWithMap, {source: fileProtocol.prepend(sourceFile)})
    .use(reworkPlugin)
    .toString({
      sourcemap        : params.outputSourceMap,
      sourcemapAsObject: params.outputSourceMap
    });

  // complete with source-map
  if (params.outputSourceMap) {
    return {
      content: reworked.code,
      map    : fileProtocol.remove(reworked.map)
    };
  }
  // complete without source-map
  else {
    return {
      content: reworked,
      map    : null
    };
  }

  /**
   * Plugin for css rework that follows SASS transpilation.
   *
   * @param {object} stylesheet AST for the CSS output from SASS
   */
  function reworkPlugin(stylesheet) {

    // visit each node (selector) in the stylesheet recursively using the official utility method
    //  each node may have multiple declarations
    visit(stylesheet, function visitor(declarations) {
      if (declarations) {
        declarations.forEach(eachDeclaration);
      }
    });

    /**
     * Process a declaration from the syntax tree.
     * @param declaration
     */
    function eachDeclaration(declaration) {
      var isValid = declaration.value && (declaration.value.indexOf('url') >= 0);
      if (isValid) {
        declaration.value = params.transformDeclaration(declaration.value, getPathsAtChar);
      }

      /**
       * Create a hash of base path strings.
       *
       * Position in the declaration is not supported since rework does not refine sourcemaps to this detail.
       *
       * @throws Error on invalid source map
       * @returns {{selector:string, property:string}} Hash of base path strings
       */
      function getPathsAtChar() {
        var posSelector = declaration.parent && declaration.parent.position.start,
            posProperty = declaration.position.start;

        var result = {
          property: positionToOriginalDirectory(posProperty),
          selector: positionToOriginalDirectory(posSelector)
        };

        var isValid = [result.property, result.selector].every(Boolean);
        if (isValid) {
          return result;
        }
        else if (params.sourceMapConsumer) {
          throw new Error('source-map information is not available at url() declaration');
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

/**
 * Require the given filename but fail with an error that `requireOptionalPeerDependencies` must be installed.
 *
 * @param moduleName The module to require
 * @returns {*} The module
 * @throws Error when module is not found
 */
function requireOptionalPeerDependency(moduleName) {
  try {
    return require(moduleName);
  }
  catch (error) {
    if (error.message === 'Cannot find module \'' + moduleName + '\'') {
      throw new Error('to use the "rework" engine you must install the optionalPeerDependencies');
    }
    else {
      throw error;
    }
  }
}
