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
    <br/>`,
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
     </div>`, this);
 */
export default class El extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    const { bindings, markup } = bindi(`
      <h1>[[user.name]] [[user.surname]]</h1>
      <user-editor user="{{user}}"></user-editor> 
      <dom-repeat items="{{names}}"> 
        <template>
          <h1>[[item]] [[index]]</h1>
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
