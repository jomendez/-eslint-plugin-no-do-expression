'use strict';

const {eslintOptions} = require('./utils/eslint-options');
const ruleName = 'no-do-expression';
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../lib/index').rules[ruleName];
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const message = 'The experimental do statement is deprecated, please consider refactor it or apply --fix';
const ruleTester = new RuleTester(eslintOptions);

ruleTester.run(ruleName, rule, {
    valid: [
       'let a = 1'
    ],

    invalid: [
      //test transform do statements in jsx
        {
            code: `
            function renderDiv(){
              return (
                <div className={
                  do {
                    if (y > 10) {
                      ('small x, big y');
                    } else {
                      ('small x, small y');
                    }
                  }
                }>
                </div>
              )
            }`,
            output: `
            function renderDiv(){
              return (
                <div className={
                  (function() {
                    if (y > 10) {
                       return ('small x, big y');
                    } else {
                       return ('small x, small y');
                    }
                  })()
                }>
                </div>
              )
            }`,
            errors: [{ message }]
        },
        //simple
        {
            code: `
            let a  = do {
              let x = 3
            if(x === 2) ('true')
              else if(x === 4) 'false'
              else 'undefined'
            };`,
            output: `
            let a  = (function() {
              let x = 3
            if(x === 2)  return ('true')
              else if(x === 4)  return 'false'
              else  return 'undefined'
            })();`,
            errors: [{ message }]
        },
        //nested with block statements
        {
            code: `
            let b = do {
              if (x > 10) {
                if (y > 20) {
                  ('big x, big y');
                } else {
                  ('big x, small y');
                }
              } else {
                if (y > 10) {
                  ('small x, big y');
                } else {
                  ('small x, small y');
                }
              }
            }`,
            output: `
            let b = (function() {
              if (x > 10) {
                if (y > 20) {
                   return ('big x, big y');
                } else {
                   return ('big x, small y');
                }
              } else {
                if (y > 10) {
                   return ('small x, big y');
                } else {
                   return ('small x, small y');
                }
              }
            })()`,
            errors: [{ message }]
        },
       
    ]
});