"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = collapseAdjacentRules;
let comparisonMap = {
    atrule: [
        'name',
        'params'
    ],
    rule: [
        'selector'
    ]
};
let types = new Set(Object.keys(comparisonMap));
function collapseAdjacentRules() {
    return (root)=>{
        let currentRule = null;
        root.each((node)=>{
            if (!types.has(node.type)) {
                currentRule = null;
                return;
            }
            if (currentRule === null) {
                currentRule = node;
                return;
            }
            let properties = comparisonMap[node.type];
            var _property, _property1;
            if (node.type === 'atrule' && node.name === 'font-face') {
                currentRule = node;
            } else if (properties.every((property)=>((_property = node[property]) !== null && _property !== void 0 ? _property : '').replace(/\s+/g, ' ') === ((_property1 = currentRule[property]) !== null && _property1 !== void 0 ? _property1 : '').replace(/\s+/g, ' ')
            )) {
                currentRule.append(node.nodes);
                node.remove();
            } else {
                currentRule = node;
            }
        });
    };
}
