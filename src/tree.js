export const createTreeNode = (name, children) => ({
  name,
  children,
});

export const isSameNode = (a, b) => a && b && a.name === b.name;

export const walkTreeRecursively = (
  node, iteratee,
  state = { path: [], output: [] }
) => {
  if (!node) {
    return;
  }
  if (node.name) {
    state.output.push(iteratee(node, state.path));
  }
  const nextState = {
    ...state,
    path: [...state.path, node],
  };
  if (node.children && node.children.length > 0) {
    for (const childNode of node.children) {
      walkTreeRecursively(childNode, iteratee, nextState);
    }
  }
  return state.output;
};

export const walkTreeIteratively = (node, iteratee) => {
  const output = [];
  let toVisit = [[node, []]];
  while (toVisit.length > 0) {
    const [node, path] = toVisit.shift();
    if (!node) {
      continue;
    }
    if (node.name) {
      output.push(iteratee(node, path));
    }
    if (node.children && node.children.length > 0) {
      const nextPath = [...path, node];
      toVisit = [
        ...node.children.map(childNode => [childNode, nextPath]),
        ...toVisit,
      ];
    }
  }
  return output;
};
