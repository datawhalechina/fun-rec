var configuration = require('../configuration');

function restoreWithComponents(property) {
  var descriptor = configuration[property.name];

  if (descriptor && descriptor.shorthand) {
    return descriptor.restore(property, configuration);
  } else {
    return property.value;
  }
}

module.exports = restoreWithComponents;
