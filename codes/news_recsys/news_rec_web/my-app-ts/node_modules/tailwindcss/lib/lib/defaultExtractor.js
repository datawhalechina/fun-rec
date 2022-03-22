"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultExtractor = defaultExtractor;
const PATTERNS = [
    /(?:\['([^'\s]+[^<>"'`\s:\\])')/.source,
    /(?:\["([^"\s]+[^<>"'`\s:\\])")/.source,
    /(?:\[`([^`\s]+[^<>"'`\s:\\])`)/.source,
    /([^<>"'`\s]*\[\w*'[^"`\s]*'?\])/.source,
    /([^<>"'`\s]*\[\w*"[^'`\s]*"?\])/.source,
    /([^<>"'`\s]*\[\w*\('[^"'`\s]*'\)\])/.source,
    /([^<>"'`\s]*\[\w*\("[^"'`\s]*"\)\])/.source,
    /([^<>"'`\s]*\[\w*\('[^"`\s]*'\)\])/.source,
    /([^<>"'`\s]*\[\w*\("[^'`\s]*"\)\])/.source,
    /([^<>"'`\s]*\[[^<>"'`\s]*\('[^"`\s]*'\)+\])/.source,
    /([^<>"'`\s]*\[[^<>"'`\s]*\("[^'`\s]*"\)+\])/.source,
    /([^<>"'`\s]*\['[^"'`\s]*'\])/.source,
    /([^<>"'`\s]*\["[^"'`\s]*"\])/.source,
    /([^<>"'`\s]*\[[^<>"'`\s]*:[^\]\s]*\])/.source,
    /([^<>"'`\s]*\[[^<>"'`\s]*:'[^"'`\s]*'\])/.source,
    /([^<>"'`\s]*\[[^<>"'`\s]*:"[^"'`\s]*"\])/.source,
    /([^<>"'`\s]*\[[^"'`\s]+\][^<>"'`\s]*)/.source,
    /([^"'`\s]*[^<>"'`\s:\\])/.source,
    /([^<>"'`\s]*[^"'`\s:\\])/.source, 
].join('|');
const BROAD_MATCH_GLOBAL_REGEXP = new RegExp(PATTERNS, 'g');
const INNER_MATCH_GLOBAL_REGEXP = /[^<>"'`\s.(){}[\]#=%$]*[^<>"'`\s.(){}[\]#=%:$]/g;
function defaultExtractor(content) {
    let broadMatches = content.matchAll(BROAD_MATCH_GLOBAL_REGEXP);
    let innerMatches = content.match(INNER_MATCH_GLOBAL_REGEXP) || [];
    let results = [
        ...broadMatches,
        ...innerMatches
    ].flat().filter((v)=>v !== undefined
    );
    return results;
} // Regular utilities
 // {{modifier}:}*{namespace}{-{suffix}}*{/{opacityModifier}}?
 // Arbitrary values
 // {{modifier}:}*{namespace}-[{arbitraryValue}]{/{opacityModifier}}?
 // arbitraryValue: no whitespace, balanced quotes unless within quotes, balanced brackets unless within quotes
 // Arbitrary properties
 // {{modifier}:}*[{validCssPropertyName}:{arbitraryValue}]
