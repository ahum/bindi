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
    </style>[[name]]
    <input type="text" value="{{name::input}}"></input>`, this, ['name']);
    sr.innerHTML = markup;
  }
}
/**
 * 
    <label>
      surname: 
      <input type="text" value="{{surname::input}}"></input>
    </label>
 */
export class UserEditor extends HTMLElement {
  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    const { bindings, markup } = bindi(`
    <label>
      name: 
      <input type="text" value="{{user.name::input}}"></input>
      </label>
      <br/>
    <label>surname:
      <input type="text" value="{{user.surname::input}}"></input>
    </label>
    <br/>
    <br/>`,
      this, []);

    sr.innerHTML = markup;
  }
}

/*<!-- 
<input type="text" value="{{user.name::input}}"></input>
<name-el name="{{user.name}}></name-el>
name-changed 
 
[[foo]]
<div style="color: red;">red: [[foo]]</div>
<span style="color:blue;">blue: [[foo]]</span>
<child-el name="{{foo}}"></child-el>


    const { bindings, markup } = bindi(`<div>
      <h1>[[user.name]] [[user.surname]]</h1>
      <h2>[[user.name]] [[user.surname]]</h2>
     [[foo]]
     <div style="color: red;">red: [[foo]]</div>
     <span style="color:blue;">blue: [[foo]]</span>
     <child-el name="{{foo}}"></child-el>
     </div>
    `, this);

-->*/
export default class El extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    const { bindings, markup } = bindi(`<div>
      <h1>[[user.name]] [[user.surname]]</h1>
      <user-editor user="{{user}}"></user-editor>
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

 this._user = u; 

 if(this._user){
   
 }
 this.shadowRoot.querySelector('[bindi-id="0"]').value = this._user.name;
 this.shadowRoot.querySelector('[bindi-id="0"]').addEventListener('input', e => {
  //...
 });

 this.shadowRoot.querySelector('[bindi-id="1"]').name = this._user.name;
 this.shadowRoot.querySelector('[bindi-id="1"]').addEventListener('name-changed', e => {
  //...
 });
 
 this.shadowRoot.querySelector('[bindi-id="2"]').textContent = this._user.name;

 this._user.onChange('name', () => {
    this.shadowRoot.querySelector('h1').textContent = this._user.name;
 });
}
set user(u){

 this._user = u.isProxy ? u : proxy(u);

 this._user.onChange('name', () => {
    this.shadowRoot.querySelector('h1').textContent = this._user.name;
 });
}
*/
