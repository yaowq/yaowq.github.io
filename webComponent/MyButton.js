const template = document.createElement('template');
template.innerHTML = `
  <style>
  button {
    width: 60px;
    height: 30px;
    cursor: pointer;
    color: blue;
    border: 0;
    border-radius: 5px;
    background-color: #F0F0F0;
  }
  </style>
  <div>
    <button id="btn">Add</button>
    <p id="message"><slot name="my-text">My Default Text</slot></p>
    <ul id="text-list"></ul>
  </div>
`;
const Texts = [
  'My lady, Hello!',
  'BuiBuiBui',
  'BiliBili',
  'Haiwei is NO.1'
]
class MyButton extends HTMLElement {
  constructor () {
    super()
    const content = template.content.cloneNode(true);
    const button = content.querySelector('#btn');
    const textList = content.querySelector('#text-list');
    this.$button = button;
    this.$message = content.querySelector('#message');
    button.addEventListener('click', (evt) => {
      const li = document.createElement('li');
      li.innerText = Texts[Math.floor(Math.random() * 4)];
      textList.appendChild(li);
      this.dispatchEvent(
        new CustomEvent('onClick', {
          detail: 'Hello fom within the Custom Element'
        })
      )
    })
    this.attachShadow({ mode: 'open' }).appendChild(content);
  }
  get text () {
    return this.getAttribute('text');
  }
  set text (value) {
    this.setAttribute('text', value);
  }
  static get observedAttributes() {
    return ['text'];
  }
  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }
  render() {
    this.$message.innerText = this.text;
  }
}

window.customElements.define('my-button', MyButton)
