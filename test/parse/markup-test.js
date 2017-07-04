const markup = require('../../lib/parse/markup');
const parse = require('../../lib/parse');
const { expect } = require('chai');

describe('markup', () => {

  describe('no bindings', () => {
    it('handles strings', () => {
      expect(markup.default(['hi'])).to.eql({ markup: 'hi', bindings: [] });
    });

    it('handles nodes', () => {
      expect(markup.default([
        { name: 'div', attributes: [], children: [] }
      ])).to.eql({ markup: '<div></div>', bindings: [] });
    });

    it('handles nodes', () => {
      expect(markup.default([
        { name: 'div', attributes: [{ label: 'a', value: 'a' }], children: ['hi'] }
      ])).to.eql({ markup: '<div a="a">hi</div>', bindings: [] });
    });

    it('handles nodes with nodes', () => {
      expect(markup.default([
        {
          name: 'div', attributes: [{ label: 'a', value: 'a' }], children: [
            'hi',
            { name: 'a', attributes: [{ label: 'b', value: 'bb' }], children: ['click here'] }
          ]
        }
      ])).to.eql({ markup: '<div a="a">hi<a b="bb">click here</a></div>', bindings: [] });
    });

  });

  describe('with bindings', () => {

    const _assert = (input, expected, only) => {

      const fn = only ? it.only : it;

      fn(input, () => {
        const entries = parse.default(input);
        console.log('entries', entries);

        const o = markup.default(entries);

        console.log('o: ', JSON.stringify(o, null, '  '));

        expect(o).to.eql(expected)
      });
    }

    const assertMarkup = (markup, expected) => {
      _assert(markup, expected);
    }

    assertMarkup.only = (markup, expected) => {
      _assert(markup, expected, true);
    }

    assertMarkup('<a><b>[[foo]]<c>[[bar]]</c></b></a>', {
      markup: '<a><b><span bindi-id="0"></span><c><span bindi-id="1"></span></c></b></a>',
      bindings: [
        {
          id: '0',
          bindings: [
            { prop: 'innerHTML', expr: 'foo', type: 'one-way' }
          ]
        },
        {
          id: '1',
          bindings: [
            { prop: 'innerHTML', expr: 'bar', type: 'one-way' }
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
            { prop: 'innerHTML', expr: 'a', type: 'one-way' }
          ]
        }
      ]
    });

    assertMarkup('[[apple]]', {
      markup: '<span bindi-id="0"></span>', bindings: [
        {
          id: '0', bindings: [
            { prop: 'innerHTML', expr: 'apple', type: 'one-way' }
          ]
        }
      ]
    });

    it('registers bindings', () => {

      const o = markup.default([
        {
          name: 'div',
          attributes: [],
          propertyBindings: [{
            prop: 'a',
            expr: 'b'
          },
          {
            prop: 'c', expr: 'cc'
          }],
          children: []
        }
      ]);

      expect(o).to.eql({
        markup: '<div bindi-id="0"></div>',
        bindings: [
          {
            id: '0',
            bindings: [
              {
                prop: 'a',
                expr: 'b'
              },
              {
                prop: 'c',
                expr: 'cc'
              }
            ]
          }
        ]
      })
    });
  });
});