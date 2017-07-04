const markup = require('../../lib/parse/markup');
const parse = require('../../lib/parse');
const { expect } = require('chai');

describe('markup', () => {

  const _assert = (input, expected, only) => {

    const fn = only ? it.only : it;

    fn(input, () => {
      const entries = parse.default(input);
      const o = markup.default(entries);
      expect(o).to.eql(expected)
    });
  }

  const assertMarkup = (markup, expected) => {
    _assert(markup, expected);
  }

  assertMarkup.only = (markup, expected) => {
    _assert(markup, expected, true);
  }

  assertMarkup('hi', { markup: 'hi', bindings: [] });
  assertMarkup('<div></div>', { markup: '<div></div>', bindings: [] });
  assertMarkup('<div a="a">hi</div>', { markup: '<div a="a">hi</div>', bindings: [] });

  assertMarkup('<div>a<b>c</b></div>', { markup: '<div>a<b>c</b></div>', bindings: [] });

  assertMarkup('<a><b>[[foo]]<c>[[bar]]</c></b></a>', {
    markup: '<a><b><span bindi-id="0"></span><c><span bindi-id="1"></span></c></b></a>',
    bindings: [
      {
        id: '0',
        bindings: [
          { prop: 'innerHTML', expr: 'foo', type: 'one-way', event: undefined }
        ]
      },
      {
        id: '1',
        bindings: [
          { prop: 'innerHTML', expr: 'bar', type: 'one-way', event: undefined }
        ]
      }
    ]
  });

  assertMarkup('<div>apple<a>banana[[a]]</a></div>', {
    markup: '<div>apple<a>banana<span bindi-id="0"></span></a></div>',
    bindings: [
      {
        id: '0',
        bindings: [
          { prop: 'innerHTML', expr: 'a', type: 'one-way', event: undefined }
        ]
      }
    ]
  });

  assertMarkup('[[apple]]', {
    markup: '<span bindi-id="0"></span>', bindings: [
      {
        id: '0', bindings: [
          { prop: 'innerHTML', expr: 'apple', type: 'one-way', event: undefined }
        ]
      }
    ]
  });

  assertMarkup('<div a="{{b}}" c="{{cc}}"></div>', {
    markup: '<div bindi-id="0"></div>',
    bindings: [
      {
        id: '0',
        bindings: [
          {
            event: undefined,
            prop: 'a',
            expr: 'b',
            type: 'two-way'
          },
          {
            event: undefined,
            prop: 'c',
            expr: 'cc',
            type: 'two-way'
          }
        ]
      }
    ]
  });
});