import bindi from '../src/index';

export class ChildEl extends HTMLElement {
  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    console.log('[ChildEl] call bindi...');
    const { bindings, markup } = bindi(`<style>
      :host{
        background-color: mistyrose;
        padding: 10px;
        display: block;
      }
    </style>[[name]]
    <input type="text" value="{{name::input}}"></input>`, this, ['name']);
    sr.innerHTML = markup;
  }
}

export default class El extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    console.log('[El] call bindi...');
    const { bindings, markup } = bindi(`<div>
      [[foo]]
      <div style="color: red;">red: [[foo]]</div>
      <span style="color:blue;">blue: [[foo]]</span>
      <child-el name="{{foo}}"></child-el>
      <input type="text" value="{{user.name::input}}"></input>
      <h1>[[user.name]]</h1>
    </div>
    `, this);
    sr.innerHTML = markup;
  }
}

/**
 * Implement binding to object properties: 
 *  
{{user.name}} -->  adds the following to the element: 

set user(u){

 this._user = u.isProxy ? u : proxy(u);

 this._user.onChange('name', () => {
    this.shadowRoot.querySelector('h1').textContent = this._user.name;
 });
}
*/
