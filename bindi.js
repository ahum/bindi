import merge from 'lodash/merge';

class TargetedBinding {
  constructor(el, expression, target) {
    this.el = el;
    this.target = target;
    this.expression = expression;
  }

  set(v) {
    const { id, type } = this.target;
    console.log('set: id: ', id, 'type: ', type, 'v: ', v);
    const node = this.el.shadowRoot.querySelector(`[bindi-id="${id}"]`);
    if (type === 'text') {
      node.textContent = v;
    } else if (type === 'attribute') {
      node.setAttribute(this.target.attr, v);
      if (this.target.change) {

        node.addEventListener(this.target.change, e => {
          this.onChange(node[this.target.value], this);
        });
      }
    } else if (type === 'prop') {
      node[this.target.propName] = v;
    }
  }
}

class ExpressionBindings {
  constructor(el, expression, targets) {
    this.el = el;
    this.expression = expression;
    this.targetedBindings = targets
      .map(t => new TargetedBinding(el, expression, t));
  }

  onChange(newValue, binding) {
    console.log('onChange: ', newValue);

    this.value = newValue;
    const eventType = `${this.expression}-changed`;

    const remainder = this.targetedBindings.filter(tb => tb !== binding);

    console.log('remainder: ', remainder);

    remainder.forEach(t => t.set(this.value));

    this.el.dispatchEvent(new CustomEvent(eventType, {
      bubbles: true,
      composed: true
    }));
  }

  init() {
    const { el, expression } = this;
    const that = this;

    this.targetedBindings.forEach(t => t.onChange = this.onChange.bind(this));

    Object.defineProperty(el, expression, {
      set: function (v) {
        that.value = v;
        that.targetedBindings.forEach(t => {
          t.set(v);
        });
      },
      get: function () {
        return that.value;
      }
    });
  }
}

const getExpressionModel = (acc, expression) => {
  const existing = acc.models.find(m => m.expression === expression);
  if (existing) {
    return existing;
  } else {

    const newModel = {
      expression,
      targets: []
    };

    acc.models.push(newModel);
    return newModel;
  }
}

const registerTarget = (acc, expression, opts) => {
  const em = getExpressionModel(acc, expression);
  const t = merge({}, opts, {
    id: `${expression}_${em.targets.length}`
  });
  em.targets.push(t);
  return t.id;
}

const walk = (node, outNode, acc) => {

  if (node) {
    const childNodes = node.childNodes;
    if (childNodes.length === 0) {
      return acc;
    } else {

      return [].reduce.call(childNodes, (acc, n) => {
        if (n.nodeType === 3) {
          const out = n.textContent.replace(/\[\[(.*?)\]\]/g, function (match, expression) {
            const targetId = registerTarget(acc, expression, { type: 'text' });
            return `<span bindi-id="${targetId}"></span>`;
          });
          outNode.innerHTML += out;
          return acc;
        } else {
          const nn = n.cloneNode(false);

          for (var i = 0; i < nn.attributes.length; i++) {
            var a = nn.attributes[i];
            if (a.value.indexOf('{{') === 0) {
              const expression = a.value.match(/{{(.*?)}}/)[1];
              const targetId = registerTarget(acc, expression, { type: 'prop', propName: a.name });
              nn.removeAttribute(a.name);
              nn.setAttribute('bindi-id', targetId);
            }
          }
          outNode.appendChild(nn);
          return walk(n, nn, acc);
        }
      }, acc);
    }
  } else {
    return acc;
  }
}

const parse = (raw) => {

  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.innerHTML = raw;
  fragment.appendChild(div);

  console.log('fragment:', fragment);

  const destFragment = document.createDocumentFragment();
  const outDiv = document.createElement('div');
  destFragment.appendChild(outDiv);
  const out = walk(fragment.firstChild, outDiv, { models: [] });

  console.log('walk result: ', out);
  console.log('walk result: ', outDiv.innerHTML);
  return {
    models: out.models,
    markup: outDiv.innerHTML
  }
}

export default function bindi(raw, el) {
  const { models, markup } = parse(raw);
  const bindings = models.map(b => {
    const { expression, targets } = b;
    const eb = new ExpressionBindings(el, expression, targets);
    eb.init();
  });
  return { markup, bindings };
}