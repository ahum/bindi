import { Expression, Target } from './parse';
import { isObservable, observable } from 'mobx';
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

export interface Initable {
  init(): void;
}

export class EventBind implements Initable {
  constructor(readonly elementRoot: HTMLElement, readonly event: string, readonly fn: string, readonly id: string) {

    this.onEvent = this.onEvent.bind(this);
  }

  onEvent(e: Event) {
    logger.log('[onEvent]', e);
    if (this.elementRoot[this.fn]) {
      this.elementRoot[this.fn](e);
    }
  }

  init(): void {
    logger.log(`[init] add listener for ${this.event}`);
    const el = this.elementRoot.shadowRoot.querySelector(`[bindi-id="${this.id}"]`);
    if (el) {
      el.addEventListener(this.event, this.onEvent);
    }
  }
}

export class BindingGroup implements Initable {

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
        if (isObservable(v)) {
          that.value = v;
        } else {
          that.value = observable(v);
        }

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
