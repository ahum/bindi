import El, { ChildEl } from './el';

import observe from '../src/observe';

customElements.define('my-el', El);
customElements.define('child-el', ChildEl);


const user = {
  name: 'ed'
}

const observedUser = observe(user);

console.log('>> ', observedUser, observedUser.isProxy);
observedUser.onChange('name', (n) => {
  console.log('new name...', n);
  console.log('user.name:', user.name);
});

observedUser.name = 'joe';

const init = () => {
  customElements.whenDefined('my-el')
    .then(() => {
      const el = document.querySelector('my-el');

      el.user = {
        name: 'ed'
      };

      el.name = 'ed';
      el.surname = 'eustace';
      el.foo = 'foo';
    });

}

if (document.readyState === 'ready') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}

