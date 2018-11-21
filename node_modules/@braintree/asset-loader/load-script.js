'use strict';

var Promise = require('./lib/promise');

module.exports = function loadScript(options) {
  var attrs, container, script;

  if (!options.forceScriptReload) {
    script = document.querySelector('script[src="' + options.src + '"]');

    if (script) {
      return Promise.resolve(script);
    }
  }

  script = document.createElement('script');
  attrs = options.dataAttributes || {};
  container = options.container || document.head;

  script.src = options.src;
  script.id = options.id;
  script.async = true;

  Object.keys(attrs).forEach(function (key) {
    script.setAttribute('data-' + key, attrs[key]);
  });

  return new Promise(function (resolve, reject) {
    script.addEventListener('load', function () {
      resolve(script);
    });
    script.addEventListener('error', function () {
      reject(new Error(options.src + ' failed to load.'));
    });
    script.addEventListener('abort', function () {
      reject(new Error(options.src + ' has aborted.'));
    });
    container.appendChild(script);
  });
};
