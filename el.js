import bindi from './lib/bindi';

export class ChildEl extends HTMLElement {
  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    const { bindings, markup } = bindi(`<style>
      :host{
        background-color: mistyrose;
        padding: 10px;
        display: block;
      }
    </style>[[name]]`, this);
    sr.innerHTML = markup;
  }
}

export default class El extends HTMLElement {

  /*<span>[[surname]]</span>
  <child-el name="{{name}}"></child-el>
      hello [[foo]] [[foo]]
    </div>`, this);
  */
  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    const { bindings, markup } = bindi(`<div>
      [[foo]]
      <div style="color: red;">red: [[foo]]</div>
      <span style="color:blue;">blue: [[foo]]</span>
    </div>
    <child-el name="{{foo}}"></child-el>`, this);
    sr.innerHTML = markup;
  }
}