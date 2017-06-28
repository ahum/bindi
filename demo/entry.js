import El, { ChildEl } from './el';
customElements.define('my-el', El);
customElements.define('child-el', ChildEl);


const init = () => {
  customElements.whenDefined('my-el')
    .then(() => {
      const el = document.querySelector('my-el');


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

