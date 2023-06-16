import React from "react";
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

let getNodes = str =>
  new DOMParser().parseFromString(str, "text/html").body.childNodes;
/* let createJSX = nodeArray => {
  return nodeArray.map(node => {
    let attributeObj = {};
    const {
      attributes,
      localName,
      childNodes,
      nodeValue
    } = node;
    if (attributes) {
      Array.from(attributes).forEach(attribute => {
        if (attribute.name === "style") {
          let styleAttributes = attribute.nodeValue.split(";");
          let styleObj = {};
          styleAttributes.forEach(attribute => {
            let [key, value] = attribute.split(":");
            styleObj[key] = value;
          });
          attributeObj[attribute.name] = styleObj;
        } else {
          attributeObj[attribute.name] = attribute.nodeValue;
        }
      });
    }
    return localName ?
      React.createElement(
        localName,
        attributeObj,
        childNodes && Array.isArray(Array.from(childNodes)) ?
        createJSX(Array.from(childNodes)) :
        []
      ) :
      nodeValue;
  });
}; */

const parseHTML = (str) => {
  const nodes = str.split(/<|>/).map((node) => {
    const [tag, ...attributes] = node.split(' ');

    if (tag.startsWith('/')) {
      return {
        type: 'closing',
        tag: tag.slice(1),
      };
    }

    const [elementName, ...rest] = tag.split(/\s|\/|\>|$/);
    const attributesMap = {};

    attributes.forEach((attribute) => {
      const [name, value] = attribute.split('=');
      if (name && value) {
        attributesMap[name] = value.replace(/['"]/g, '');
      }
    });

    return {
      type: 'element',
      tag: elementName,
      attributes: attributesMap,
      children: [],
      content: rest.join(' '),
    };
  });

  const stack = [];
  const root = { children: [] };

  nodes.forEach((node) => {
    if (node.type === 'element') {
      if (stack.length > 0) {
        const parent = stack[stack.length - 1];
        parent.children.push(node);
      } else {
        root.children.push(node);
      }
      stack.push(node);
    } else if (node.type === 'closing') {
      stack.pop();
    }
  });

  return root.children;
};

const createJSX = (nodes) => {
  return nodes.map((node, index) => {
    if (node.type === 'element') {
      const children = createJSX(node.children);

      return React.createElement(
        node.tag,
        { ...node.attributes, key: index },
        children
      );
    } else {
      return node.content;
    }
  });
};

export const StringToJSX = props => {
  const parsedNodes = parseHTML(props.domString);
  const jsxElements = createJSX(parsedNodes);

  return <>{jsxElements}</>;
  //return createJSX(Array.from(getNodes(props.domString)));
};