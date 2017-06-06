import bindi from './lib/bindi';

export default class El extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = bindi(`<div>hello {{name}} 
      <span>{{surname}}</span>
      <input type="text" value="{{foo}}"></input>
      </div>`, this);
  }
}