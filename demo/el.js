import bindi from '../src/index';

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
    </style>[[name]]`, this, ['name']);

    //<input type="text" value="{{name::input}}"></input>`, this, ['name']);
    sr.innerHTML = markup;
  }
}

//<child-el name="{{foo::name-changed}}"></child-el>
//<other-el name="{{foo::custom-event-name}}"></other-el>
export default class El extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    const { bindings, markup } = bindi(`<div>
      [[foo]]
      <div style="color: red;">red: [[foo]]</div>
      <span style="color:blue;">blue: [[foo]]</span>
      <child-el name="{{foo}}"></child-el>
    </div>
    `, this);
    sr.innerHTML = markup;
  }
}