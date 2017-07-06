import { autorun, isObservable, observable } from 'mobx';

import bindi from '../src/index';

export default class DomRepeat extends HTMLElement {
  constructor() {
    super();
    const template = this.querySelector('template').innerHTML.replace('<template>', '').replace('</template>', '');
    const parent = this;
    this._c = class extends HTMLElement {
      constructor() {
        super();
        let sr = this.attachShadow({ mode: 'open' });
        const { markup } = bindi(template, this);
        sr.innerHTML = markup;
      }
    }
    this.itemChanged = this.itemChanged.bind(this);
  }

  connectedCallback() {
    //TODO: element-name will need to be unique
    customElements.define('stamped-item', this._c);
  }

  itemsUpdated() {
    console.log('items updated', this._items);
  }

  itemChanged(e) {
    this._items.splice(parseInt(e.target.getAttribute('key')), 1, e.target.item);
    console.log('..?', this._items);
  }

  getElementAtIndex(index) {
    const el = this.querySelector(`[key="${index}"]`);
    if (!el) {
      var newEl = document.createElement('stamped-item');
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
      console.log('this:', this);
      console.log('this:', this._items, this._items.map);
      this._items.map((item, index) => {
        const e = this.getElementAtIndex(index);
        e.item = item;
        e.index = index;
        e.addEventListener('item-changed', this.itemChanged);
      });
    });
  }

}
