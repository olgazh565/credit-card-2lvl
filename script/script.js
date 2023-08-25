import {el, svg, setChildren} from '../node_modules/redom/dist/redom.es.js';
import {mask} from './modules/mask.js';
import {svgFront} from './modules/svg-front.js';
import {svgBack} from './modules/svg-back.js';

// смена цвета у карточки
const swapColor = color => {
  const lightcolor = document.querySelector('.lightcolor');
  const darkcolor = document.querySelectorAll('.darkcolor');

  lightcolor.removeAttribute('class');
  lightcolor.classList.add('lightcolor', `${color}`);

  darkcolor.forEach(input => {
    input.removeAttribute('class');
    input.classList.add('darkcolor', `${color}dark`);
  });
};

const handleCardNumber = () => {
  const cardnumberInput = document.getElementById('cardnumber');
  const ccicon = document.getElementById('ccicon');
  const cclogo = document.getElementById('ccsingle');
  const svgnumber = document.getElementById('svgnumber');

  cardnumberInput.addEventListener('input', ({target}) => {
    if (target.value.length === 0) {
      cclogo.innerHTML = '';
      ccicon.innerHTML = '';
      swapColor('grey');
    }

    target.value = target.value
      .replace(/[\D\s]/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ');

    for (let i = 0; i < mask.length; i++) {
      if (mask[i].regex) {
        const regexp = new RegExp(mask[i].regex, 'g');
        const isMatched = regexp.test(target.value);
        svgnumber.textContent = target.value;

        if (isMatched) {
          cclogo.innerHTML = mask[i].logo;
          ccicon.innerHTML = mask[i].icon;
          swapColor(mask[i].color);
          return;
        } else {
          cclogo.innerHTML = '';
          ccicon.innerHTML = '';
          swapColor('grey');
        }
      }
    }
  });
};

const createTitle = () => el('div', {className: 'payment-title'}, el('h1'));

const createCreditCard = () => {
  const cardFront = el('div', {className: 'front'}, el('div', {id: 'ccsingle'}));
  cardFront.insertAdjacentHTML('beforeend', svgFront);
  const cardBack = el('div', {className: 'back'});
  cardBack.innerHTML = svgBack;
  const creditCard = el('div', {
    className: 'creditcard',
    onclick() {
      this.classList.toggle('flipped');
    },
  });
  const creditCardContainer = el('div', {className: 'container'});
  setChildren(creditCard, [cardFront, cardBack]);
  setChildren(creditCardContainer, creditCard);

  return creditCardContainer;
};

const createForm = () => {
  const formContainer = el('div', {className: 'form-container'});

  setChildren(formContainer, [
    el('div', {className: 'field-container'}, [
      el('label', {htmlFor: 'name'}, 'Name'),
      el('input', {
        id: 'name',
        maxLength: '20',
        type: 'text',
        oninput({target}) {
          const svgname = document.getElementById('svgname');
          const svgnameback = document.getElementById('svgnameback');
          target.value = target.value
            .replace(/[^a-z\s'-]/gi, '').toUpperCase();

          svgname.textContent = target.value;
          svgnameback.textContent = target.value;
        },
      }),
    ]),
    el('div', {className: 'field-container'}, [
      el('label', {htmlFor: 'cardnumber'}, 'Card Number'),
      el('input', {
        id: 'cardnumber',
        maxLength: '19',
        type: 'text',
        pattern: '[0-9]*',
        inputMode: 'numeric',
        oninput() {
          handleCardNumber();
        },
      }),
      svg('svg', {
        id: 'ccicon',
        className: 'ccicon',
        width: '750',
        height: '471',
        viewBox: '0 0 750 471',
        version: '1.1',
        xmlns: 'http://www.w3.org/2000/svg',
        xmlnsXlink: 'http://www.w3.org/1999/xlink',
      }),
    ]),
    el('div', {className: 'field-container'}, [
      el('label', {htmlFor: 'expirationdate'}, 'Expiration (mm/yy)'),
      el('input', {
        id: 'expirationdate',
        maxLength: '5',
        type: 'text',
        pattern: '[0-9]*',
        inputMode: 'numeric',
        oninput({target}) {
          const svgexpire = document.getElementById('svgexpire');
          target.value = target.value
            .replace(/[\D\s]/g, '')
            .replace(/(\d{2})(?=\d)/g, '$1/');
          svgexpire.textContent = target.value;
        },
      }),
    ]),
    el('div', {className: 'field-container'}, [
      el('label', {htmlFor: 'securitycode'}, 'Security Code'),
      el('input', {
        id: 'securitycode',
        maxLength: '3',
        type: 'text',
        pattern: '[0-9]*',
        inputMode: 'numeric',
        oninput({target}) {
          const svgsecurity = document.getElementById('svgsecurity');
          target.value = target.value.replace(/\D+/g, '');
          svgsecurity.textContent = target.value;
        },
        onfocus() {
          document.querySelector('.creditcard').classList.add('flipped');
        },
        onblur() {
          document.querySelector('.creditcard').classList.remove('flipped');
        },
      }),
    ]),
  ]);

  return formContainer;
};

setChildren(document.body, createTitle(), createCreditCard(), createForm());

