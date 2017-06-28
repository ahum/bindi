import { Expression, Target } from './parse';

export class TargetedBinding {
  constructor(readonly el: HTMLElement, readonly expression: Expression, readonly target: Target) {

    console.log('expression: ', expression);
    const { prop, event } = expression;
    if (event) {
      const { id, type } = this.target;
      const node = this.el.shadowRoot.querySelector(`[bindi-id="${id}"]`);
      node.addEventListener(event, (e) => {
        const newValue = e.target[(target as any).propName];
        console.log('new Value: ', newValue);
      });
    }
  }

  set(v) {
    const { id, type } = this.target;
    const node = this.el.shadowRoot.querySelector(`[bindi-id="${id}"]`);

    if (type === 'text') {
      node.textContent = v;
    } else if (type === 'attribute') {
      node.setAttribute((this.target as any).attr, v);
    } else if (type === 'prop') {
      node[(this.target as any).propName] = v;
    }
  }
}

export class ExpressionBindings {
  private targetedBindings: any[];
  private value;

  constructor(readonly el: HTMLElement, readonly expression: Expression, readonly targets: Target[]) {
    this.targetedBindings = targets
      .map(t => new TargetedBinding(el, expression, t));
  }

  onChange(newValue, binding) {

    this.value = newValue;

    const eventType = `${this.expression.prop}-changed`;

    const remainder = this.targetedBindings.filter(tb => tb !== binding);

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

    /**
     * define a setter for `expression` that calls .set on the targeted bindings
     */
    Object.defineProperty(el, expression.prop, {
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
