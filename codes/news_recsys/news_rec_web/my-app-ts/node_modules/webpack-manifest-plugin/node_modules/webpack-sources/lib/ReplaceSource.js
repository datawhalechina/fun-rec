/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Source = require("./Source");
const { SourceNode } = require("source-map");
const { getSourceAndMap, getMap, getNode, getListMap } = require("./helpers");

class Replacement {
	constructor(start, end, content, insertIndex, name) {
		this.start = start;
		this.end = end;
		this.content = content;
		this.insertIndex = insertIndex;
		this.name = name;
	}
}

class ReplaceSource extends Source {
	constructor(source, name) {
		super();
		this._source = source;
		this._name = name;
		/** @type {Replacement[]} */
		this._replacements = [];
		this._isSorted = true;
	}

	getName() {
		return this._name;
	}

	getReplacements() {
		const replacements = Array.from(this._replacements);
		replacements.sort((a, b) => {
			return a.insertIndex - b.insertIndex;
		});
		return replacements;
	}

	replace(start, end, newValue, name) {
		if (typeof newValue !== "string")
			throw new Error(
				"insertion must be a string, but is a " + typeof newValue
			);
		this._replacements.push(
			new Replacement(start, end, newValue, this._replacements.length, name)
		);
		this._isSorted = false;
	}

	insert(pos, newValue, name) {
		if (typeof newValue !== "string")
			throw new Error(
				"insertion must be a string, but is a " +
					typeof newValue +
					": " +
					newValue
			);
		this._replacements.push(
			new Replacement(pos, pos - 1, newValue, this._replacements.length, name)
		);
		this._isSorted = false;
	}

	source() {
		return this._replaceString(this._source.source());
	}

	map(options) {
		if (this._replacements.length === 0) {
			return this._source.map(options);
		}
		return getMap(this, options);
	}

	sourceAndMap(options) {
		if (this._replacements.length === 0) {
			return this._source.sourceAndMap(options);
		}
		return getSourceAndMap(this, options);
	}

	original() {
		return this._source;
	}

	_sortReplacements() {
		if (this._isSorted) return;
		this._replacements.sort(function (a, b) {
			const diff1 = b.end - a.end;
			if (diff1 !== 0) return diff1;
			const diff2 = b.start - a.start;
			if (diff2 !== 0) return diff2;
			return b.insertIndex - a.insertIndex;
		});
		this._isSorted = true;
	}

	_replaceString(str) {
		if (typeof str !== "string")
			throw new Error(
				"str must be a string, but is a " + typeof str + ": " + str
			);
		this._sortReplacements();
		const result = [str];
		this._replacements.forEach(function (repl) {
			const remSource = result.pop();
			const splitted1 = this._splitString(remSource, Math.floor(repl.end + 1));
			const splitted2 = this._splitString(splitted1[0], Math.floor(repl.start));
			result.push(splitted1[1], repl.content, splitted2[0]);
		}, this);

		// write out result array in reverse order
		let resultStr = "";
		for (let i = result.length - 1; i >= 0; --i) {
			resultStr += result[i];
		}
		return resultStr;
	}

	node(options) {
		const node = getNode(this._source, options);
		if (this._replacements.length === 0) {
			return node;
		}
		this._sortReplacements();
		const replace = new ReplacementEnumerator(this._replacements);
		const output = [];
		let position = 0;
		const sources = Object.create(null);
		const sourcesInLines = Object.create(null);

		// We build a new list of SourceNodes in "output"
		// from the original mapping data

		const result = new SourceNode();

		// We need to add source contents manually
		// because "walk" will not handle it
		node.walkSourceContents(function (sourceFile, sourceContent) {
			result.setSourceContent(sourceFile, sourceContent);
			sources["$" + sourceFile] = sourceContent;
		});

		const replaceInStringNode = this._replaceInStringNode.bind(
			this,
			output,
			replace,
			function getOriginalSource(mapping) {
				const key = "$" + mapping.source;
				let lines = sourcesInLines[key];
				if (!lines) {
					const source = sources[key];
					if (!source) return null;
					lines = source.split("\n").map(function (line) {
						return line + "\n";
					});
					sourcesInLines[key] = lines;
				}
				// line is 1-based
				if (mapping.line > lines.length) return null;
				const line = lines[mapping.line - 1];
				return line.substr(mapping.column);
			}
		);

		node.walk(function (chunk, mapping) {
			position = replaceInStringNode(chunk, position, mapping);
		});

		// If any replacements occur after the end of the original file, then we append them
		// directly to the end of the output
		const remaining = replace.footer();
		if (remaining) {
			output.push(remaining);
		}

		result.add(output);

		return result;
	}

	listMap(options) {
		let map = getListMap(this._source, options);
		this._sortReplacements();
		let currentIndex = 0;
		const replacements = this._replacements;
		let idxReplacement = replacements.length - 1;
		let removeChars = 0;
		map = map.mapGeneratedCode(function (str) {
			const newCurrentIndex = currentIndex + str.length;
			if (removeChars > str.length) {
				removeChars -= str.length;
				str = "";
			} else {
				if (removeChars > 0) {
					str = str.substr(removeChars);
					currentIndex += removeChars;
					removeChars = 0;
				}
				let finalStr = "";
				while (
					idxReplacement >= 0 &&
					replacements[idxReplacement].start < newCurrentIndex
				) {
					const repl = replacements[idxReplacement];
					const start = Math.floor(repl.start);
					const end = Math.floor(repl.end + 1);
					const before = str.substr(0, Math.max(0, start - currentIndex));
					if (end <= newCurrentIndex) {
						const after = str.substr(Math.max(0, end - currentIndex));
						finalStr += before + repl.content;
						str = after;
						currentIndex = Math.max(currentIndex, end);
					} else {
						finalStr += before + repl.content;
						str = "";
						removeChars = end - newCurrentIndex;
					}
					idxReplacement--;
				}
				str = finalStr + str;
			}
			currentIndex = newCurrentIndex;
			return str;
		});
		let extraCode = "";
		while (idxReplacement >= 0) {
			extraCode += replacements[idxReplacement].content;
			idxReplacement--;
		}
		if (extraCode) {
			map.add(extraCode);
		}
		return map;
	}

	_splitString(str, position) {
		return position <= 0
			? ["", str]
			: [str.substr(0, position), str.substr(position)];
	}

	_replaceInStringNode(
		output,
		replace,
		getOriginalSource,
		node,
		position,
		mapping
	) {
		let original = undefined;

		do {
			let splitPosition = replace.position - position;
			// If multiple replaces occur in the same location then the splitPosition may be
			// before the current position for the subsequent splits. Ensure it is >= 0
			if (splitPosition < 0) {
				splitPosition = 0;
			}
			if (splitPosition >= node.length || replace.done) {
				if (replace.emit) {
					const nodeEnd = new SourceNode(
						mapping.line,
						mapping.column,
						mapping.source,
						node,
						mapping.name
					);
					output.push(nodeEnd);
				}
				return position + node.length;
			}

			const originalColumn = mapping.column;

			// Try to figure out if generated code matches original code of this segement
			// If this is the case we assume that it's allowed to move mapping.column
			// Because getOriginalSource can be expensive we only do it when neccessary

			let nodePart;
			if (splitPosition > 0) {
				nodePart = node.slice(0, splitPosition);
				if (original === undefined) {
					original = getOriginalSource(mapping);
				}
				if (
					original &&
					original.length >= splitPosition &&
					original.startsWith(nodePart)
				) {
					mapping.column += splitPosition;
					original = original.substr(splitPosition);
				}
			}

			const emit = replace.next();
			if (!emit) {
				// Stop emitting when we have found the beginning of the string to replace.
				// Emit the part of the string before splitPosition
				if (splitPosition > 0) {
					const nodeStart = new SourceNode(
						mapping.line,
						originalColumn,
						mapping.source,
						nodePart,
						mapping.name
					);
					output.push(nodeStart);
				}

				// Emit the replacement value
				if (replace.value) {
					output.push(
						new SourceNode(
							mapping.line,
							mapping.column,
							mapping.source,
							replace.value,
							mapping.name || replace.name
						)
					);
				}
			}

			// Recurse with remainder of the string as there may be multiple replaces within a single node
			node = node.substr(splitPosition);
			position += splitPosition;
			// eslint-disable-next-line no-constant-condition
		} while (true);
	}

	updateHash(hash) {
		this._sortReplacements();
		hash.update("ReplaceSource");
		this._source.updateHash(hash);
		hash.update(this._name || "");
		for (const repl of this._replacements) {
			hash.update(`${repl.start}`);
			hash.update(`${repl.end}`);
			hash.update(`${repl.content}`);
			hash.update(`${repl.insertIndex}`);
			hash.update(`${repl.name}`);
		}
	}
}

class ReplacementEnumerator {
	/**
	 * @param {Replacement[]} replacements list of replacements
	 */
	constructor(replacements) {
		this.replacements = replacements || [];
		this.index = this.replacements.length;
		this.done = false;
		this.emit = false;
		// Set initial start position
		this.next();
	}

	next() {
		if (this.done) return true;
		if (this.emit) {
			// Start point found. stop emitting. set position to find end
			const repl = this.replacements[this.index];
			const end = Math.floor(repl.end + 1);
			this.position = end;
			this.value = repl.content;
			this.name = repl.name;
		} else {
			// End point found. start emitting. set position to find next start
			this.index--;
			if (this.index < 0) {
				this.done = true;
			} else {
				const nextRepl = this.replacements[this.index];
				const start = Math.floor(nextRepl.start);
				this.position = start;
			}
		}
		if (this.position < 0) this.position = 0;
		this.emit = !this.emit;
		return this.emit;
	}

	footer() {
		if (!this.done && !this.emit) this.next(); // If we finished _replaceInNode mid emit we advance to next entry
		if (this.done) {
			return [];
		} else {
			let resultStr = "";
			for (let i = this.index; i >= 0; i--) {
				const repl = this.replacements[i];
				// this doesn't need to handle repl.name, because in SourceMaps generated code
				// without pointer to original source can't have a name
				resultStr += repl.content;
			}
			return resultStr;
		}
	}
}

module.exports = ReplaceSource;
