const addBinding = (el, b) => {

  Object.defineProperty(el, b.expression, {
    set: function (v) {
      console.log(`set: ${b.expression} with ${v}`);
      const node = el.shadowRoot.querySelector(`#${b.target}`);
      if (b.type === 'text') {
        node.textContent = v;
      } else if (b.type === 'attribute') {
        node.setAttribute(b.attr, v);
        if (b.change) {

          node.addEventListener(b.change, e => {
            const eventType = `${b.expression}-changed`;
            el.dispatchEvent(new CustomEvent(eventType, {
              bubbles: true,
              composed: true
            }));
          });
        }
      }
    },
    get: function () {
      const node = el.shadowRoot.querySelector(`#${b.target}`);
      if (b.type === 'text') {
        return node.textContent;
      } else if (b.type === 'attribute') {
        if (b.value) {
          return node[b.value];
        } else {
          return node.getAttribute(b.attr);
        }
      }
    }
  })
}

const parse = () => {

  return {
    bindings: [
      {
        expression: 'name',
        target: 'expr_name',
        type: 'text'
      },
      {
        expression: 'surname',
        target: 'expr_surname',
        type: 'text'
      },
      {
        expression: 'foo',
        target: 'expr_foo',
        type: 'attribute',
        attr: 'value',
        change: 'input',
        value: 'value'
      }
    ],
    markup: `<div> hello <span id= "expr_name"></span>
          <span><span id="expr_surname"></span></span>
          <input type="text" id="expr_foo"></input> 
    </div> `
  }
}

export default function bindi(raw, el) {
  const { bindings, markup } = parse(raw);
  console.log('bindings: ', bindings);
  bindings.forEach(b => {
    console.log('add binding');
    addBinding(el, b);
  });
  return markup;
}