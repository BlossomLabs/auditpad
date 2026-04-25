import type { Monaco } from '@monaco-editor/react'

let registered = false

/**
 * Monaco ships no Solidity grammar by default. Register a minimal
 * tokenizer so that `Vault.sol` highlights cleanly. Replace with a
 * full grammar (e.g. monaco-solidity) when richer features are needed.
 */
export function registerSolidityLanguage(monaco: Monaco) {
  if (registered) return
  registered = true

  monaco.languages.register({ id: 'solidity', extensions: ['.sol'] })

  monaco.languages.setLanguageConfiguration('solidity', {
    comments: { lineComment: '//', blockComment: ['/*', '*/'] },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  })

  monaco.languages.setMonarchTokensProvider('solidity', {
    defaultToken: '',
    tokenPostfix: '.sol',

    keywords: [
      'pragma', 'solidity', 'contract', 'interface', 'library', 'is',
      'function', 'modifier', 'event', 'struct', 'enum', 'mapping',
      'public', 'private', 'internal', 'external', 'pure', 'view',
      'payable', 'memory', 'storage', 'calldata', 'returns', 'return',
      'if', 'else', 'for', 'while', 'do', 'break', 'continue',
      'require', 'assert', 'revert', 'emit', 'new', 'delete',
      'constructor', 'fallback', 'receive', 'using', 'try', 'catch',
      'override', 'virtual', 'abstract', 'immutable', 'constant',
      'true', 'false',
    ],

    typeKeywords: [
      'address', 'bool', 'string', 'bytes', 'byte', 'uint', 'int',
      'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
      'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
    ],

    operators: [
      '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
      '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^',
      '%', '<<', '>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
      '%=', '<<=', '>>=',
    ],

    symbols: /[=><!~?:&|+\-*/^%]+/,

    tokenizer: {
      root: [
        [
          /[a-zA-Z_$][\w$]*/,
          {
            cases: {
              '@typeKeywords': 'type',
              '@keywords': 'keyword',
              '@default': 'identifier',
            },
          },
        ],

        { include: '@whitespace' },

        [/[{}()[\]]/, '@brackets'],
        [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],

        [/\d+/, 'number'],

        [/[;,.]/, 'delimiter'],

        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
      ],

      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\*\*(?!\/)/, 'comment.doc', '@doccomment'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],

      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment'],
      ],

      doccomment: [
        [/[^/*]+/, 'comment.doc'],
        [/\*\//, 'comment.doc', '@pop'],
        [/[/*]/, 'comment.doc'],
      ],

      string_double: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop'],
      ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/\\./, 'string.escape'],
        [/'/, 'string', '@pop'],
      ],
    },
  })
}
