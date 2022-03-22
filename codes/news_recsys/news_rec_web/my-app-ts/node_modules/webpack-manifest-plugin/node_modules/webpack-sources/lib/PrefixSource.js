/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Source = require("./Source");
const RawSource = require("./RawSource");
const { SourceNode } = require("source-map");
const { getSourceAndMap, getMap } = require("./helpers");

const REPLACE_REGEX = /\n(?=.|\s)/g;

class PrefixSource extends Source {
	constructor(prefix, source) {
		super();
		this._source =
			typeof source === "string" || Buffer.isBuffer(source)
				? new RawSource(source, true)
				: source;
		this._prefix = prefix;
	}

	getPrefix() {
		return this._prefix;
	}

	original() {
		return this._source;
	}

	source() {
		const node = this._source.source();
		const prefix = this._prefix;
		return prefix + node.replace(REPLACE_REGEX, "\n" + prefix);
	}

	// TODO efficient buffer() implementation

	map(options) {
		return getMap(this, options);
	}

	sourceAndMap(options) {
		return getSourceAndMap(this, options);
	}

	node(options) {
		const node = this._source.node(options);
		const prefix = this._prefix;
		const output = [];
		const result = new SourceNode();
		node.walkSourceContents(function (source, content) {
			result.setSourceContent(source, content);
		});
		let needPrefix = true;
		node.walk(function (chunk, mapping) {
			const parts = chunk.split(/(\n)/);
			for (let i = 0; i < parts.length; i += 2) {
				const nl = i + 1 < parts.length;
				const part = parts[i] + (nl ? "\n" : "");
				if (part) {
					if (needPrefix) {
						output.push(prefix);
					}
					output.push(
						new SourceNode(
							mapping.line,
							mapping.column,
							mapping.source,
							part,
							mapping.name
						)
					);
					needPrefix = nl;
				}
			}
		});
		result.add(output);
		return result;
	}

	listMap(options) {
		const prefix = this._prefix;
		const map = this._source.listMap(options);
		let prefixNextLine = true;
		return map.mapGeneratedCode(function (code) {
			let updatedCode = code.replace(REPLACE_REGEX, "\n" + prefix);
			if (prefixNextLine) updatedCode = prefix + updatedCode;
			prefixNextLine = code.charCodeAt(code.length - 1) === 10; // === /\n$/.test(code)
			return updatedCode;
		});
	}

	updateHash(hash) {
		hash.update("PrefixSource");
		this._source.updateHash(hash);
		hash.update(this._prefix);
	}
}

module.exports = PrefixSource;
