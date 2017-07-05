import { prepare } from '../src/index';

const markup = `<style>
  :host{
    background-color: lightgrey;
    padding: 10px;
    display: block;
  }
</style>
<input type="text" value="{{name::input}}"></input>
>> [[name]]
`;

const binding = prepare(markup);

export default class ChildEl extends HTMLElement {
  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = binding.markup;
    binding.bind(this);
  }
}
