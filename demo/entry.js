import ChildEl from './child-el';
import DomRepeat from './dom-repeat';
import El from './el';
import UserEditor from './user-editor';

customElements.define('my-el', El);
customElements.define('child-el', ChildEl);
customElements.define('user-editor', UserEditor);
customElements.define('dom-repeat', DomRepeat);

const init = () => {
  customElements.whenDefined('my-el')
    .then(() => {
      const el = document.querySelector('my-el');

      el.user = {
        name: 'charlie',
        surname: 'brown'
      };
      el.friends = ['linus', 'lucy', 'snoopy'];
    });
}

if (document.readyState === 'ready') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}

