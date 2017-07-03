import { Expression, Target } from './parse';
import { get as nestedGet, set as nestedSet } from './nested-accessor';

import getLogger from './log';

const logger = getLogger('bindings');

export type OnChange = (v: any, src: Target) => void;

export class TargetedBinding {

  private bound;

  constructor(
    readonly el: HTMLElement,
    readonly expression: Expression,
    readonly target: Target,
    readonly onChange: OnChange) {

    this.bound = this.eventHandler.bind(this);
  }

  eventHandler(e: Event) {
    logger.log('[TargetedBinding] eventHandler: ', e.type);
    const newValue = e.target[(this.target as any).propName];
    this.onChange(newValue, this.target);
  }

  set(v) {
    const { id, type, event } = this.target;
    const node = this.el.shadowRoot.querySelector(`[bindi-id="${id}"]`);

    if (type === 'text') {
      node.textContent = v;
    } else if (type === 'attribute') {
      //node.setAttribute((this.target as any).attr, v);
      //TODO
    } else if (type === 'prop') {
      node[(this.target as any).propName] = v;
      const eventName = event ? event : `${(this.target as any).propName}-changed`;
      logger.log('listen for: ', eventName, node);
      node.addEventListener(eventName, this.bound);
    }

    if (event) {
      node.addEventListener(event, this.bound);
    }
  }
}

export type PathChange = (path: string, value: any) => void;

export class PathGroup {

  readonly bindings: { target: TargetedBinding, expression: Expression }[] = [];

  constructor(
    readonly root: HTMLElement,
    readonly path: string,
    private pathChange: PathChange) {
    this.onChange = this.onChange.bind(this);
  }

  addBinding(target: Target, expression: Expression): void {

    const tb = new TargetedBinding(this.root, expression, target, this.onChange);

    this.bindings.push({ target: tb, expression });
    logger.log('this.bindings: ', this.bindings);
  }

  set(value: any): void {
    this.bindings.forEach(({ target, expression }) => {
      if (expression.nested) {
        const v = nestedGet(value, expression.rest);
        target.set(v);
      } else {
        target.set(value);
      }
    });
  }

  onChange(newValue: any, src: Target) {
    logger.log('[PathGroup] onChange: ', newValue, src);
    const remainder = this.bindings.filter(({ target }) => target.target.id !== src.id);

    logger.log('remainder: ', remainder);
    remainder.forEach(t => t.target.set(newValue));

    this.pathChange(this.path, newValue);
  }
}

export class BindingGroup {

  private paths: PathGroup[] = [];

  private value: any;

  constructor(readonly elementRoot: HTMLElement, readonly root: string) {
    this.onPathChange = this.onPathChange.bind(this);
  }

  addBinding(target: Target, expression: Expression): void {
    let p = this.paths.find(p => p.path === expression.raw);
    if (!p) {
      p = new PathGroup(this.elementRoot, expression.raw, this.onPathChange);
      this.paths.push(p);
    }
    p.addBinding(target, expression);
  }

  onPathChange(path: string, value: any): void {

    logger.log('[onPathChange]', this.elementRoot, path, value);

    if (path.indexOf('.') === -1) {
      this.value = value;
      this.paths.forEach(pg => pg.set(this.value));
    } else {
      const arr = path.split('.');
      arr.shift();
      nestedSet(this.value, arr.join('.'), value);
    }

    logger.log('this.value: ', this.value);

    const eventType = `${this.root}-changed`;

    logger.log('eventType', eventType);
    const opts: any = {
      bubbles: true,
      composed: true
    };

    //TODO: this should not be automatically dispatched.
    this.elementRoot.dispatchEvent(new CustomEvent(eventType, opts));
  }

  init(): void {
    const that = this;
    Object.defineProperty(this.elementRoot, this.root, {
      set: function (v) {
        that.value = v;

        that.paths.forEach(pg => {
          pg.set(that.value);
        });

      },
      get: function () {
        return that.value;
      }
    });
  }
}

export class ExpressionBindings {
  private targetedBindings: any[];
  private value;

  constructor(readonly el: HTMLElement, readonly expression: Expression, readonly targets: Target[]) {
    this.targetedBindings = targets
      .map(t => new TargetedBinding(el, expression, t, this.onChange));
  }

  onChange(newValue, binding) {

    this.value = newValue;

    const eventType = `${this.expression}-changed`;


    const remainder = this.targetedBindings.filter(tb => tb !== binding);

    remainder.forEach(t => t.set(this.value));

    const opts: any = {
      bubbles: true,
      composed: true
    };
    //TODO: this should not be automatically dispatched.
    this.el.dispatchEvent(new CustomEvent(eventType, opts));
  }

  init() {
    const { el, expression } = this;
    const that = this;

    this.targetedBindings.forEach(t => t.onChange = this.onChange.bind(this));

    /**
     * define a setter for `expression` that calls .set on the targeted bindings
     */
    Object.defineProperty(el, expression.root, {
      set: function (v) {
        that.value = v;
        if (!expression.nested) {
          that.targetedBindings.forEach(t => {
            t.set(v);
          });
        } else {
          const nestedValue = nestedGet(v, expression.rest);
          if (nestedValue) {
            that.targetedBindings.forEach(t => {
              t.set(nestedValue);
            });
          }
        }
      },
      get: function () {
        return that.value;
      }
    });
  }
}
