import * as morphdom from 'morphdom';

import { autorun, isObservable, observable } from 'mobx';

import { prepare } from '../src/index';

function* idMaker() {
  var index = 0;
  while (index < 3)
    yield index++;
}
const gen = idMaker();

export default class DomRepeat extends HTMLElement {
  constructor() {
    super();
    this.elementName = `stamped-item-${gen.next().value}`;
    const template = this.querySelector('template').innerHTML.replace('<template>', '').replace('</template>', '');
    const parent = this;
    const { markup, bind } = prepare(template);
    this._c = class extends HTMLElement {
      constructor() {
        super();
        let sr = this.attachShadow({ mode: 'open' });
        sr.innerHTML = markup;
        const bindings = bind(this);

        //map bindings to parent context.. 
        bindings.forEach(b => {
          if (b.fn) {
            this[b.fn] = function (e) {
              parent.getRootNode().host[b.fn](this.item, parseInt(this.getAttribute('key')));
            }
          }
        });
      }
    }

    this.itemChanged = this.itemChanged.bind(this);
  }

  connectedCallback() {
    customElements.define(this.elementName, this._c);
  }

  itemsUpdated() {
    console.log('items updated', this._items);
  }

  itemChanged(e) {
    this._items.splice(parseInt(e.target.getAttribute('key')), 1, e.target.item);
  }

  getElementAtIndex(index) {
    const el = this.querySelector(`[key="${index}"]`);
    if (!el) {
      var newEl = document.createElement(this.elementName);
      newEl.setAttribute('key', index);
      this.appendChild(newEl);
      return newEl;
    } else {
      return el;
    }
  }

  set items(i) {

    if (isObservable(i)) {
      this._items = i
    } else {
      console.log('?', i);
      this._items = observable.array(i);
    }

    autorun(() => {
      const markup = this._items.map((item, index) => `<${this.elementName} key="${index}"></${this.elementName}>`).join('');
      morphdom(this, `<div>${markup}</div>`, { childrenOnly: true });

      this._items.forEach((item, index) => {
        const e = this.querySelector(`[key="${index}"]`);
        e.item = item;
        e.index = index;
        e.addEventListener('item-changed', this.itemChanged);
      });
    });
  }

}
