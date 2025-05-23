"use strict";Object.defineProperty(exports, "__esModule", {value: true});// index.ts




var _react = require('react');
var _reactis = require('react-is');
function isFragmentWithChildren(node) {
  return _reactis.isFragment.call(void 0, node);
}
function flattenChildren(children, depth = 0, keys = []) {
  return _react.Children.toArray(children).reduce(
    (acc, node, nodeIndex) => {
      if (isFragmentWithChildren(node)) {
        acc.push.apply(
          acc,
          flattenChildren(
            node.props.children,
            depth + 1,
            keys.concat(node.key || nodeIndex)
          )
        );
      } else {
        if (_react.isValidElement.call(void 0, node)) {
          acc.push(
            _react.cloneElement.call(void 0, node, {
              key: keys.concat(String(node.key)).join(".")
            })
          );
        } else if (typeof node === "string" || typeof node === "number") {
          acc.push(node);
        }
      }
      return acc;
    },
    []
  );
}


exports.default = flattenChildren;

module.exports = exports.default