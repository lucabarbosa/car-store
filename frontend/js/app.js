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
    const $tableCar = $('[data-js="table-cars"]').get();

    return {
      init: function init() {
        this.loadcompanyInfo();
        this.initEvents();
        app.ajax.get(
          'http://localhost:3000/car',
          app.loadCars.showAllCars
        );
      },

      initEvents: function initEvents() {
        $('[data-js="form-register"]').on('submit', this.handleSubmit);
      },

      handleSubmit: function handleSubmit(event) {
        event.preventDefault();
        app.createCar();
      },

      ajax: {
        post: function post(url, callback, data) {
          const ajax = new XMLHttpRequest();
          ajax.open('POST', url, true);
          ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          ajax.send(data);
          ajax.addEventListener('readystatechange', callback, false);
        },

        get: function get(url, callback) {
          const ajax = new XMLHttpRequest();
          ajax.open('GET', url, true);
          ajax.send();
          ajax.addEventListener('readystatechange', callback, false);
        },

        delete: function (url, callback, data) {
          const ajax = new XMLHttpRequest();
          ajax.open('DELETE', url, true);
          ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          ajax.send(data);
          ajax.addEventListener('readystatechange', callback, false);
        }
      },

      isRequestReady: function isRequestReady(request) {
        return request.readyState === 4 && request.status === 200;
      },

      createCar: function createCar() {
        const car = {
          image: $('[data-js="input-image"]').get().value,
          brandModel: $('[data-js="input-model"]').get().value,
          year: $('[data-js="input-year"]').get().value,
          plate: $('[data-js="input-plate"]').get().value,
          color: $('[data-js="input-color"]').get().value
        }

        app.ajax.post(
          'http://localhost:3000/car',
          this.handleCreateCar,
          `image=${ car.image }&brandModel=${ car.brandModel }&year=${ car.year }&plate=${ car.plate }&color=${ car.color }`
        );
      },

      handleCreateCar: function handleCreateCar() {
        if(!app.isRequestReady(this)) {
          return;
        }

        if(JSON.parse(this.responseText)['message'] === 'success') {
          app.ajax.get(
            'http://localhost:3000/car',
            app.loadCars.showLastCar
          );
        }
      },

      loadCars: {
        showLastCar: function showLastCar() {
          if(!app.isRequestReady(this)) {
            return;
          }

          const cars = JSON.parse(this.responseText);
          app.fillCarTable(cars[cars.length - 1]);
        },

        showAllCars: function showAllCars() {
          if(!app.isRequestReady(this)) {
            return;
          }

          const cars = JSON.parse(this.responseText);
          cars.forEach(app.fillCarTable);
        }
      },

      fillCarTable: function fillCarTable(car) {
        $tableCar.appendChild(app.createTableRow(car));
      },

      createTableRow: function createTableRow(car) {
        const $fragment = document.createDocumentFragment();

        const $tr = document.createElement('tr');
        const $tdImage = document.createElement('td');
        const $image = document.createElement('img');
        const $tdModel = document.createElement('td');
        const $tdYear = document.createElement('td');
        const $tdPlate = document.createElement('td');
        const $tdColor = document.createElement('td');
        const $tdRemoveCar = document.createElement('td');

        $image.setAttribute('src', car.image);
        $tdImage.appendChild($image);
        $tdModel.textContent = car.brandModel;
        $tdYear.textContent = car.year;
        $tdPlate.textContent = car.plate;
        $tdColor.textContent = car.color;
        $tdRemoveCar.innerHTML = '<button data-js="button-remove"><i class="fa fa-trash" aria-hidden="true"></i></button>';
        $tdRemoveCar.addEventListener('click', app.removeCar, false);

        $tr.appendChild($tdImage);
        $tr.appendChild($tdModel);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdPlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($tdRemoveCar);

        return $fragment.appendChild($tr);
      },

      loadcompanyInfo: function loadcompanyInfo() {
        app.ajax.get(
          'https://api.myjson.com/bins/19taqv',
          app.fillCompanyInfo
        );
      },

      fillCompanyInfo: function fillCompanyInfo() {
        if(!app.isRequestReady(this)) {
          return;
        }

        const data = JSON.parse(this.responseText);
        $('[data-js="company-name"]').get().textContent = data['name'];
        $('[data-js="company-contact"]').get().textContent = data['phone'];
      },

      removeCar: function removeCar() {
        const carRowIndex = app.getRowIndex.call(this);
        const plate = $tableCar.rows[carRowIndex].cells[3].textContent;

        app.ajax.delete(
          'http://localhost:3000/car',
          app.handleRemoveCar(carRowIndex),
          `plate=${ plate }`
        );

      },

      handleRemoveCar: function handleRemoveCar(carRowIndex) {
        return function handleRemoveCar() {
          if(!app.isRequestReady(this)) {
            return;
          }

          if(JSON.parse(this.responseText)['message'] === 'success') {
            $tableCar.deleteRow(carRowIndex);
          }
        }
      },

      getRowIndex: function getRowIndex() {
        return this.parentNode.rowIndex - 1;
      }
    }
  })();

  app.init();
})(window.DOM);
