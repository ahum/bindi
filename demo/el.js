import { prepare } from '../src/index';

const binding = prepare(`
      <style> 
        .header{
          background-color: lightgrey;
          padding: 1px;
          padding-left: 10px;
        }

        .tt{
          display: flex;
        }
      </style>
      <div class="header">
        <h1>[[user.name]] [[user.surname]]</h1>
      </div>
      <user-editor user="{{user}}"></user-editor> 
      <h3>Friends:</h3>
      <button id="add-button">add</button>
      <div class="tt">
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
          <input type="text" value="{{item::input}}"></input>
          <button id="delete-button" on-click="deleteFriend">delete</button>
        </template>
      </dom-repeat>
      <dom-repeat items="{{friends}}">
        <template>
        <div>[[item]]</div>
        </template>
      </dom-repeat>
      </div>
    `);

export default class El extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = binding.markup;
    binding.bind(this);
  }

  deleteFriend(friend, index) {
    console.log('delete friend');
    this.friends.splice(index, 1);
    console.log('this.friends:', this.friends);
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#add-button').addEventListener('click', e => {
      this.friends.push('new friend');
    });
  }
}
