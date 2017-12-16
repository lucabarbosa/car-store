(function($) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */


  const app = (function() {
    return {
      init: function init() {
        this.companyInfo();
        this.initEvents();
      },

      initEvents: function initEvents() {
        $('[data-js="form-register"]').on('submit', this.handleSubmit);
      },

      handleSubmit: function handleSubmit(event) {
        event.preventDefault();
        const $tableCar = $('[data-js="table-cars"]').get();
        $tableCar.appendChild(app.createNewCar());
      },

      createNewCar: function createNewCar() {
        const $fragment = document.createDocumentFragment();
        const $tr = document.createElement('tr');
        const $tdImage = document.createElement('td');
        const $image = document.createElement('img');
        const $tdModel = document.createElement('td');
        const $tdYear = document.createElement('td');
        const $tdPlate = document.createElement('td');
        const $tdColor = document.createElement('td');
        const $tdRemoveCar = document.createElement('td');

        $image.setAttribute('src', $('[data-js="input-image"]').get().value);
        $tdImage.appendChild($image);
        $tdModel.textContent = $('[data-js="input-model"]').get().value;
        $tdYear.textContent = $('[data-js="input-year"]').get().value;
        $tdPlate.textContent = $('[data-js="input-plate"]').get().value;
        $tdColor.textContent = $('[data-js="input-color"]').get().value;
        $tdRemoveCar.innerHTML = '<button><i class="fa fa-trash" aria-hidden="true"></i></button>';
        $tdRemoveCar.addEventListener('click', this.removeCar, false);

        $tr.appendChild($tdImage);
        $tr.appendChild($tdModel);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdPlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($tdRemoveCar);

        return $fragment.appendChild($tr);
      },

      removeCar: function removeCar() {
        $('[data-js="table-cars"]').get().deleteRow(app.getRowIndex.call(this));
      },

      getRowIndex: function getRowIndex() {
        return this.parentNode.rowIndex - 1;
      },

      companyInfo: function companyInfo() {
        const ajax = new XMLHttpRequest();
        ajax.open('GET', 'https://api.myjson.com/bins/19taqv', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
      },

      getCompanyInfo: function getCompanyInfo() {
        if(!app.isReady.call(this)) {
          return;
        }

        const data = JSON.parse(this.responseText);
        $('[data-js="company-name"]').get().textContent = data['name'];
        $('[data-js="company-contact"]').get().textContent = data['phone'];
      },

      isReady: function isReady() {
        return this.readyState === 4 && this.status === 200;
      }

    }
  })();

  app.init();
})(window.DOM);
