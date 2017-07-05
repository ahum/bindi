import { prepare } from '../src/index';

const binding = prepare(`
      <style> 
        .header{
          background-color: lightgrey;
          padding: 1px;
          padding-left: 10px;
        }
      </style>
      <div class="header">
        <h1>[[user.name]] [[user.surname]]</h1>
      </div>
      <user-editor user="{{user}}"></user-editor> 
      <h3>Friends:</h3>
      <dom-repeat items="{{friends}}"> 
        <template>
          <style>
            :host{
              display: flex;
              align-items: center;
            }
            
            .index{
              display: block;
              background-color: #ee99ff;
              color:white;
              border-radius: 2px;
              padding: 2px;
              margin: 4px;
            }
          </style>
          <span class="index">[[index]]</span>[[item]]
        </template>
      </dom-repeat>
    `);

export default class El extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = binding.markup;
    binding.bind(this);
  }
}
