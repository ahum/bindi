# bindi

binding for custom elements.

This is an experimental library that provides data binding support for vanilla [v1 custom elements][cev1]

This means that you can write your custom elements as close to the standard, bindi just saves you some boilerplating.

> At this time the lib is just an experiment. This is not for use in a real project.

## why?

Because the [custom element v1][cev1] spec is pretty good and the only thing that was preventing me from using without any frameworks was the lack of data binding.

So I thought 'if i could allow a way for data-binding to be defined, then convert that to logic belonging to the custom element that'd be great'.

## how?

`bindi` exposes a method `prepare` that takes markup like:
```html
<div>[[name]]</div>
```
and returns an object: `{markup:string, bind: (el:HTMLElement) => void}`. the markup looks like: 
```html
<div><span bindi-id="0"></span></div>
```
you then call `bind` with your custom element: `bind(this)`, this will add a setter for `name` to your custom element, such that whenever it's set it'll update `[bindi-id="0"]` with the value.

### a simple example

```javascript
import {prepare} from 'bindi';

const binding = prepare(`<div>[[name]]</div>`);

class MyEl extends HTMLElement{
  constructor(){
    super();
    const sr = this.attachShadow({mode: 'open'});
    sr.innerHTML = binding.markup;
    binding.bind(this);
  }
}
customElements.define('my-el', MyEl);

document.querySelector('my-el').name = 'Ed'; //my-el will now contain 'Ed'.

```

The binding definitions are trying to follow polymer syntax as much as possible.

## install

```bash
npm install
```

## demo 

The demo shows a few elements working together with changes travelling up and down the dom hierarchy.


```bash
cd demo
../node_modules/.bin/webpack-dev-server --hot --inline
# go to http://localhost:8080
```


## supported bindings

* single prop expression: `{{foo}}`
* custom event names: `x="{{foo::input}}"`
* nested prop expression: `{{foo.bar}}`

## not supported
* computed expressions? no
* attribute bindings? no

## kind of supported?
* arrays? see `dom-repeat` in demo as a rough guess on how to achieve this. 



### notes

Uses polymer convention of adding an event listener for a binding so: `<el foo="{{bar}}">` adds: 

```js
el.addEventListener('foo-changed', () => {
  this.bar = el.foo;
});
```
[cev1]: https://developers.google.com/web/fundamentals/getting-started/primers/customelements

