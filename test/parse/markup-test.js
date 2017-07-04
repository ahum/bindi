const markup = require('../../lib/parse/markup');
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
    it('adds binding in node contents', () => {

      const o = markup.default([
        {
          expr: 'apple'
        }
      ]);

      expect(o).to.eql({
        markup: '<span bindi-id="0"></span>', bindings: [
          {
            id: '0', bindings: [
              { prop: 'innerHTML', expr: 'apple' }
            ]
          }
        ]
      })
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