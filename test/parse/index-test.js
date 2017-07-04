const parse = require('../../lib/parse');
const { expect } = require('chai');
describe('parse', () => {

  const assertParse = (markup, model) => {

    it('parses ' + markup, () => {
      expect(parse.default(markup)).to.eql(model);
    });
  }

  it('parses style nodes', () => {

    const body = ` 
      :host {
        background-color: mistyrose;
        padding: 10px;
        display: block;
      }`;

    const o = parse.default(`<style>${body}</style>`);
    expect(o[0].children[0]).to.eql(body);
  });

  assertParse('<br/>', [{ name: 'br', attributes: [], selfClosing: true }]);

  assertParse('<div></div>', [{ name: 'div', attributes: [], propertyBindings: [], children: [] }]);

  assertParse('hi<div></div>', ['hi', { name: 'div', attributes: [], propertyBindings: [], children: [] }]);

  assertParse('hi<div></div>there', ['hi', {
    name: 'div', attributes: [], propertyBindings: [],
    children: []
  }, 'there']);

  assertParse('hi<div a="a"></div>there', ['hi', {
    name: 'div',
    attributes: [{ label: 'a', value: 'a' }],
    propertyBindings: [],
    children: []
  }, 'there']);

  assertParse('hi<div a="{{a}}"></div>there',
    ['hi',
      {
        name: 'div',
        propertyBindings: [{ prop: 'a', expr: 'a', type: 'two-way', event: undefined }],
        attributes: [], children: []
      }, 'there']);

  assertParse('<div>hi [[a]] there</div>', [{
    name: 'div',
    attributes: [],
    propertyBindings: [],
    children: ['hi ', { expr: 'a', type: 'one-way' }, ' there']
  }]);

  assertParse('<div>apple<a>banana[[a]]</a></div>', [
    {
      name: 'div',
      attributes: [],
      propertyBindings: [],
      children: [
        'apple',
        {
          name: 'a',
          attributes: [],
          propertyBindings: [],
          children: [
            'banana',
            { type: 'one-way', expr: 'a' }
          ]
        }
      ]
    }]);
});