/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Source = require("./Source");
const RawSource = require("./RawSource");
const { SourceNode, SourceMapConsumer } = require("source-map");
const { SourceListMap, fromStringWithSourceMap } = require("source-list-map");
const { getSourceAndMap, getMap } = require("./helpers");

const stringsAsRawSources = new WeakSet();

class ConcatSource extends Source {
	constructor() {
		super();
		this._children = [];
		for (let i = 0; i < arguments.length; i++) {
			const item = arguments[i];
			if (item instanceof ConcatSource) {
				for (const child of item._children) {
					this._children.push(child);
				}
			} else {
				this._children.push(item);
			}
		}
		this._isOptimized = arguments.length === 0;
	}

	getChildren() {
		if (!this._isOptimized) this._optimize();
		return this._children;
	}

	add(item) {
		if (item instanceof ConcatSource) {
			for (const child of item._children) {
				this._children.push(child);
			}
		} else {
			this._children.push(item);
		}
		this._isOptimized = false;
	}

	addAllSkipOptimizing(items) {
		for (const item of items) {
			this._children.push(item);
		}
	}

	buffer() {
		if (!this._isOptimized) this._optimize();
		const buffers = [];
		for (const child of this._children) {
			if (typeof child.buffer === "function") {
				buffers.push(child.buffer());
			} else {
				const bufferOrString = child.source();
				if (Buffer.isBuffer(bufferOrString)) {
					buffers.push(bufferOrString);
				} else {
					buffers.push(Buffer.from(bufferOrString, "utf-8"));
				}
			}
		}
		return Buffer.concat(buffers);
	}

	source() {
		if (!this._isOptimized) this._optimize();
		let source = "";
		for (const child of this._children) {
			source += child.source();
		}
		return source;
	}

	size() {
		if (!this._isOptimized) this._optimize();
		let size = 0;
		for (const child of this._children) {
			size += child.size();
		}
		return size;
	}

	map(options) {
		return getMap(this, options);
	}

	sourceAndMap(options) {
		return getSourceAndMap(this, options);
	}

	node(options) {
		if (!this._isOptimized) this._optimize();
		const node = new SourceNode(
			null,
			null,
			null,
			this._children.map(function (item) {
				if (typeof item.node === "function") return item.node(options);
				const sourceAndMap = item.sourceAndMap(options);
				if (sourceAndMap.map) {
					return SourceNode.fromStringWithSourceMap(
						sourceAndMap.source,
						new SourceMapConsumer(sourceAndMap.map)
					);
				} else {
					return sourceAndMap.source;
				}
			})
		);
		return node;
	}

	listMap(options) {
		if (!this._isOptimized) this._optimize();
		const map = new SourceListMap();
		for (const item of this._children) {
			if (typeof item === "string") {
				map.add(item);
			} else if (typeof item.listMap === "function") {
				map.add(item.listMap(options));
			} else {
				const sourceAndMap = item.sourceAndMap(options);
				if (sourceAndMap.map) {
					map.add(
						fromStringWithSourceMap(sourceAndMap.source, sourceAndMap.map)
					);
				} else {
					map.add(sourceAndMap.source);
				}
			}
		}
		return map;
	}

	updateHash(hash) {
		if (!this._isOptimized) this._optimize();
		hash.update("ConcatSource");
		for (const item of this._children) {
			item.updateHash(hash);
		}
	}

	_optimize() {
		const newChildren = [];
		let currentString = undefined;
		let currentRawSources = undefined;
		const addStringToRawSources = string => {
			if (currentRawSources === undefined) {
				currentRawSources = string;
			} else if (Array.isArray(currentRawSources)) {
				currentRawSources.push(string);
			} else {
				currentRawSources = [
					typeof currentRawSources === "string"
						? currentRawSources
						: currentRawSources.source(),
					string
				];
			}
		};
		const addSourceToRawSources = source => {
			if (currentRawSources === undefined) {
				currentRawSources = source;
			} else if (Array.isArray(currentRawSources)) {
				currentRawSources.push(source.source());
			} else {
				currentRawSources = [
					typeof currentRawSources === "string"
						? currentRawSources
						: currentRawSources.source(),
					source.source()
				];
			}
		};
		const mergeRawSources = () => {
			if (Array.isArray(currentRawSources)) {
				const rawSource = new RawSource(currentRawSources.join(""));
				stringsAsRawSources.add(rawSource);
				newChildren.push(rawSource);
			} else if (typeof currentRawSources === "string") {
				const rawSource = new RawSource(currentRawSources);
				stringsAsRawSources.add(rawSource);
				newChildren.push(rawSource);
			} else {
				newChildren.push(currentRawSources);
			}
		};
		for (const child of this._children) {
			if (typeof child === "string") {
				if (currentString === undefined) {
					currentString = child;
				} else {
					currentString += child;
				}
			} else {
				if (currentString !== undefined) {
					addStringToRawSources(currentString);
					currentString = undefined;
				}
				if (stringsAsRawSources.has(child)) {
					addSourceToRawSources(child);
				} else {
					if (currentRawSources !== undefined) {
						mergeRawSources();
						currentRawSources = undefined;
					}
					newChildren.push(child);
				}
			}
		}
		if (currentString !== undefined) {
			addStringToRawSources(currentString);
		}
		if (currentRawSources !== undefined) {
			mergeRawSources();
		}
		this._children = newChildren;
		this._isOptimized = true;
	}
}

module.exports = ConcatSource;
