(function() {
  'use strict';

  function DOM(elements) {
    if(!(this instanceof DOM)) return new DOM(elements);
    this.element = document.querySelectorAll(elements);
  }

  DOM.prototype.on = function on(event, callback) {
    Array.prototype.forEach.call(this.element, item => item.addEventListener(event, callback, false));
  }

  DOM.prototype.off = function off(event, callback) {
    Array.prototype.forEach.call(this.element, item => item.removeEventListener(event, callback, false));
  }

  DOM.prototype.get = function get(index) {
    if(!index)
      index = 0;

    return this.element[index];
  }

  DOM.prototype.forEach = function forEach() {
    Array.prototype.forEach.apply(this.element, arguments);
  }

  DOM.prototype.map = function map() {
    return Array.prototype.map.apply(this.element, arguments);
  }

  DOM.prototype.filter = function filter() {
    return Array.prototype.filter.apply(this.element, arguments);
  }

  DOM.prototype.reduce = function reduce() {
    return Array.prototype.reduce.apply(this.element, arguments);
  }

  DOM.prototype.reduceRight = function reduceRight() {
    return Array.prototype.reduceRight.apply(this.element, arguments);
  }

  DOM.prototype.every = function every() {
    return Array.prototype.every.apply(this.element, arguments);
  }

  DOM.prototype.some = function some() {
    return Array.prototype.some.apply(this.element, arguments);
  }

  function getTypeOfObj(obj) {
    return Object.prototype.toString.call(obj);
  }

  DOM.isArray = function isArray(obj) {
    return getTypeOfObj(obj) === '[object Array]'
  }

  DOM.isObject = function isObject(obj) {
    return getTypeOfObj(obj) === '[object Object]'
  }

  DOM.isFunction = function isFunction(obj) {
    return getTypeOfObj(obj) === '[object Function]'
  }

  DOM.isNumber = function isNumber(obj) {
    return getTypeOfObj(obj) === '[object Number]'
  }

  DOM.isString = function isString(obj) {
    return getTypeOfObj(obj) === '[object String]'
  }

  DOM.isBoolean = function isBoolean(obj) {
    return getTypeOfObj(obj) === '[object Boolean]'
  }

  DOM.isNull = function isNull(obj) {
    const type = getTypeOfObj(obj);
    return type === '[object Undefined]' || type === '[object Null]';
  }

  window.DOM = DOM;
})();
