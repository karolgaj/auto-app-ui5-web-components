(function (window) {
  window['env'] = window['env'] || {};
  window['env'].ENV = '${ENV_VALUE}'; // not actualized, for local testing
  window['env'].BASE_URI = '${BASE_URI}'; // not actualized, for local testing
})(this);
