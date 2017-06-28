export class TargetedBinding {
  constructor(readonly el: HTMLElement, readonly expression: string, readonly target) { }

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
          console.log('todo... change handler');
          //this.onChange(node[this.target.value], this);
        });
      }
    } else if (type === 'prop') {
      node[this.target.propName] = v;
    }
  }
}

export class ExpressionBindings {
  private targetedBindings: any[];
  private value;

  constructor(readonly el: HTMLElement, readonly expression: string, readonly targets) {
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

    const opts: any = {
      bubbles: true,
      composed: true
    };


    this.el.dispatchEvent(new CustomEvent(eventType, opts));
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
