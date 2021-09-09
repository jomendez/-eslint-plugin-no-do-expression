/**
 * @fileoverview no do expression
 * @author Jose Mendez
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
module.exports = {
  rules: {
    'no-do-expression': {
      meta: { fixable: 'Convert do expressions into IIF' },
      create: function (context) {
        return {
          DoExpression(node) {
            context.report({
              node,
              message: 'The experimental do statement is deprecated, please consider refactor it or apply --fix',

              fix(fixer) {
                const result = [
                  fixer.replaceTextRange([node.range[0], node.range[0] + 2], '(function()'),
                  fixer.replaceTextRange([node.range[1], node.range[1]], ')()')
                ];

                if (!node.body || node.body.body.length === 0) {
                  return;
                }
                const { body } = node.body
                result.push(...buildFixer(body, fixer))
                return result
              }
            });
          }
        };
      }
    }
  }
};

//TODO: rename this function
function recursive(node, result = [], fixer) {
  if (!!node && node.type === 'ExpressionStatement') {
    result.push(fixer.insertTextBefore(node, ' return '));
    return;
  }
  if (!!node && node.type === 'BlockStatement') {
    const [statement] = node.body;

    if (statement.type === 'ExpressionStatement') {
      result.push(fixer.insertTextBefore(statement, ' return '));
      return;
    } else if (statement.type === 'IfStatement') {
      recursive(statement.consequent, result, fixer)
      recursive(statement.alternate, result, fixer)
      return
    }
  }
  if (!!node) recursive(node.consequent, result, fixer)
  if (!!node) recursive(node.alternate, result, fixer)
}


function buildFixer(body, fixer) {
  const result = []
  for (const item of body) {
    if (!!item && item.type === 'IfStatement') {
      let consequent = item.consequent
      let alternate = item.alternate
      recursive(consequent, result, fixer)
      recursive(alternate, result, fixer)
    }
  }
  return result;
}

