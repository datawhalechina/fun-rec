'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var leven = _interopDefault(require('leven'));
var pointer = _interopDefault(require('jsonpointer'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var AJV_ERROR_KEYWORD_WEIGHT_MAP = {
  "enum": 1,
  type: 0
};
var QUOTES_REGEX = /"/g;
var NOT_REGEX = /NOT/g;
var SLASH_REGEX = /\//g;

var filterSingleErrorPerProperty = function filterSingleErrorPerProperty(errors) {
  var errorsPerProperty = errors.reduce(function (acc, error) {
    var _ref, _error$params$additio, _error$params, _error$params2, _AJV_ERROR_KEYWORD_WE, _AJV_ERROR_KEYWORD_WE2;

    var prop = error.instancePath + ((_ref = (_error$params$additio = (_error$params = error.params) == null ? void 0 : _error$params.additionalProperty) != null ? _error$params$additio : (_error$params2 = error.params) == null ? void 0 : _error$params2.missingProperty) != null ? _ref : '');
    var existingError = acc[prop];

    if (!existingError) {
      acc[prop] = error;
      return acc;
    }

    var weight = (_AJV_ERROR_KEYWORD_WE = AJV_ERROR_KEYWORD_WEIGHT_MAP[error.keyword]) != null ? _AJV_ERROR_KEYWORD_WE : 0;
    var existingWeight = (_AJV_ERROR_KEYWORD_WE2 = AJV_ERROR_KEYWORD_WEIGHT_MAP[existingError.keyword]) != null ? _AJV_ERROR_KEYWORD_WE2 : 0;

    if (weight > existingWeight) {
      acc[prop] = error;
    }

    return acc;
  }, {});
  return Object.values(errorsPerProperty);
};

var getSuggestion = function getSuggestion(_ref) {
  var value = _ref.value,
      suggestions = _ref.suggestions,
      _ref$format = _ref.format,
      format = _ref$format === void 0 ? function (suggestion) {
    return "Did you mean '" + suggestion + "'?";
  } : _ref$format;
  var bestSuggestion = suggestions.reduce(function (best, current) {
    var distance = leven(value, current);

    if (best.distance > distance) {
      return {
        value: current,
        distance: distance
      };
    }

    return best;
  }, {
    distance: Infinity,
    value: ''
  });
  return bestSuggestion.distance < value.length ? format(bestSuggestion.value) : '';
};

var pointerToDotNotation = function pointerToDotNotation(pointer) {
  return pointer.replace(SLASH_REGEX, '.');
};
var cleanAjvMessage = function cleanAjvMessage(message) {
  return message.replace(QUOTES_REGEX, "'").replace(NOT_REGEX, 'not');
};
var getLastSegment = function getLastSegment(path) {
  var segments = path.split('/');
  return segments.pop();
};
var safeJsonPointer = function safeJsonPointer(_ref) {
  var object = _ref.object,
      pnter = _ref.pnter,
      fallback = _ref.fallback;

  try {
    return pointer.get(object, pnter);
  } catch (err) {
    return fallback;
  }
};

var betterAjvErrors = function betterAjvErrors(_ref) {
  var errors = _ref.errors,
      data = _ref.data,
      schema = _ref.schema,
      _ref$basePath = _ref.basePath,
      basePath = _ref$basePath === void 0 ? '{base}' : _ref$basePath;

  if (!Array.isArray(errors) || errors.length === 0) {
    return [];
  }

  var definedErrors = filterSingleErrorPerProperty(errors);
  return definedErrors.map(function (error) {
    var path = pointerToDotNotation(basePath + error.instancePath);
    var prop = getLastSegment(error.instancePath);
    var defaultContext = {
      errorType: error.keyword
    };
    var defaultMessage = (prop ? "property '" + prop + "'" : path) + " " + cleanAjvMessage(error.message);
    var validationError;

    switch (error.keyword) {
      case 'additionalProperties':
        {
          var additionalProp = error.params.additionalProperty;
          var suggestionPointer = error.schemaPath.replace('#', '').replace('/additionalProperties', '');

          var _safeJsonPointer = safeJsonPointer({
            object: schema,
            pnter: suggestionPointer,
            fallback: {
              properties: {}
            }
          }),
              properties = _safeJsonPointer.properties;

          validationError = {
            message: "'" + additionalProp + "' property is not expected to be here",
            suggestion: getSuggestion({
              value: additionalProp,
              suggestions: Object.keys(properties != null ? properties : {}),
              format: function format(suggestion) {
                return "Did you mean property '" + suggestion + "'?";
              }
            }),
            path: path,
            context: defaultContext
          };
          break;
        }

      case 'enum':
        {
          var suggestions = error.params.allowedValues.map(function (value) {
            return value.toString();
          });

          var _prop = getLastSegment(error.instancePath);

          var value = safeJsonPointer({
            object: data,
            pnter: error.instancePath,
            fallback: ''
          });
          validationError = {
            message: "'" + _prop + "' property must be equal to one of the allowed values",
            suggestion: getSuggestion({
              value: value,
              suggestions: suggestions
            }),
            path: path,
            context: _extends({}, defaultContext, {
              allowedValues: error.params.allowedValues
            })
          };
          break;
        }

      case 'type':
        {
          var _prop2 = getLastSegment(error.instancePath);

          var type = error.params.type;
          validationError = {
            message: "'" + _prop2 + "' property type must be " + type,
            path: path,
            context: defaultContext
          };
          break;
        }

      case 'required':
        {
          validationError = {
            message: path + " must have required property '" + error.params.missingProperty + "'",
            path: path,
            context: defaultContext
          };
          break;
        }

      case 'const':
        {
          return {
            message: "'" + prop + "' property must be equal to the allowed value",
            path: path,
            context: _extends({}, defaultContext, {
              allowedValue: error.params.allowedValue
            })
          };
        }

      default:
        return {
          message: defaultMessage,
          path: path,
          context: defaultContext
        };
    } // Remove empty properties


    var errorEntries = Object.entries(validationError);

    for (var _i = 0, _errorEntries = errorEntries; _i < _errorEntries.length; _i++) {
      var _errorEntries$_i = _errorEntries[_i],
          key = _errorEntries$_i[0],
          _value = _errorEntries$_i[1];

      if (_value === null || _value === undefined || _value === '') {
        delete validationError[key];
      }
    }

    return validationError;
  });
};

exports.betterAjvErrors = betterAjvErrors;
//# sourceMappingURL=better-ajv-errors.cjs.development.js.map
