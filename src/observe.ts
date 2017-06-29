/**
 *
 * TODO: find a solid library for handling changes
 * @param prefix
 * @param o
 */
function buildProxy(prefix: string, o: any) {
  return new Proxy(o, {
    set(target: any, property: string, value: any) {
      // same as before, but add prefix
      var setResult = Reflect.set(target, property, value);

      if (target.changeHandlers[property]) {
        target.changeHandlers[property].forEach((handler) => {
          handler(value, target);
        });
      }
      //fn(prefix + property, value);
      return setResult;
    },
    apply(target: any, thisArg: any, args: any[]) {
      console.log(target, thisArg, args);
    },
    get(target: any, property: string) {
      if (property === 'isProxy') {
        return true;
      } else if (property === 'onChange') {
        return (n, handler) => {
          target.changeHandlers = target.changeHandlers || {};
          target.changeHandlers[n] = target.changeHandlers[n] || [];
          target.changeHandlers[n].push(handler);
        };
      } else {
        // return a new proxy if possible, add to prefix
        let out = Reflect.get(target, property);
        if (out instanceof Object) {
          return buildProxy(prefix + property + '.', out);
        }
        return out;  // primitive, ignore
      }
    },
  });
}
export default function observe(o: any) {
  return buildProxy('', o);
}
