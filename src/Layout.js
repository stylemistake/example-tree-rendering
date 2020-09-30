import produce from 'immer';
import React, { useState } from 'react';
import { createTreeNode, walkTreeRecursively, walkTreeIteratively, isSameNode } from './tree';

const TreeNode = props => {
  const {
    level = 0,
    onAddChild,
    children,
  } = props;
  return (
    <div
      className="TreeNode"
      style={{
        marginLeft: level + 'em',
      }}>
      {children}
      <div
        className="TreeNode__add"
        onClick={onAddChild} />
    </div>
  );
};

const useTree = initialTree => {
  const [tree, setTree] = useState(initialTree);
  /**
   * Replaces the node at specified `path` with a new `node`.
   */
  const modifyNodeAtPath = (path, visitor) => produce(rootNode => {
    let currentNode = rootNode;
    let remainingPath = [...path];
    while (currentNode && remainingPath.length > 0) {
      const nodeAtPath = remainingPath.shift();
      // Skip the root node
      if (isSameNode(nodeAtPath, currentNode)) {
        continue;
      }
      // Find node in children
      currentNode = currentNode
        ?.children
        ?.find(childNode => isSameNode(nodeAtPath, childNode));
    }
    if (currentNode) {
      visitor(currentNode);
    }
  });
  /**
   * Adds a child `node` at specified `path`.
   */
  const addChildNode = (node, path) => {
    const nextTree = modifyNodeAtPath(path, targetNode => {
      if (!targetNode.children) {
        targetNode.children = [];
      }
      targetNode.children.push(node);
    })(tree);
    setTree(nextTree);
  };
  return {
    tree,
    addChildNode,
  };
};

const initialTree = (
  createTreeNode('root', [
    createTreeNode('foo', [
      createTreeNode('bar'),
      createTreeNode('baz'),
    ]),
    createTreeNode('tea'),
  ])
);

export const Layout = props => {
  const [recursive, setRecursive] = useState(false);
  const {
    tree,
    addChildNode,
  } = useTree(initialTree);
  const visitor = (node, path) => (
    <TreeNode
      key={node.name + '_' + path.length}
      level={path.length}
      onAddChild={() => {
        const name = window.prompt('Provide a name for the new tree node.');
        addChildNode(createTreeNode(name), [...path, node]);
      }}>
      {node.name}
    </TreeNode>
  );
  const elements = recursive
    ? walkTreeRecursively(tree, visitor)
    : walkTreeIteratively(tree, visitor);
  return (
    <div className="Layout">
      <div>
        <label>
          <input
            type="checkbox"
            checked={recursive}
            onChange={() => setRecursive(recursive => !recursive)} />
          {' '}
          Use recursive method
        </label>
      </div>
      <hr />
      {elements}
    </div>
  );
};
