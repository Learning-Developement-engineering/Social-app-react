// index.ts
import {
  Children,
  cloneElement,
  isValidElement
} from "react";
import { isFragment } from "react-is";
function isFragmentWithChildren(node) {
  return isFragment(node);
}
function flattenChildren(children, depth = 0, keys = []) {
  return Children.toArray(children).reduce(
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
        if (isValidElement(node)) {
          acc.push(
            cloneElement(node, {
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
export {
  flattenChildren as default
};
