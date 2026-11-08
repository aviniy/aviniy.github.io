import katex from 'katex';

function renderMath(node, ctx) {
  ctx.replaceNode(node, {
    type: 'html',
    value: katex.renderToString(node.value, {
      displayMode: node.type === 'math',
      throwOnError: false,
      trust: false,
    }),
  });
}

export const mathMarkdown = {
  name: 'katex-math',
  math: renderMath,
  inlineMath: renderMath,
};
