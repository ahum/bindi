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
    </style>
    [[name]]
    <input type="text" value="{{name::input}}"></input>`, this, ['name']);
    sr.innerHTML = markup;
  }
}
/**
 * 
      <br/>
    <label>surname:
      <child-el name="{{user.surname}}"></child-el>
    </label>
    <br/>
    <br/>`,
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
      <child-el name="{{user.surname}}"></child-el>
    </label>
    <br/>
      `,
      this, []);

    sr.innerHTML = markup;
  }
}
/**
 * 
      // <h1>[[user.name]] [[user.surname]]</h1>
      // <user-editor user="{{user}}"></user-editor>
    const { bindings, markup } = bindi(`<div>
      {{#employees}}
        <h1>{{index}} -> {{item.name}}</h1>
      {{/employees}}
       <h1>[[user.name]] [[user.surname]]</h1>
       <user-editor user="{{user}}"></user-editor>
     </div>`, this);
 */

export class DomRepeat extends HTMLElement {

  constructor() {
    super();
    console.log('this.innerHTML:', this.innerHTML);
    this.template = this.querySelector('template').innerHTML;

  }

  set items(i) {
    this._items = i;
    console.log('this.items: ', this._items);
    this._items.forEach((i, index) => {
      this.innerHTML += this.template.replace('[[item]]', i).replace('[[index]]', index);
    });
  }
}

export default class El extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    const { bindings, markup } = bindi(`
       <h1>[[user.name]] [[user.surname]]</h1>
       <user-editor user="{{user}}"></user-editor>
       <dom-repeat items="{{names}}">
         <template>
           <h1>[[item]][[index]]</h1>
         </template>
       </dom-repeat>
    `, this);
    sr.innerHTML = markup;
  }
}

/**
 * <span bindi-id="employees_1"></span>
 * 
 * <template><h1>...</h1></template>
 */
