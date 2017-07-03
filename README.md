# bindi

binding for custom elements

## install

```bash
npm install
```

## demo 

```bash
cd demo
../node_modules/.bin/webpack-dev-server --hot --inline
# go to http://localhost:8080
```


## supported bindings

* single prop expression: `{{foo}}`
* nested prop expression: `{{foo.bar}}`
* arrays? no
* computed expressions? no

Uses polymer convention of adding an event listener for a binding so: `<el foo="{{bar}}">` adds: 

```js
el.addEventListener('foo-changed', () => {
  this.bar = el.foo;
});
```
