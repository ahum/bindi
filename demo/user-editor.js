import { prepare } from '../src/index';

const binding = prepare(`
  <label>
    name: 
    <input type="text" value="{{user.name::input}}"></input>
    </label>
    <br/>
  <label>surname:
    <child-el name="{{user.surname}}"></child-el>
  </label>`);

export default class UserEditor extends HTMLElement {
  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = binding.markup;
    binding.bind(this);
  }
}
