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
  }

  connectedCallback() {
    //TODO: element-name will need to be unique
    customElements.define('stamped-item', this._c);
  }

  set items(i) {
    const markup = i.map((item, index) => {
      return `<stamped-item key="${index}"></stamped-item>`;
    }).join('');

    this.innerHTML = markup;

    i.map((item, index) => {
      const e = this.querySelector(`[key="${index}"]`);
      e.item = item;
      e.index = index;
    });
  }
}
