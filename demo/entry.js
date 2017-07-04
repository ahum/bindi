import El, { ChildEl, DomRepeat, UserEditor } from './el';

import observe from '../src/observe';

customElements.define('my-el', El);
customElements.define('child-el', ChildEl);
customElements.define('user-editor', UserEditor);
customElements.define('dom-repeat', DomRepeat);

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
      el.names = [
        'ed', 'fiona', 'ervin'
      ];

      el.user = {
        name: 'ed',
        surname: 'eustace'
      };
    });
}

if (document.readyState === 'ready') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}

