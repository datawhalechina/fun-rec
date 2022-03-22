/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const SourceNode = require("source-map").SourceNode;
const SourceMapConsumer = require("source-map").SourceMapConsumer;

const applySourceMap = function (
	sourceNode,
	sourceMapConsumer,
	sourceFile,
	removeGeneratedCodeForSourceFile
) {
	// The following notations are used to name stuff:
	// Left <------------> Middle <-------------------> Right
	// Input arguments:
	//        sourceNode                                       - Code mapping from Left to Middle
	//                   sourceFile                            - Name of a Middle file
	//                              sourceMapConsumer          - Code mapping from Middle to Right
	// Variables:
	//           l2m                      m2r
	// Left <-----------------------------------------> Right
	// Variables:
	//                       l2r

	const l2rResult = new SourceNode();
	const l2rOutput = [];

	const middleSourceContents = {};

	const m2rMappingsByLine = {};

	const rightSourceContentsSet = {};
	const rightSourceContentsLines = {};

	// Store all mappings by generated line
	sourceMapConsumer.eachMapping(
		function (mapping) {
			(m2rMappingsByLine[mapping.generatedLine] =
				m2rMappingsByLine[mapping.generatedLine] || []).push(mapping);
		},
		null,
		SourceMapConsumer.GENERATED_ORDER
	);

	const findM2rMapping = (line, column) => {
		const m2rMappings = m2rMappingsByLine[line];
		let l = 0;
		let r = m2rMappings.length;
		while (l < r) {
			let m = (l + r) >> 1;
			if (m2rMappings[m].generatedColumn <= column) {
				l = m + 1;
			} else {
				r = m;
			}
		}
		if (l === 0) return undefined;
		return m2rMappings[l - 1];
	};

	// Store all source contents
	sourceNode.walkSourceContents(function (source, content) {
		middleSourceContents["$" + source] = content;
	});

	const middleSource = middleSourceContents["$" + sourceFile];
	const middleSourceLines = middleSource ? middleSource.split("\n") : undefined;

	// Walk all left to middle mappings
	sourceNode.walk(function (chunk, middleMapping) {
		// Find a mapping from middle to right
		if (
			middleMapping.source === sourceFile &&
			middleMapping.line &&
			m2rMappingsByLine[middleMapping.line]
		) {
			// For minimized sources this is performance-relevant,
			// since all mappings are in a single line, use a binary search
			let m2rBestFit = findM2rMapping(middleMapping.line, middleMapping.column);
			if (m2rBestFit) {
				let allowMiddleName = false;
				let middleLine;
				let rightSourceContent;
				let rightSourceContentLines;
				const rightSource = m2rBestFit.source;
				// Check if we have middle and right source for this mapping
				// Then we could have an "identify" mapping
				if (
					middleSourceLines &&
					rightSource &&
					(middleLine = middleSourceLines[m2rBestFit.generatedLine - 1]) &&
					((rightSourceContentLines = rightSourceContentsLines[rightSource]) ||
						(rightSourceContent = sourceMapConsumer.sourceContentFor(
							rightSource,
							true
						)))
				) {
					if (!rightSourceContentLines) {
						rightSourceContentLines = rightSourceContentsLines[
							rightSource
						] = rightSourceContent.split("\n");
					}
					const rightLine =
						rightSourceContentLines[m2rBestFit.originalLine - 1];
					if (rightLine) {
						const offset = middleMapping.column - m2rBestFit.generatedColumn;
						if (offset > 0) {
							const middlePart = middleLine.slice(
								m2rBestFit.generatedColumn,
								middleMapping.column
							);
							const rightPart = rightLine.slice(
								m2rBestFit.originalColumn,
								m2rBestFit.originalColumn + offset
							);
							if (middlePart === rightPart) {
								// When original and generated code is equal we assume we have an "identity" mapping
								// In this case we can offset the original position
								m2rBestFit = Object.assign({}, m2rBestFit, {
									originalColumn: m2rBestFit.originalColumn + offset,
									generatedColumn: middleMapping.column,
									name: undefined
								});
							}
						}
						if (!m2rBestFit.name && middleMapping.name) {
							allowMiddleName =
								rightLine.slice(
									m2rBestFit.originalColumn,
									m2rBestFit.originalColumn + middleMapping.name.length
								) === middleMapping.name;
						}
					}
				}

				// Construct a left to right node from the found middle to right mapping
				let source = m2rBestFit.source;
				// Workaround for bug in source-map
				// null sources are incorrectly normalized to "."
				if (source && source !== ".") {
					l2rOutput.push(
						new SourceNode(
							m2rBestFit.originalLine,
							m2rBestFit.originalColumn,
							source,
							chunk,
							allowMiddleName ? middleMapping.name : m2rBestFit.name
						)
					);

					// Set the source contents once
					if (!("$" + source in rightSourceContentsSet)) {
						rightSourceContentsSet["$" + source] = true;
						const sourceContent = sourceMapConsumer.sourceContentFor(
							source,
							true
						);
						if (sourceContent) {
							l2rResult.setSourceContent(source, sourceContent);
						}
					}
					return;
				}
			}
		}

		if (
			(removeGeneratedCodeForSourceFile &&
				middleMapping.source === sourceFile) ||
			!middleMapping.source
		) {
			// Construct a left to middle node with only generated code
			// Because user do not want mappings to middle sources
			// Or this chunk has no mapping
			l2rOutput.push(chunk);
			return;
		}

		// Construct a left to middle node
		const source = middleMapping.source;
		l2rOutput.push(
			new SourceNode(
				middleMapping.line,
				middleMapping.column,
				source,
				chunk,
				middleMapping.name
			)
		);
		if ("$" + source in middleSourceContents) {
			if (!("$" + source in rightSourceContentsSet)) {
				l2rResult.setSourceContent(source, middleSourceContents["$" + source]);
				delete middleSourceContents["$" + source];
			}
		}
	});

	// Put output into the resulting SourceNode
	l2rResult.add(l2rOutput);
	return l2rResult;
};

module.exports = applySourceMap;
