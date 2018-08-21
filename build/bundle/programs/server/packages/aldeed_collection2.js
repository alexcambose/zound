(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Collection2;

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:collection2":{"collection2.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/aldeed_collection2/collection2.js                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _interopRequireDefault = require("@babel/runtime/helpers/builtin/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/objectSpread"));

let EventEmitter;
module.watch(require("meteor/raix:eventemitter"), {
  EventEmitter(v) {
    EventEmitter = v;
  }

}, 0);
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 2);
let checkNpmVersions;
module.watch(require("meteor/tmeasday:check-npm-versions"), {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 3);
let clone;
module.watch(require("clone"), {
  default(v) {
    clone = v;
  }

}, 4);
let EJSON;
module.watch(require("ejson"), {
  default(v) {
    EJSON = v;
  }

}, 5);
let isEmpty;
module.watch(require("lodash.isempty"), {
  default(v) {
    isEmpty = v;
  }

}, 6);
let isEqual;
module.watch(require("lodash.isequal"), {
  default(v) {
    isEqual = v;
  }

}, 7);
let isObject;
module.watch(require("lodash.isobject"), {
  default(v) {
    isObject = v;
  }

}, 8);
checkNpmVersions({
  'simpl-schema': '>=0.0.0'
}, 'aldeed:collection2');

const SimpleSchema = require('simpl-schema').default; // Exported only for listening to events


const Collection2 = new EventEmitter();
const defaultCleanOptions = {
  filter: true,
  autoConvert: true,
  removeEmptyStrings: true,
  trimStrings: true,
  removeNullsFromArrays: false
};
/**
 * Mongo.Collection.prototype.attachSchema
 * @param {SimpleSchema|Object} ss - SimpleSchema instance or a schema definition object
 *    from which to create a new SimpleSchema instance
 * @param {Object} [options]
 * @param {Boolean} [options.transform=false] Set to `true` if your document must be passed
 *    through the collection's transform to properly validate.
 * @param {Boolean} [options.replace=false] Set to `true` to replace any existing schema instead of combining
 * @return {undefined}
 *
 * Use this method to attach a schema to a collection created by another package,
 * such as Meteor.users. It is most likely unsafe to call this method more than
 * once for a single collection, or to call this for a collection that had a
 * schema object passed to its constructor.
 */

Mongo.Collection.prototype.attachSchema = function c2AttachSchema(ss, options) {
  options = options || {}; // Allow passing just the schema object

  if (!(ss instanceof SimpleSchema)) {
    ss = new SimpleSchema(ss);
  }

  this._c2 = this._c2 || {}; // If we've already attached one schema, we combine both into a new schema unless options.replace is `true`

  if (this._c2._simpleSchema && options.replace !== true) {
    if (ss.version >= 2) {
      var newSS = new SimpleSchema(this._c2._simpleSchema);
      newSS.extend(ss);
      ss = newSS;
    } else {
      ss = new SimpleSchema([this._c2._simpleSchema, ss]);
    }
  }

  var selector = options.selector;

  function attachTo(obj) {
    if (typeof selector === "object") {
      // Index of existing schema with identical selector
      var schemaIndex = -1; // we need an array to hold multiple schemas

      obj._c2._simpleSchemas = obj._c2._simpleSchemas || []; // Loop through existing schemas with selectors

      obj._c2._simpleSchemas.forEach((schema, index) => {
        // if we find a schema with an identical selector, save it's index
        if (isEqual(schema.selector, selector)) {
          schemaIndex = index;
        }
      });

      if (schemaIndex === -1) {
        // We didn't find the schema in our array - push it into the array
        obj._c2._simpleSchemas.push({
          schema: new SimpleSchema(ss),
          selector: selector
        });
      } else {
        // We found a schema with an identical selector in our array,
        if (options.replace !== true) {
          // Merge with existing schema unless options.replace is `true`
          if (obj._c2._simpleSchemas[schemaIndex].schema.version >= 2) {
            obj._c2._simpleSchemas[schemaIndex].schema.extend(ss);
          } else {
            obj._c2._simpleSchemas[schemaIndex].schema = new SimpleSchema([obj._c2._simpleSchemas[schemaIndex].schema, ss]);
          }
        } else {
          // If options.repalce is `true` replace existing schema with new schema
          obj._c2._simpleSchemas[schemaIndex].schema = ss;
        }
      } // Remove existing schemas without selector


      delete obj._c2._simpleSchema;
    } else {
      // Track the schema in the collection
      obj._c2._simpleSchema = ss; // Remove existing schemas with selector

      delete obj._c2._simpleSchemas;
    }
  }

  attachTo(this); // Attach the schema to the underlying LocalCollection, too

  if (this._collection instanceof LocalCollection) {
    this._collection._c2 = this._collection._c2 || {};
    attachTo(this._collection);
  }

  defineDeny(this, options);
  keepInsecure(this);
  Collection2.emit('schema.attached', this, ss, options);
};

[Mongo.Collection, LocalCollection].forEach(obj => {
  /**
   * simpleSchema
   * @description function detect the correct schema by given params. If it
   * detect multi-schema presence in the collection, then it made an attempt to find a
   * `selector` in args
   * @param {Object} doc - It could be <update> on update/upsert or document
   * itself on insert/remove
   * @param {Object} [options] - It could be <update> on update/upsert etc
   * @param {Object} [query] - it could be <query> on update/upsert
   * @return {Object} Schema
   */
  obj.prototype.simpleSchema = function (doc, options, query) {
    if (!this._c2) return null;
    if (this._c2._simpleSchema) return this._c2._simpleSchema;
    var schemas = this._c2._simpleSchemas;

    if (schemas && schemas.length > 0) {
      if (!doc) throw new Error('collection.simpleSchema() requires doc argument when there are multiple schemas');
      var schema, selector, target;

      for (var i = 0; i < schemas.length; i++) {
        schema = schemas[i];
        selector = Object.keys(schema.selector)[0]; // We will set this to undefined because in theory you might want to select
        // on a null value.

        target = undefined; // here we are looking for selector in different places
        // $set should have more priority here

        if (doc.$set && typeof doc.$set[selector] !== 'undefined') {
          target = doc.$set[selector];
        } else if (typeof doc[selector] !== 'undefined') {
          target = doc[selector];
        } else if (options && options.selector) {
          target = options.selector[selector];
        } else if (query && query[selector]) {
          // on upsert/update operations
          target = query[selector];
        } // we need to compare given selector with doc property or option to
        // find right schema


        if (target !== undefined && target === schema.selector[selector]) {
          return schema.schema;
        }
      }
    }

    return null;
  };
}); // Wrap DB write operation methods

['insert', 'update'].forEach(methodName => {
  const _super = Mongo.Collection.prototype[methodName];

  Mongo.Collection.prototype[methodName] = function (...args) {
    let options = methodName === "insert" ? args[1] : args[2]; // Support missing options arg

    if (!options || typeof options === "function") {
      options = {};
    }

    if (this._c2 && options.bypassCollection2 !== true) {
      var userId = null;

      try {
        // https://github.com/aldeed/meteor-collection2/issues/175
        userId = Meteor.userId();
      } catch (err) {}

      args = doValidate(this, methodName, args, Meteor.isServer || this._connection === null, // getAutoValues
      userId, Meteor.isServer // isFromTrustedCode
      );

      if (!args) {
        // doValidate already called the callback or threw the error so we're done.
        // But insert should always return an ID to match core behavior.
        return methodName === "insert" ? this._makeNewID() : undefined;
      }
    } else {
      // We still need to adjust args because insert does not take options
      if (methodName === "insert" && typeof args[1] !== 'function') args.splice(1, 1);
    }

    return _super.apply(this, args);
  };
});
/*
 * Private
 */

function doValidate(collection, type, args, getAutoValues, userId, isFromTrustedCode) {
  var doc, callback, error, options, isUpsert, selector, last, hasCallback;

  if (!args.length) {
    throw new Error(type + " requires an argument");
  } // Gather arguments and cache the selector


  if (type === "insert") {
    doc = args[0];
    options = args[1];
    callback = args[2]; // The real insert doesn't take options

    if (typeof options === "function") {
      args = [doc, options];
    } else if (typeof callback === "function") {
      args = [doc, callback];
    } else {
      args = [doc];
    }
  } else if (type === "update") {
    selector = args[0];
    doc = args[1];
    options = args[2];
    callback = args[3];
  } else {
    throw new Error("invalid type argument");
  }

  var validatedObjectWasInitiallyEmpty = isEmpty(doc); // Support missing options arg

  if (!callback && typeof options === "function") {
    callback = options;
    options = {};
  }

  options = options || {};
  last = args.length - 1;
  hasCallback = typeof args[last] === 'function'; // If update was called with upsert:true, flag as an upsert

  isUpsert = type === "update" && options.upsert === true; // we need to pass `doc` and `options` to `simpleSchema` method, that's why
  // schema declaration moved here

  var schema = collection.simpleSchema(doc, options, selector);
  var isLocalCollection = collection._connection === null; // On the server and for local collections, we allow passing `getAutoValues: false` to disable autoValue functions

  if ((Meteor.isServer || isLocalCollection) && options.getAutoValues === false) {
    getAutoValues = false;
  } // Determine validation context


  var validationContext = options.validationContext;

  if (validationContext) {
    if (typeof validationContext === 'string') {
      validationContext = schema.namedContext(validationContext);
    }
  } else {
    validationContext = schema.namedContext();
  } // Add a default callback function if we're on the client and no callback was given


  if (Meteor.isClient && !callback) {
    // Client can't block, so it can't report errors by exception,
    // only by callback. If they forget the callback, give them a
    // default one that logs the error, so they aren't totally
    // baffled if their writes don't work because their database is
    // down.
    callback = function (err) {
      if (err) {
        Meteor._debug(type + " failed: " + (err.reason || err.stack));
      }
    };
  } // If client validation is fine or is skipped but then something
  // is found to be invalid on the server, we get that error back
  // as a special Meteor.Error that we need to parse.


  if (Meteor.isClient && hasCallback) {
    callback = args[last] = wrapCallbackForParsingServerErrors(validationContext, callback);
  }

  var schemaAllowsId = schema.allowsKey("_id");

  if (type === "insert" && !doc._id && schemaAllowsId) {
    doc._id = collection._makeNewID();
  } // Get the docId for passing in the autoValue/custom context


  var docId;

  if (type === 'insert') {
    docId = doc._id; // might be undefined
  } else if (type === "update" && selector) {
    docId = typeof selector === 'string' || selector instanceof Mongo.ObjectID ? selector : selector._id;
  } // If _id has already been added, remove it temporarily if it's
  // not explicitly defined in the schema.


  var cachedId;

  if (doc._id && !schemaAllowsId) {
    cachedId = doc._id;
    delete doc._id;
  }

  const autoValueContext = {
    isInsert: type === "insert",
    isUpdate: type === "update" && options.upsert !== true,
    isUpsert,
    userId,
    isFromTrustedCode,
    docId,
    isLocalCollection
  };
  const extendAutoValueContext = (0, _objectSpread2.default)({}, (schema._cleanOptions || {}).extendAutoValueContext || {}, autoValueContext, options.extendAutoValueContext);
  const cleanOptionsForThisOperation = {};
  ["autoConvert", "filter", "removeEmptyStrings", "removeNullsFromArrays", "trimStrings"].forEach(prop => {
    if (typeof options[prop] === "boolean") {
      cleanOptionsForThisOperation[prop] = options[prop];
    }
  }); // Preliminary cleaning on both client and server. On the server and for local
  // collections, automatic values will also be set at this point.

  schema.clean(doc, (0, _objectSpread2.default)({
    mutate: true,
    // Clean the doc/modifier in place
    isModifier: type !== "insert"
  }, defaultCleanOptions, schema._cleanOptions || {}, cleanOptionsForThisOperation, {
    extendAutoValueContext,
    // This was extended separately above
    getAutoValues // Force this override

  })); // We clone before validating because in some cases we need to adjust the
  // object a bit before validating it. If we adjusted `doc` itself, our
  // changes would persist into the database.

  var docToValidate = {};

  for (var prop in doc) {
    // We omit prototype properties when cloning because they will not be valid
    // and mongo omits them when saving to the database anyway.
    if (Object.prototype.hasOwnProperty.call(doc, prop)) {
      docToValidate[prop] = doc[prop];
    }
  } // On the server, upserts are possible; SimpleSchema handles upserts pretty
  // well by default, but it will not know about the fields in the selector,
  // which are also stored in the database if an insert is performed. So we
  // will allow these fields to be considered for validation by adding them
  // to the $set in the modifier. This is no doubt prone to errors, but there
  // probably isn't any better way right now.


  if (Meteor.isServer && isUpsert && isObject(selector)) {
    var set = docToValidate.$set || {}; // If selector uses $and format, convert to plain object selector

    if (Array.isArray(selector.$and)) {
      const plainSelector = {};
      selector.$and.forEach(sel => {
        Object.assign(plainSelector, sel);
      });
      docToValidate.$set = plainSelector;
    } else {
      docToValidate.$set = clone(selector);
    }

    if (!schemaAllowsId) delete docToValidate.$set._id;
    Object.assign(docToValidate.$set, set);
  } // Set automatic values for validation on the client.
  // On the server, we already updated doc with auto values, but on the client,
  // we will add them to docToValidate for validation purposes only.
  // This is because we want all actual values generated on the server.


  if (Meteor.isClient && !isLocalCollection) {
    schema.clean(docToValidate, {
      autoConvert: false,
      extendAutoValueContext,
      filter: false,
      getAutoValues: true,
      isModifier: type !== "insert",
      mutate: true,
      // Clean the doc/modifier in place
      removeEmptyStrings: false,
      removeNullsFromArrays: false,
      trimStrings: false
    });
  } // XXX Maybe move this into SimpleSchema


  if (!validatedObjectWasInitiallyEmpty && isEmpty(docToValidate)) {
    throw new Error('After filtering out keys not in the schema, your ' + (type === 'update' ? 'modifier' : 'object') + ' is now empty');
  } // Validate doc


  var isValid;

  if (options.validate === false) {
    isValid = true;
  } else {
    isValid = validationContext.validate(docToValidate, {
      modifier: type === "update" || type === "upsert",
      upsert: isUpsert,
      extendedCustomContext: (0, _objectSpread2.default)({
        isInsert: type === "insert",
        isUpdate: type === "update" && options.upsert !== true,
        isUpsert,
        userId,
        isFromTrustedCode,
        docId,
        isLocalCollection
      }, options.extendedCustomContext || {})
    });
  }

  if (isValid) {
    // Add the ID back
    if (cachedId) {
      doc._id = cachedId;
    } // Update the args to reflect the cleaned doc
    // XXX not sure this is necessary since we mutate


    if (type === "insert") {
      args[0] = doc;
    } else {
      args[1] = doc;
    } // If callback, set invalidKey when we get a mongo unique error


    if (Meteor.isServer && hasCallback) {
      args[last] = wrapCallbackForParsingMongoValidationErrors(validationContext, args[last]);
    }

    return args;
  } else {
    error = getErrorObject(validationContext, `in ${collection._name} ${type}`);

    if (callback) {
      // insert/update/upsert pass `false` when there's an error, so we do that
      callback(error, false);
    } else {
      throw error;
    }
  }
}

function getErrorObject(context, appendToMessage = '') {
  let message;
  const invalidKeys = typeof context.validationErrors === 'function' ? context.validationErrors() : context.invalidKeys();

  if (invalidKeys.length) {
    const firstErrorKey = invalidKeys[0].name;
    const firstErrorMessage = context.keyErrorMessage(firstErrorKey); // If the error is in a nested key, add the full key to the error message
    // to be more helpful.

    if (firstErrorKey.indexOf('.') === -1) {
      message = firstErrorMessage;
    } else {
      message = `${firstErrorMessage} (${firstErrorKey})`;
    }
  } else {
    message = "Failed validation";
  }

  message = `${message} ${appendToMessage}`.trim();
  const error = new Error(message);
  error.invalidKeys = invalidKeys;
  error.validationContext = context; // If on the server, we add a sanitized error, too, in case we're
  // called from a method.

  if (Meteor.isServer) {
    error.sanitizedError = new Meteor.Error(400, message, EJSON.stringify(error.invalidKeys));
  }

  return error;
}

function addUniqueError(context, errorMessage) {
  var name = errorMessage.split('c2_')[1].split(' ')[0];
  var val = errorMessage.split('dup key:')[1].split('"')[1];
  var addValidationErrorsPropName = typeof context.addValidationErrors === 'function' ? 'addValidationErrors' : 'addInvalidKeys';
  context[addValidationErrorsPropName]([{
    name: name,
    type: 'notUnique',
    value: val
  }]);
}

function wrapCallbackForParsingMongoValidationErrors(validationContext, cb) {
  return function wrappedCallbackForParsingMongoValidationErrors(...args) {
    const error = args[0];

    if (error && (error.name === "MongoError" && error.code === 11001 || error.message.indexOf('MongoError: E11000' !== -1)) && error.message.indexOf('c2_') !== -1) {
      addUniqueError(validationContext, error.message);
      args[0] = getErrorObject(validationContext);
    }

    return cb.apply(this, args);
  };
}

function wrapCallbackForParsingServerErrors(validationContext, cb) {
  var addValidationErrorsPropName = typeof validationContext.addValidationErrors === 'function' ? 'addValidationErrors' : 'addInvalidKeys';
  return function wrappedCallbackForParsingServerErrors(...args) {
    const error = args[0]; // Handle our own validation errors

    if (error instanceof Meteor.Error && error.error === 400 && error.reason === "INVALID" && typeof error.details === "string") {
      var invalidKeysFromServer = EJSON.parse(error.details);
      validationContext[addValidationErrorsPropName](invalidKeysFromServer);
      args[0] = getErrorObject(validationContext);
    } // Handle Mongo unique index errors, which are forwarded to the client as 409 errors
    else if (error instanceof Meteor.Error && error.error === 409 && error.reason && error.reason.indexOf('E11000') !== -1 && error.reason.indexOf('c2_') !== -1) {
        addUniqueError(validationContext, error.reason);
        args[0] = getErrorObject(validationContext);
      }

    return cb.apply(this, args);
  };
}

var alreadyInsecured = {};

function keepInsecure(c) {
  // If insecure package is in use, we need to add allow rules that return
  // true. Otherwise, it would seemingly turn off insecure mode.
  if (Package && Package.insecure && !alreadyInsecured[c._name]) {
    c.allow({
      insert: function () {
        return true;
      },
      update: function () {
        return true;
      },
      remove: function () {
        return true;
      },
      fetch: [],
      transform: null
    });
    alreadyInsecured[c._name] = true;
  } // If insecure package is NOT in use, then adding the two deny functions
  // does not have any effect on the main app's security paradigm. The
  // user will still be required to add at least one allow function of her
  // own for each operation for this collection. And the user may still add
  // additional deny functions, but does not have to.

}

var alreadyDefined = {};

function defineDeny(c, options) {
  if (!alreadyDefined[c._name]) {
    var isLocalCollection = c._connection === null; // First define deny functions to extend doc with the results of clean
    // and autovalues. This must be done with "transform: null" or we would be
    // extending a clone of doc and therefore have no effect.

    c.deny({
      insert: function (userId, doc) {
        // Referenced doc is cleaned in place
        c.simpleSchema(doc).clean(doc, {
          mutate: true,
          isModifier: false,
          // We don't do these here because they are done on the client if desired
          filter: false,
          autoConvert: false,
          removeEmptyStrings: false,
          trimStrings: false,
          extendAutoValueContext: {
            isInsert: true,
            isUpdate: false,
            isUpsert: false,
            userId: userId,
            isFromTrustedCode: false,
            docId: doc._id,
            isLocalCollection: isLocalCollection
          }
        });
        return false;
      },
      update: function (userId, doc, fields, modifier) {
        // Referenced modifier is cleaned in place
        c.simpleSchema(modifier).clean(modifier, {
          mutate: true,
          isModifier: true,
          // We don't do these here because they are done on the client if desired
          filter: false,
          autoConvert: false,
          removeEmptyStrings: false,
          trimStrings: false,
          extendAutoValueContext: {
            isInsert: false,
            isUpdate: true,
            isUpsert: false,
            userId: userId,
            isFromTrustedCode: false,
            docId: doc && doc._id,
            isLocalCollection: isLocalCollection
          }
        });
        return false;
      },
      fetch: ['_id'],
      transform: null
    }); // Second define deny functions to validate again on the server
    // for client-initiated inserts and updates. These should be
    // called after the clean/autovalue functions since we're adding
    // them after. These must *not* have "transform: null" if options.transform is true because
    // we need to pass the doc through any transforms to be sure
    // that custom types are properly recognized for type validation.

    c.deny((0, _objectSpread2.default)({
      insert: function (userId, doc) {
        // We pass the false options because we will have done them on client if desired
        doValidate(c, "insert", [doc, {
          trimStrings: false,
          removeEmptyStrings: false,
          filter: false,
          autoConvert: false
        }, function (error) {
          if (error) {
            throw new Meteor.Error(400, 'INVALID', EJSON.stringify(error.invalidKeys));
          }
        }], false, // getAutoValues
        userId, false // isFromTrustedCode
        );
        return false;
      },
      update: function (userId, doc, fields, modifier) {
        // NOTE: This will never be an upsert because client-side upserts
        // are not allowed once you define allow/deny functions.
        // We pass the false options because we will have done them on client if desired
        doValidate(c, "update", [{
          _id: doc && doc._id
        }, modifier, {
          trimStrings: false,
          removeEmptyStrings: false,
          filter: false,
          autoConvert: false
        }, function (error) {
          if (error) {
            throw new Meteor.Error(400, 'INVALID', EJSON.stringify(error.invalidKeys));
          }
        }], false, // getAutoValues
        userId, false // isFromTrustedCode
        );
        return false;
      },
      fetch: ['_id']
    }, options.transform === true ? {} : {
      transform: null
    })); // note that we've already done this collection so that we don't do it again
    // if attachSchema is called again

    alreadyDefined[c._name] = true;
  }
}

module.exportDefault(Collection2);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"clone":{"package.json":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// node_modules/meteor/aldeed_collection2/node_modules/clone/package.json                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
exports.name = "clone";
exports.version = "2.1.1";
exports.main = "clone.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"clone.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// node_modules/meteor/aldeed_collection2/node_modules/clone/clone.js                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.useNode();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"ejson":{"package.json":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// node_modules/meteor/aldeed_collection2/node_modules/ejson/package.json                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
exports.name = "ejson";
exports.version = "2.1.2";
exports.main = "index.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// node_modules/meteor/aldeed_collection2/node_modules/ejson/index.js                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.useNode();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lodash.isempty":{"package.json":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// node_modules/meteor/aldeed_collection2/node_modules/lodash.isempty/package.json                                  //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
exports.name = "lodash.isempty";
exports.version = "4.4.0";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// node_modules/meteor/aldeed_collection2/node_modules/lodash.isempty/index.js                                      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.useNode();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lodash.isequal":{"package.json":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// node_modules/meteor/aldeed_collection2/node_modules/lodash.isequal/package.json                                  //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
exports.name = "lodash.isequal";
exports.version = "4.5.0";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// node_modules/meteor/aldeed_collection2/node_modules/lodash.isequal/index.js                                      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.useNode();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lodash.isobject":{"package.json":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// node_modules/meteor/aldeed_collection2/node_modules/lodash.isobject/package.json                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
exports.name = "lodash.isobject";
exports.version = "3.0.2";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// node_modules/meteor/aldeed_collection2/node_modules/lodash.isobject/index.js                                     //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.useNode();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("/node_modules/meteor/aldeed:collection2/collection2.js");

/* Exports */
Package._define("aldeed:collection2", exports, {
  Collection2: Collection2
});

})();

//# sourceURL=meteor://💻app/packages/aldeed_collection2.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWxkZWVkOmNvbGxlY3Rpb24yL2NvbGxlY3Rpb24yLmpzIl0sIm5hbWVzIjpbIkV2ZW50RW1pdHRlciIsIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJNZXRlb3IiLCJNb25nbyIsImNoZWNrTnBtVmVyc2lvbnMiLCJjbG9uZSIsImRlZmF1bHQiLCJFSlNPTiIsImlzRW1wdHkiLCJpc0VxdWFsIiwiaXNPYmplY3QiLCJTaW1wbGVTY2hlbWEiLCJDb2xsZWN0aW9uMiIsImRlZmF1bHRDbGVhbk9wdGlvbnMiLCJmaWx0ZXIiLCJhdXRvQ29udmVydCIsInJlbW92ZUVtcHR5U3RyaW5ncyIsInRyaW1TdHJpbmdzIiwicmVtb3ZlTnVsbHNGcm9tQXJyYXlzIiwiQ29sbGVjdGlvbiIsInByb3RvdHlwZSIsImF0dGFjaFNjaGVtYSIsImMyQXR0YWNoU2NoZW1hIiwic3MiLCJvcHRpb25zIiwiX2MyIiwiX3NpbXBsZVNjaGVtYSIsInJlcGxhY2UiLCJ2ZXJzaW9uIiwibmV3U1MiLCJleHRlbmQiLCJzZWxlY3RvciIsImF0dGFjaFRvIiwib2JqIiwic2NoZW1hSW5kZXgiLCJfc2ltcGxlU2NoZW1hcyIsImZvckVhY2giLCJzY2hlbWEiLCJpbmRleCIsInB1c2giLCJfY29sbGVjdGlvbiIsIkxvY2FsQ29sbGVjdGlvbiIsImRlZmluZURlbnkiLCJrZWVwSW5zZWN1cmUiLCJlbWl0Iiwic2ltcGxlU2NoZW1hIiwiZG9jIiwicXVlcnkiLCJzY2hlbWFzIiwibGVuZ3RoIiwiRXJyb3IiLCJ0YXJnZXQiLCJpIiwiT2JqZWN0Iiwia2V5cyIsInVuZGVmaW5lZCIsIiRzZXQiLCJtZXRob2ROYW1lIiwiX3N1cGVyIiwiYXJncyIsImJ5cGFzc0NvbGxlY3Rpb24yIiwidXNlcklkIiwiZXJyIiwiZG9WYWxpZGF0ZSIsImlzU2VydmVyIiwiX2Nvbm5lY3Rpb24iLCJfbWFrZU5ld0lEIiwic3BsaWNlIiwiYXBwbHkiLCJjb2xsZWN0aW9uIiwidHlwZSIsImdldEF1dG9WYWx1ZXMiLCJpc0Zyb21UcnVzdGVkQ29kZSIsImNhbGxiYWNrIiwiZXJyb3IiLCJpc1Vwc2VydCIsImxhc3QiLCJoYXNDYWxsYmFjayIsInZhbGlkYXRlZE9iamVjdFdhc0luaXRpYWxseUVtcHR5IiwidXBzZXJ0IiwiaXNMb2NhbENvbGxlY3Rpb24iLCJ2YWxpZGF0aW9uQ29udGV4dCIsIm5hbWVkQ29udGV4dCIsImlzQ2xpZW50IiwiX2RlYnVnIiwicmVhc29uIiwic3RhY2siLCJ3cmFwQ2FsbGJhY2tGb3JQYXJzaW5nU2VydmVyRXJyb3JzIiwic2NoZW1hQWxsb3dzSWQiLCJhbGxvd3NLZXkiLCJfaWQiLCJkb2NJZCIsIk9iamVjdElEIiwiY2FjaGVkSWQiLCJhdXRvVmFsdWVDb250ZXh0IiwiaXNJbnNlcnQiLCJpc1VwZGF0ZSIsImV4dGVuZEF1dG9WYWx1ZUNvbnRleHQiLCJfY2xlYW5PcHRpb25zIiwiY2xlYW5PcHRpb25zRm9yVGhpc09wZXJhdGlvbiIsInByb3AiLCJjbGVhbiIsIm11dGF0ZSIsImlzTW9kaWZpZXIiLCJkb2NUb1ZhbGlkYXRlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwic2V0IiwiQXJyYXkiLCJpc0FycmF5IiwiJGFuZCIsInBsYWluU2VsZWN0b3IiLCJzZWwiLCJhc3NpZ24iLCJpc1ZhbGlkIiwidmFsaWRhdGUiLCJtb2RpZmllciIsImV4dGVuZGVkQ3VzdG9tQ29udGV4dCIsIndyYXBDYWxsYmFja0ZvclBhcnNpbmdNb25nb1ZhbGlkYXRpb25FcnJvcnMiLCJnZXRFcnJvck9iamVjdCIsIl9uYW1lIiwiY29udGV4dCIsImFwcGVuZFRvTWVzc2FnZSIsIm1lc3NhZ2UiLCJpbnZhbGlkS2V5cyIsInZhbGlkYXRpb25FcnJvcnMiLCJmaXJzdEVycm9yS2V5IiwibmFtZSIsImZpcnN0RXJyb3JNZXNzYWdlIiwia2V5RXJyb3JNZXNzYWdlIiwiaW5kZXhPZiIsInRyaW0iLCJzYW5pdGl6ZWRFcnJvciIsInN0cmluZ2lmeSIsImFkZFVuaXF1ZUVycm9yIiwiZXJyb3JNZXNzYWdlIiwic3BsaXQiLCJ2YWwiLCJhZGRWYWxpZGF0aW9uRXJyb3JzUHJvcE5hbWUiLCJhZGRWYWxpZGF0aW9uRXJyb3JzIiwidmFsdWUiLCJjYiIsIndyYXBwZWRDYWxsYmFja0ZvclBhcnNpbmdNb25nb1ZhbGlkYXRpb25FcnJvcnMiLCJjb2RlIiwid3JhcHBlZENhbGxiYWNrRm9yUGFyc2luZ1NlcnZlckVycm9ycyIsImRldGFpbHMiLCJpbnZhbGlkS2V5c0Zyb21TZXJ2ZXIiLCJwYXJzZSIsImFscmVhZHlJbnNlY3VyZWQiLCJjIiwiUGFja2FnZSIsImluc2VjdXJlIiwiYWxsb3ciLCJpbnNlcnQiLCJ1cGRhdGUiLCJyZW1vdmUiLCJmZXRjaCIsInRyYW5zZm9ybSIsImFscmVhZHlEZWZpbmVkIiwiZGVueSIsImZpZWxkcyIsImV4cG9ydERlZmF1bHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxZQUFKO0FBQWlCQyxPQUFPQyxLQUFQLENBQWFDLFFBQVEsMEJBQVIsQ0FBYixFQUFpRDtBQUFDSCxlQUFhSSxDQUFiLEVBQWU7QUFBQ0osbUJBQWFJLENBQWI7QUFBZTs7QUFBaEMsQ0FBakQsRUFBbUYsQ0FBbkY7QUFBc0YsSUFBSUMsTUFBSjtBQUFXSixPQUFPQyxLQUFQLENBQWFDLFFBQVEsZUFBUixDQUFiLEVBQXNDO0FBQUNFLFNBQU9ELENBQVAsRUFBUztBQUFDQyxhQUFPRCxDQUFQO0FBQVM7O0FBQXBCLENBQXRDLEVBQTRELENBQTVEO0FBQStELElBQUlFLEtBQUo7QUFBVUwsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGNBQVIsQ0FBYixFQUFxQztBQUFDRyxRQUFNRixDQUFOLEVBQVE7QUFBQ0UsWUFBTUYsQ0FBTjtBQUFROztBQUFsQixDQUFyQyxFQUF5RCxDQUF6RDtBQUE0RCxJQUFJRyxnQkFBSjtBQUFxQk4sT0FBT0MsS0FBUCxDQUFhQyxRQUFRLG9DQUFSLENBQWIsRUFBMkQ7QUFBQ0ks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SSxTQUFSLEtBQXNCLElBQXRCLEdBQTZCLEVBQTdCLEdBQWtDO0FBQUNBLGlCQUFXO0FBQVosS0F6RHhDLEdBaEU0QixDQTRINUI7QUFDQTs7QUFDQUMsbUJBQWVULEVBQUU3QixLQUFqQixJQUEwQixJQUExQjtBQUNEO0FBQ0Y7O0FBNXNCRDFILE9BQU9tSyxhQUFQLENBOHNCZXJKLFdBOXNCZixFIiwiZmlsZSI6Ii9wYWNrYWdlcy9hbGRlZWRfY29sbGVjdGlvbjIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdtZXRlb3IvcmFpeDpldmVudGVtaXR0ZXInO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5pbXBvcnQgY2xvbmUgZnJvbSAnY2xvbmUnO1xuaW1wb3J0IEVKU09OIGZyb20gJ2Vqc29uJztcbmltcG9ydCBpc0VtcHR5IGZyb20gJ2xvZGFzaC5pc2VtcHR5JztcbmltcG9ydCBpc0VxdWFsIGZyb20gJ2xvZGFzaC5pc2VxdWFsJztcbmltcG9ydCBpc09iamVjdCBmcm9tICdsb2Rhc2guaXNvYmplY3QnO1xuXG5jaGVja05wbVZlcnNpb25zKHsgJ3NpbXBsLXNjaGVtYSc6ICc+PTAuMC4wJyB9LCAnYWxkZWVkOmNvbGxlY3Rpb24yJyk7XG5cbmNvbnN0IFNpbXBsZVNjaGVtYSA9IHJlcXVpcmUoJ3NpbXBsLXNjaGVtYScpLmRlZmF1bHQ7XG5cbi8vIEV4cG9ydGVkIG9ubHkgZm9yIGxpc3RlbmluZyB0byBldmVudHNcbmNvbnN0IENvbGxlY3Rpb24yID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5jb25zdCBkZWZhdWx0Q2xlYW5PcHRpb25zID0ge1xuICBmaWx0ZXI6IHRydWUsXG4gIGF1dG9Db252ZXJ0OiB0cnVlLFxuICByZW1vdmVFbXB0eVN0cmluZ3M6IHRydWUsXG4gIHRyaW1TdHJpbmdzOiB0cnVlLFxuICByZW1vdmVOdWxsc0Zyb21BcnJheXM6IGZhbHNlLFxufTtcblxuLyoqXG4gKiBNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZS5hdHRhY2hTY2hlbWFcbiAqIEBwYXJhbSB7U2ltcGxlU2NoZW1hfE9iamVjdH0gc3MgLSBTaW1wbGVTY2hlbWEgaW5zdGFuY2Ugb3IgYSBzY2hlbWEgZGVmaW5pdGlvbiBvYmplY3RcbiAqICAgIGZyb20gd2hpY2ggdG8gY3JlYXRlIGEgbmV3IFNpbXBsZVNjaGVtYSBpbnN0YW5jZVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy50cmFuc2Zvcm09ZmFsc2VdIFNldCB0byBgdHJ1ZWAgaWYgeW91ciBkb2N1bWVudCBtdXN0IGJlIHBhc3NlZFxuICogICAgdGhyb3VnaCB0aGUgY29sbGVjdGlvbidzIHRyYW5zZm9ybSB0byBwcm9wZXJseSB2YWxpZGF0ZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucmVwbGFjZT1mYWxzZV0gU2V0IHRvIGB0cnVlYCB0byByZXBsYWNlIGFueSBleGlzdGluZyBzY2hlbWEgaW5zdGVhZCBvZiBjb21iaW5pbmdcbiAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAqXG4gKiBVc2UgdGhpcyBtZXRob2QgdG8gYXR0YWNoIGEgc2NoZW1hIHRvIGEgY29sbGVjdGlvbiBjcmVhdGVkIGJ5IGFub3RoZXIgcGFja2FnZSxcbiAqIHN1Y2ggYXMgTWV0ZW9yLnVzZXJzLiBJdCBpcyBtb3N0IGxpa2VseSB1bnNhZmUgdG8gY2FsbCB0aGlzIG1ldGhvZCBtb3JlIHRoYW5cbiAqIG9uY2UgZm9yIGEgc2luZ2xlIGNvbGxlY3Rpb24sIG9yIHRvIGNhbGwgdGhpcyBmb3IgYSBjb2xsZWN0aW9uIHRoYXQgaGFkIGFcbiAqIHNjaGVtYSBvYmplY3QgcGFzc2VkIHRvIGl0cyBjb25zdHJ1Y3Rvci5cbiAqL1xuTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUuYXR0YWNoU2NoZW1hID0gZnVuY3Rpb24gYzJBdHRhY2hTY2hlbWEoc3MsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgLy8gQWxsb3cgcGFzc2luZyBqdXN0IHRoZSBzY2hlbWEgb2JqZWN0XG4gIGlmICghKHNzIGluc3RhbmNlb2YgU2ltcGxlU2NoZW1hKSkge1xuICAgIHNzID0gbmV3IFNpbXBsZVNjaGVtYShzcyk7XG4gIH1cblxuICB0aGlzLl9jMiA9IHRoaXMuX2MyIHx8IHt9O1xuXG4gIC8vIElmIHdlJ3ZlIGFscmVhZHkgYXR0YWNoZWQgb25lIHNjaGVtYSwgd2UgY29tYmluZSBib3RoIGludG8gYSBuZXcgc2NoZW1hIHVubGVzcyBvcHRpb25zLnJlcGxhY2UgaXMgYHRydWVgXG4gIGlmICh0aGlzLl9jMi5fc2ltcGxlU2NoZW1hICYmIG9wdGlvbnMucmVwbGFjZSAhPT0gdHJ1ZSkge1xuICAgIGlmIChzcy52ZXJzaW9uID49IDIpIHtcbiAgICAgIHZhciBuZXdTUyA9IG5ldyBTaW1wbGVTY2hlbWEodGhpcy5fYzIuX3NpbXBsZVNjaGVtYSk7XG4gICAgICBuZXdTUy5leHRlbmQoc3MpO1xuICAgICAgc3MgPSBuZXdTUztcbiAgICB9IGVsc2Uge1xuICAgICAgc3MgPSBuZXcgU2ltcGxlU2NoZW1hKFt0aGlzLl9jMi5fc2ltcGxlU2NoZW1hLCBzc10pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBzZWxlY3RvciA9IG9wdGlvbnMuc2VsZWN0b3I7XG5cbiAgZnVuY3Rpb24gYXR0YWNoVG8ob2JqKSB7XG4gICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gXCJvYmplY3RcIikge1xuICAgICAgLy8gSW5kZXggb2YgZXhpc3Rpbmcgc2NoZW1hIHdpdGggaWRlbnRpY2FsIHNlbGVjdG9yXG4gICAgICB2YXIgc2NoZW1hSW5kZXggPSAtMTtcblxuICAgICAgLy8gd2UgbmVlZCBhbiBhcnJheSB0byBob2xkIG11bHRpcGxlIHNjaGVtYXNcbiAgICAgIG9iai5fYzIuX3NpbXBsZVNjaGVtYXMgPSBvYmouX2MyLl9zaW1wbGVTY2hlbWFzIHx8IFtdO1xuXG4gICAgICAvLyBMb29wIHRocm91Z2ggZXhpc3Rpbmcgc2NoZW1hcyB3aXRoIHNlbGVjdG9yc1xuICAgICAgb2JqLl9jMi5fc2ltcGxlU2NoZW1hcy5mb3JFYWNoKChzY2hlbWEsIGluZGV4KSA9PiB7XG4gICAgICAgIC8vIGlmIHdlIGZpbmQgYSBzY2hlbWEgd2l0aCBhbiBpZGVudGljYWwgc2VsZWN0b3IsIHNhdmUgaXQncyBpbmRleFxuICAgICAgICBpZihpc0VxdWFsKHNjaGVtYS5zZWxlY3Rvciwgc2VsZWN0b3IpKSB7XG4gICAgICAgICAgc2NoZW1hSW5kZXggPSBpbmRleDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoc2NoZW1hSW5kZXggPT09IC0xKSB7XG4gICAgICAgIC8vIFdlIGRpZG4ndCBmaW5kIHRoZSBzY2hlbWEgaW4gb3VyIGFycmF5IC0gcHVzaCBpdCBpbnRvIHRoZSBhcnJheVxuICAgICAgICBvYmouX2MyLl9zaW1wbGVTY2hlbWFzLnB1c2goe1xuICAgICAgICAgIHNjaGVtYTogbmV3IFNpbXBsZVNjaGVtYShzcyksXG4gICAgICAgICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIGZvdW5kIGEgc2NoZW1hIHdpdGggYW4gaWRlbnRpY2FsIHNlbGVjdG9yIGluIG91ciBhcnJheSxcbiAgICAgICAgaWYgKG9wdGlvbnMucmVwbGFjZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgIC8vIE1lcmdlIHdpdGggZXhpc3Rpbmcgc2NoZW1hIHVubGVzcyBvcHRpb25zLnJlcGxhY2UgaXMgYHRydWVgXG4gICAgICAgICAgaWYgKG9iai5fYzIuX3NpbXBsZVNjaGVtYXNbc2NoZW1hSW5kZXhdLnNjaGVtYS52ZXJzaW9uID49IDIpIHtcbiAgICAgICAgICAgIG9iai5fYzIuX3NpbXBsZVNjaGVtYXNbc2NoZW1hSW5kZXhdLnNjaGVtYS5leHRlbmQoc3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmouX2MyLl9zaW1wbGVTY2hlbWFzW3NjaGVtYUluZGV4XS5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKFtvYmouX2MyLl9zaW1wbGVTY2hlbWFzW3NjaGVtYUluZGV4XS5zY2hlbWEsIHNzXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIG9wdGlvbnMucmVwYWxjZSBpcyBgdHJ1ZWAgcmVwbGFjZSBleGlzdGluZyBzY2hlbWEgd2l0aCBuZXcgc2NoZW1hXG4gICAgICAgICAgb2JqLl9jMi5fc2ltcGxlU2NoZW1hc1tzY2hlbWFJbmRleF0uc2NoZW1hID0gc3M7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAvLyBSZW1vdmUgZXhpc3Rpbmcgc2NoZW1hcyB3aXRob3V0IHNlbGVjdG9yXG4gICAgICBkZWxldGUgb2JqLl9jMi5fc2ltcGxlU2NoZW1hO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUcmFjayB0aGUgc2NoZW1hIGluIHRoZSBjb2xsZWN0aW9uXG4gICAgICBvYmouX2MyLl9zaW1wbGVTY2hlbWEgPSBzcztcblxuICAgICAgLy8gUmVtb3ZlIGV4aXN0aW5nIHNjaGVtYXMgd2l0aCBzZWxlY3RvclxuICAgICAgZGVsZXRlIG9iai5fYzIuX3NpbXBsZVNjaGVtYXM7XG4gICAgfVxuICB9XG5cbiAgYXR0YWNoVG8odGhpcyk7XG4gIC8vIEF0dGFjaCB0aGUgc2NoZW1hIHRvIHRoZSB1bmRlcmx5aW5nIExvY2FsQ29sbGVjdGlvbiwgdG9vXG4gIGlmICh0aGlzLl9jb2xsZWN0aW9uIGluc3RhbmNlb2YgTG9jYWxDb2xsZWN0aW9uKSB7XG4gICAgdGhpcy5fY29sbGVjdGlvbi5fYzIgPSB0aGlzLl9jb2xsZWN0aW9uLl9jMiB8fCB7fTtcbiAgICBhdHRhY2hUbyh0aGlzLl9jb2xsZWN0aW9uKTtcbiAgfVxuXG4gIGRlZmluZURlbnkodGhpcywgb3B0aW9ucyk7XG4gIGtlZXBJbnNlY3VyZSh0aGlzKTtcblxuICBDb2xsZWN0aW9uMi5lbWl0KCdzY2hlbWEuYXR0YWNoZWQnLCB0aGlzLCBzcywgb3B0aW9ucyk7XG59O1xuXG5bTW9uZ28uQ29sbGVjdGlvbiwgTG9jYWxDb2xsZWN0aW9uXS5mb3JFYWNoKChvYmopID0+IHtcbiAgLyoqXG4gICAqIHNpbXBsZVNjaGVtYVxuICAgKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gZGV0ZWN0IHRoZSBjb3JyZWN0IHNjaGVtYSBieSBnaXZlbiBwYXJhbXMuIElmIGl0XG4gICAqIGRldGVjdCBtdWx0aS1zY2hlbWEgcHJlc2VuY2UgaW4gdGhlIGNvbGxlY3Rpb24sIHRoZW4gaXQgbWFkZSBhbiBhdHRlbXB0IHRvIGZpbmQgYVxuICAgKiBgc2VsZWN0b3JgIGluIGFyZ3NcbiAgICogQHBhcmFtIHtPYmplY3R9IGRvYyAtIEl0IGNvdWxkIGJlIDx1cGRhdGU+IG9uIHVwZGF0ZS91cHNlcnQgb3IgZG9jdW1lbnRcbiAgICogaXRzZWxmIG9uIGluc2VydC9yZW1vdmVcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIEl0IGNvdWxkIGJlIDx1cGRhdGU+IG9uIHVwZGF0ZS91cHNlcnQgZXRjXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcXVlcnldIC0gaXQgY291bGQgYmUgPHF1ZXJ5PiBvbiB1cGRhdGUvdXBzZXJ0XG4gICAqIEByZXR1cm4ge09iamVjdH0gU2NoZW1hXG4gICAqL1xuICBvYmoucHJvdG90eXBlLnNpbXBsZVNjaGVtYSA9IGZ1bmN0aW9uIChkb2MsIG9wdGlvbnMsIHF1ZXJ5KSB7XG4gICAgaWYgKCF0aGlzLl9jMikgcmV0dXJuIG51bGw7XG4gICAgaWYgKHRoaXMuX2MyLl9zaW1wbGVTY2hlbWEpIHJldHVybiB0aGlzLl9jMi5fc2ltcGxlU2NoZW1hO1xuXG4gICAgdmFyIHNjaGVtYXMgPSB0aGlzLl9jMi5fc2ltcGxlU2NoZW1hcztcbiAgICBpZiAoc2NoZW1hcyAmJiBzY2hlbWFzLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICghZG9jKSB0aHJvdyBuZXcgRXJyb3IoJ2NvbGxlY3Rpb24uc2ltcGxlU2NoZW1hKCkgcmVxdWlyZXMgZG9jIGFyZ3VtZW50IHdoZW4gdGhlcmUgYXJlIG11bHRpcGxlIHNjaGVtYXMnKTtcblxuICAgICAgdmFyIHNjaGVtYSwgc2VsZWN0b3IsIHRhcmdldDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBzY2hlbWEgPSBzY2hlbWFzW2ldO1xuICAgICAgICBzZWxlY3RvciA9IE9iamVjdC5rZXlzKHNjaGVtYS5zZWxlY3RvcilbMF07XG5cbiAgICAgICAgLy8gV2Ugd2lsbCBzZXQgdGhpcyB0byB1bmRlZmluZWQgYmVjYXVzZSBpbiB0aGVvcnkgeW91IG1pZ2h0IHdhbnQgdG8gc2VsZWN0XG4gICAgICAgIC8vIG9uIGEgbnVsbCB2YWx1ZS5cbiAgICAgICAgdGFyZ2V0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIGhlcmUgd2UgYXJlIGxvb2tpbmcgZm9yIHNlbGVjdG9yIGluIGRpZmZlcmVudCBwbGFjZXNcbiAgICAgICAgLy8gJHNldCBzaG91bGQgaGF2ZSBtb3JlIHByaW9yaXR5IGhlcmVcbiAgICAgICAgaWYgKGRvYy4kc2V0ICYmIHR5cGVvZiBkb2MuJHNldFtzZWxlY3Rvcl0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgdGFyZ2V0ID0gZG9jLiRzZXRbc2VsZWN0b3JdO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb2Nbc2VsZWN0b3JdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHRhcmdldCA9IGRvY1tzZWxlY3Rvcl07XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnNlbGVjdG9yKSB7XG4gICAgICAgICAgdGFyZ2V0ID0gb3B0aW9ucy5zZWxlY3RvcltzZWxlY3Rvcl07XG4gICAgICAgIH0gZWxzZSBpZiAocXVlcnkgJiYgcXVlcnlbc2VsZWN0b3JdKSB7IC8vIG9uIHVwc2VydC91cGRhdGUgb3BlcmF0aW9uc1xuICAgICAgICAgIHRhcmdldCA9IHF1ZXJ5W3NlbGVjdG9yXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gY29tcGFyZSBnaXZlbiBzZWxlY3RvciB3aXRoIGRvYyBwcm9wZXJ0eSBvciBvcHRpb24gdG9cbiAgICAgICAgLy8gZmluZCByaWdodCBzY2hlbWFcbiAgICAgICAgaWYgKHRhcmdldCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldCA9PT0gc2NoZW1hLnNlbGVjdG9yW3NlbGVjdG9yXSkge1xuICAgICAgICAgIHJldHVybiBzY2hlbWEuc2NoZW1hO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG59KTtcblxuLy8gV3JhcCBEQiB3cml0ZSBvcGVyYXRpb24gbWV0aG9kc1xuWydpbnNlcnQnLCAndXBkYXRlJ10uZm9yRWFjaCgobWV0aG9kTmFtZSkgPT4ge1xuICBjb25zdCBfc3VwZXIgPSBNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZVttZXRob2ROYW1lXTtcbiAgTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgbGV0IG9wdGlvbnMgPSAobWV0aG9kTmFtZSA9PT0gXCJpbnNlcnRcIikgPyBhcmdzWzFdIDogYXJnc1syXTtcblxuICAgIC8vIFN1cHBvcnQgbWlzc2luZyBvcHRpb25zIGFyZ1xuICAgIGlmICghb3B0aW9ucyB8fCB0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2MyICYmIG9wdGlvbnMuYnlwYXNzQ29sbGVjdGlvbjIgIT09IHRydWUpIHtcbiAgICAgIHZhciB1c2VySWQgPSBudWxsO1xuICAgICAgdHJ5IHsgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FsZGVlZC9tZXRlb3ItY29sbGVjdGlvbjIvaXNzdWVzLzE3NVxuICAgICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHt9XG5cbiAgICAgIGFyZ3MgPSBkb1ZhbGlkYXRlKFxuICAgICAgICB0aGlzLFxuICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICBhcmdzLFxuICAgICAgICBNZXRlb3IuaXNTZXJ2ZXIgfHwgdGhpcy5fY29ubmVjdGlvbiA9PT0gbnVsbCwgLy8gZ2V0QXV0b1ZhbHVlc1xuICAgICAgICB1c2VySWQsXG4gICAgICAgIE1ldGVvci5pc1NlcnZlciAvLyBpc0Zyb21UcnVzdGVkQ29kZVxuICAgICAgKTtcbiAgICAgIGlmICghYXJncykge1xuICAgICAgICAvLyBkb1ZhbGlkYXRlIGFscmVhZHkgY2FsbGVkIHRoZSBjYWxsYmFjayBvciB0aHJldyB0aGUgZXJyb3Igc28gd2UncmUgZG9uZS5cbiAgICAgICAgLy8gQnV0IGluc2VydCBzaG91bGQgYWx3YXlzIHJldHVybiBhbiBJRCB0byBtYXRjaCBjb3JlIGJlaGF2aW9yLlxuICAgICAgICByZXR1cm4gbWV0aG9kTmFtZSA9PT0gXCJpbnNlcnRcIiA/IHRoaXMuX21ha2VOZXdJRCgpIDogdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSBzdGlsbCBuZWVkIHRvIGFkanVzdCBhcmdzIGJlY2F1c2UgaW5zZXJ0IGRvZXMgbm90IHRha2Ugb3B0aW9uc1xuICAgICAgaWYgKG1ldGhvZE5hbWUgPT09IFwiaW5zZXJ0XCIgJiYgdHlwZW9mIGFyZ3NbMV0gIT09ICdmdW5jdGlvbicpIGFyZ3Muc3BsaWNlKDEsIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBfc3VwZXIuYXBwbHkodGhpcywgYXJncyk7XG4gIH07XG59KTtcblxuLypcbiAqIFByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBkb1ZhbGlkYXRlKGNvbGxlY3Rpb24sIHR5cGUsIGFyZ3MsIGdldEF1dG9WYWx1ZXMsIHVzZXJJZCwgaXNGcm9tVHJ1c3RlZENvZGUpIHtcbiAgdmFyIGRvYywgY2FsbGJhY2ssIGVycm9yLCBvcHRpb25zLCBpc1Vwc2VydCwgc2VsZWN0b3IsIGxhc3QsIGhhc0NhbGxiYWNrO1xuXG4gIGlmICghYXJncy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IodHlwZSArIFwiIHJlcXVpcmVzIGFuIGFyZ3VtZW50XCIpO1xuICB9XG5cbiAgLy8gR2F0aGVyIGFyZ3VtZW50cyBhbmQgY2FjaGUgdGhlIHNlbGVjdG9yXG4gIGlmICh0eXBlID09PSBcImluc2VydFwiKSB7XG4gICAgZG9jID0gYXJnc1swXTtcbiAgICBvcHRpb25zID0gYXJnc1sxXTtcbiAgICBjYWxsYmFjayA9IGFyZ3NbMl07XG5cbiAgICAvLyBUaGUgcmVhbCBpbnNlcnQgZG9lc24ndCB0YWtlIG9wdGlvbnNcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgYXJncyA9IFtkb2MsIG9wdGlvbnNdO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGFyZ3MgPSBbZG9jLCBjYWxsYmFja107XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZ3MgPSBbZG9jXTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJ1cGRhdGVcIikge1xuICAgIHNlbGVjdG9yID0gYXJnc1swXTtcbiAgICBkb2MgPSBhcmdzWzFdO1xuICAgIG9wdGlvbnMgPSBhcmdzWzJdO1xuICAgIGNhbGxiYWNrID0gYXJnc1szXTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIHR5cGUgYXJndW1lbnRcIik7XG4gIH1cblxuICB2YXIgdmFsaWRhdGVkT2JqZWN0V2FzSW5pdGlhbGx5RW1wdHkgPSBpc0VtcHR5KGRvYyk7XG5cbiAgLy8gU3VwcG9ydCBtaXNzaW5nIG9wdGlvbnMgYXJnXG4gIGlmICghY2FsbGJhY2sgJiYgdHlwZW9mIG9wdGlvbnMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgbGFzdCA9IGFyZ3MubGVuZ3RoIC0gMTtcblxuICBoYXNDYWxsYmFjayA9ICh0eXBlb2YgYXJnc1tsYXN0XSA9PT0gJ2Z1bmN0aW9uJyk7XG5cbiAgLy8gSWYgdXBkYXRlIHdhcyBjYWxsZWQgd2l0aCB1cHNlcnQ6dHJ1ZSwgZmxhZyBhcyBhbiB1cHNlcnRcbiAgaXNVcHNlcnQgPSAodHlwZSA9PT0gXCJ1cGRhdGVcIiAmJiBvcHRpb25zLnVwc2VydCA9PT0gdHJ1ZSk7XG5cbiAgLy8gd2UgbmVlZCB0byBwYXNzIGBkb2NgIGFuZCBgb3B0aW9uc2AgdG8gYHNpbXBsZVNjaGVtYWAgbWV0aG9kLCB0aGF0J3Mgd2h5XG4gIC8vIHNjaGVtYSBkZWNsYXJhdGlvbiBtb3ZlZCBoZXJlXG4gIHZhciBzY2hlbWEgPSBjb2xsZWN0aW9uLnNpbXBsZVNjaGVtYShkb2MsIG9wdGlvbnMsIHNlbGVjdG9yKTtcbiAgdmFyIGlzTG9jYWxDb2xsZWN0aW9uID0gKGNvbGxlY3Rpb24uX2Nvbm5lY3Rpb24gPT09IG51bGwpO1xuXG4gIC8vIE9uIHRoZSBzZXJ2ZXIgYW5kIGZvciBsb2NhbCBjb2xsZWN0aW9ucywgd2UgYWxsb3cgcGFzc2luZyBgZ2V0QXV0b1ZhbHVlczogZmFsc2VgIHRvIGRpc2FibGUgYXV0b1ZhbHVlIGZ1bmN0aW9uc1xuICBpZiAoKE1ldGVvci5pc1NlcnZlciB8fCBpc0xvY2FsQ29sbGVjdGlvbikgJiYgb3B0aW9ucy5nZXRBdXRvVmFsdWVzID09PSBmYWxzZSkge1xuICAgIGdldEF1dG9WYWx1ZXMgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIERldGVybWluZSB2YWxpZGF0aW9uIGNvbnRleHRcbiAgdmFyIHZhbGlkYXRpb25Db250ZXh0ID0gb3B0aW9ucy52YWxpZGF0aW9uQ29udGV4dDtcbiAgaWYgKHZhbGlkYXRpb25Db250ZXh0KSB7XG4gICAgaWYgKHR5cGVvZiB2YWxpZGF0aW9uQ29udGV4dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbGlkYXRpb25Db250ZXh0ID0gc2NoZW1hLm5hbWVkQ29udGV4dCh2YWxpZGF0aW9uQ29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbGlkYXRpb25Db250ZXh0ID0gc2NoZW1hLm5hbWVkQ29udGV4dCgpO1xuICB9XG5cbiAgLy8gQWRkIGEgZGVmYXVsdCBjYWxsYmFjayBmdW5jdGlvbiBpZiB3ZSdyZSBvbiB0aGUgY2xpZW50IGFuZCBubyBjYWxsYmFjayB3YXMgZ2l2ZW5cbiAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiAhY2FsbGJhY2spIHtcbiAgICAvLyBDbGllbnQgY2FuJ3QgYmxvY2ssIHNvIGl0IGNhbid0IHJlcG9ydCBlcnJvcnMgYnkgZXhjZXB0aW9uLFxuICAgIC8vIG9ubHkgYnkgY2FsbGJhY2suIElmIHRoZXkgZm9yZ2V0IHRoZSBjYWxsYmFjaywgZ2l2ZSB0aGVtIGFcbiAgICAvLyBkZWZhdWx0IG9uZSB0aGF0IGxvZ3MgdGhlIGVycm9yLCBzbyB0aGV5IGFyZW4ndCB0b3RhbGx5XG4gICAgLy8gYmFmZmxlZCBpZiB0aGVpciB3cml0ZXMgZG9uJ3Qgd29yayBiZWNhdXNlIHRoZWlyIGRhdGFiYXNlIGlzXG4gICAgLy8gZG93bi5cbiAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKGVycikge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBNZXRlb3IuX2RlYnVnKHR5cGUgKyBcIiBmYWlsZWQ6IFwiICsgKGVyci5yZWFzb24gfHwgZXJyLnN0YWNrKSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIElmIGNsaWVudCB2YWxpZGF0aW9uIGlzIGZpbmUgb3IgaXMgc2tpcHBlZCBidXQgdGhlbiBzb21ldGhpbmdcbiAgLy8gaXMgZm91bmQgdG8gYmUgaW52YWxpZCBvbiB0aGUgc2VydmVyLCB3ZSBnZXQgdGhhdCBlcnJvciBiYWNrXG4gIC8vIGFzIGEgc3BlY2lhbCBNZXRlb3IuRXJyb3IgdGhhdCB3ZSBuZWVkIHRvIHBhcnNlLlxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIGhhc0NhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sgPSBhcmdzW2xhc3RdID0gd3JhcENhbGxiYWNrRm9yUGFyc2luZ1NlcnZlckVycm9ycyh2YWxpZGF0aW9uQ29udGV4dCwgY2FsbGJhY2spO1xuICB9XG5cbiAgdmFyIHNjaGVtYUFsbG93c0lkID0gc2NoZW1hLmFsbG93c0tleShcIl9pZFwiKTtcbiAgaWYgKHR5cGUgPT09IFwiaW5zZXJ0XCIgJiYgIWRvYy5faWQgJiYgc2NoZW1hQWxsb3dzSWQpIHtcbiAgICBkb2MuX2lkID0gY29sbGVjdGlvbi5fbWFrZU5ld0lEKCk7XG4gIH1cblxuICAvLyBHZXQgdGhlIGRvY0lkIGZvciBwYXNzaW5nIGluIHRoZSBhdXRvVmFsdWUvY3VzdG9tIGNvbnRleHRcbiAgdmFyIGRvY0lkO1xuICBpZiAodHlwZSA9PT0gJ2luc2VydCcpIHtcbiAgICBkb2NJZCA9IGRvYy5faWQ7IC8vIG1pZ2h0IGJlIHVuZGVmaW5lZFxuICB9IGVsc2UgaWYgKHR5cGUgPT09IFwidXBkYXRlXCIgJiYgc2VsZWN0b3IpIHtcbiAgICBkb2NJZCA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgfHwgc2VsZWN0b3IgaW5zdGFuY2VvZiBNb25nby5PYmplY3RJRCA/IHNlbGVjdG9yIDogc2VsZWN0b3IuX2lkO1xuICB9XG5cbiAgLy8gSWYgX2lkIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQsIHJlbW92ZSBpdCB0ZW1wb3JhcmlseSBpZiBpdCdzXG4gIC8vIG5vdCBleHBsaWNpdGx5IGRlZmluZWQgaW4gdGhlIHNjaGVtYS5cbiAgdmFyIGNhY2hlZElkO1xuICBpZiAoZG9jLl9pZCAmJiAhc2NoZW1hQWxsb3dzSWQpIHtcbiAgICBjYWNoZWRJZCA9IGRvYy5faWQ7XG4gICAgZGVsZXRlIGRvYy5faWQ7XG4gIH1cblxuICBjb25zdCBhdXRvVmFsdWVDb250ZXh0ID0ge1xuICAgIGlzSW5zZXJ0OiAodHlwZSA9PT0gXCJpbnNlcnRcIiksXG4gICAgaXNVcGRhdGU6ICh0eXBlID09PSBcInVwZGF0ZVwiICYmIG9wdGlvbnMudXBzZXJ0ICE9PSB0cnVlKSxcbiAgICBpc1Vwc2VydCxcbiAgICB1c2VySWQsXG4gICAgaXNGcm9tVHJ1c3RlZENvZGUsXG4gICAgZG9jSWQsXG4gICAgaXNMb2NhbENvbGxlY3Rpb25cbiAgfTtcblxuICBjb25zdCBleHRlbmRBdXRvVmFsdWVDb250ZXh0ID0ge1xuICAgIC4uLigoc2NoZW1hLl9jbGVhbk9wdGlvbnMgfHwge30pLmV4dGVuZEF1dG9WYWx1ZUNvbnRleHQgfHwge30pLFxuICAgIC4uLmF1dG9WYWx1ZUNvbnRleHQsXG4gICAgLi4ub3B0aW9ucy5leHRlbmRBdXRvVmFsdWVDb250ZXh0LFxuICB9O1xuXG4gIGNvbnN0IGNsZWFuT3B0aW9uc0ZvclRoaXNPcGVyYXRpb24gPSB7fTtcbiAgW1wiYXV0b0NvbnZlcnRcIiwgXCJmaWx0ZXJcIiwgXCJyZW1vdmVFbXB0eVN0cmluZ3NcIiwgXCJyZW1vdmVOdWxsc0Zyb21BcnJheXNcIiwgXCJ0cmltU3RyaW5nc1wiXS5mb3JFYWNoKHByb3AgPT4ge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uc1twcm9wXSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgIGNsZWFuT3B0aW9uc0ZvclRoaXNPcGVyYXRpb25bcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gUHJlbGltaW5hcnkgY2xlYW5pbmcgb24gYm90aCBjbGllbnQgYW5kIHNlcnZlci4gT24gdGhlIHNlcnZlciBhbmQgZm9yIGxvY2FsXG4gIC8vIGNvbGxlY3Rpb25zLCBhdXRvbWF0aWMgdmFsdWVzIHdpbGwgYWxzbyBiZSBzZXQgYXQgdGhpcyBwb2ludC5cbiAgc2NoZW1hLmNsZWFuKGRvYywge1xuICAgIG11dGF0ZTogdHJ1ZSwgLy8gQ2xlYW4gdGhlIGRvYy9tb2RpZmllciBpbiBwbGFjZVxuICAgIGlzTW9kaWZpZXI6ICh0eXBlICE9PSBcImluc2VydFwiKSxcbiAgICAvLyBTdGFydCB3aXRoIHNvbWUgQ29sbGVjdGlvbjIgZGVmYXVsdHMsIHdoaWNoIHdpbGwgdXN1YWxseSBiZSBvdmVyd3JpdHRlblxuICAgIC4uLmRlZmF1bHRDbGVhbk9wdGlvbnMsXG4gICAgLy8gVGhlIGV4dGVuZCB3aXRoIHRoZSBzY2hlbWEtbGV2ZWwgZGVmYXVsdHMgKGZyb20gU2ltcGxlU2NoZW1hIGNvbnN0cnVjdG9yIG9wdGlvbnMpXG4gICAgLi4uKHNjaGVtYS5fY2xlYW5PcHRpb25zIHx8IHt9KSxcbiAgICAvLyBGaW5hbGx5LCBvcHRpb25zIGZvciB0aGlzIHNwZWNpZmljIG9wZXJhdGlvbiBzaG91bGQgdGFrZSBwcmVjZWRhbmNlXG4gICAgLi4uY2xlYW5PcHRpb25zRm9yVGhpc09wZXJhdGlvbixcbiAgICBleHRlbmRBdXRvVmFsdWVDb250ZXh0LCAvLyBUaGlzIHdhcyBleHRlbmRlZCBzZXBhcmF0ZWx5IGFib3ZlXG4gICAgZ2V0QXV0b1ZhbHVlcywgLy8gRm9yY2UgdGhpcyBvdmVycmlkZVxuICB9KTtcblxuICAvLyBXZSBjbG9uZSBiZWZvcmUgdmFsaWRhdGluZyBiZWNhdXNlIGluIHNvbWUgY2FzZXMgd2UgbmVlZCB0byBhZGp1c3QgdGhlXG4gIC8vIG9iamVjdCBhIGJpdCBiZWZvcmUgdmFsaWRhdGluZyBpdC4gSWYgd2UgYWRqdXN0ZWQgYGRvY2AgaXRzZWxmLCBvdXJcbiAgLy8gY2hhbmdlcyB3b3VsZCBwZXJzaXN0IGludG8gdGhlIGRhdGFiYXNlLlxuICB2YXIgZG9jVG9WYWxpZGF0ZSA9IHt9O1xuICBmb3IgKHZhciBwcm9wIGluIGRvYykge1xuICAgIC8vIFdlIG9taXQgcHJvdG90eXBlIHByb3BlcnRpZXMgd2hlbiBjbG9uaW5nIGJlY2F1c2UgdGhleSB3aWxsIG5vdCBiZSB2YWxpZFxuICAgIC8vIGFuZCBtb25nbyBvbWl0cyB0aGVtIHdoZW4gc2F2aW5nIHRvIHRoZSBkYXRhYmFzZSBhbnl3YXkuXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkb2MsIHByb3ApKSB7XG4gICAgICBkb2NUb1ZhbGlkYXRlW3Byb3BdID0gZG9jW3Byb3BdO1xuICAgIH1cbiAgfVxuXG4gIC8vIE9uIHRoZSBzZXJ2ZXIsIHVwc2VydHMgYXJlIHBvc3NpYmxlOyBTaW1wbGVTY2hlbWEgaGFuZGxlcyB1cHNlcnRzIHByZXR0eVxuICAvLyB3ZWxsIGJ5IGRlZmF1bHQsIGJ1dCBpdCB3aWxsIG5vdCBrbm93IGFib3V0IHRoZSBmaWVsZHMgaW4gdGhlIHNlbGVjdG9yLFxuICAvLyB3aGljaCBhcmUgYWxzbyBzdG9yZWQgaW4gdGhlIGRhdGFiYXNlIGlmIGFuIGluc2VydCBpcyBwZXJmb3JtZWQuIFNvIHdlXG4gIC8vIHdpbGwgYWxsb3cgdGhlc2UgZmllbGRzIHRvIGJlIGNvbnNpZGVyZWQgZm9yIHZhbGlkYXRpb24gYnkgYWRkaW5nIHRoZW1cbiAgLy8gdG8gdGhlICRzZXQgaW4gdGhlIG1vZGlmaWVyLiBUaGlzIGlzIG5vIGRvdWJ0IHByb25lIHRvIGVycm9ycywgYnV0IHRoZXJlXG4gIC8vIHByb2JhYmx5IGlzbid0IGFueSBiZXR0ZXIgd2F5IHJpZ2h0IG5vdy5cbiAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiBpc1Vwc2VydCAmJiBpc09iamVjdChzZWxlY3RvcikpIHtcbiAgICB2YXIgc2V0ID0gZG9jVG9WYWxpZGF0ZS4kc2V0IHx8IHt9O1xuXG4gICAgLy8gSWYgc2VsZWN0b3IgdXNlcyAkYW5kIGZvcm1hdCwgY29udmVydCB0byBwbGFpbiBvYmplY3Qgc2VsZWN0b3JcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzZWxlY3Rvci4kYW5kKSkge1xuICAgICAgY29uc3QgcGxhaW5TZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3IuJGFuZC5mb3JFYWNoKHNlbCA9PiB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24ocGxhaW5TZWxlY3Rvciwgc2VsKTtcbiAgICAgIH0pO1xuICAgICAgZG9jVG9WYWxpZGF0ZS4kc2V0ID0gcGxhaW5TZWxlY3RvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jVG9WYWxpZGF0ZS4kc2V0ID0gY2xvbmUoc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIGlmICghc2NoZW1hQWxsb3dzSWQpIGRlbGV0ZSBkb2NUb1ZhbGlkYXRlLiRzZXQuX2lkO1xuICAgIE9iamVjdC5hc3NpZ24oZG9jVG9WYWxpZGF0ZS4kc2V0LCBzZXQpO1xuICB9XG5cbiAgLy8gU2V0IGF1dG9tYXRpYyB2YWx1ZXMgZm9yIHZhbGlkYXRpb24gb24gdGhlIGNsaWVudC5cbiAgLy8gT24gdGhlIHNlcnZlciwgd2UgYWxyZWFkeSB1cGRhdGVkIGRvYyB3aXRoIGF1dG8gdmFsdWVzLCBidXQgb24gdGhlIGNsaWVudCxcbiAgLy8gd2Ugd2lsbCBhZGQgdGhlbSB0byBkb2NUb1ZhbGlkYXRlIGZvciB2YWxpZGF0aW9uIHB1cnBvc2VzIG9ubHkuXG4gIC8vIFRoaXMgaXMgYmVjYXVzZSB3ZSB3YW50IGFsbCBhY3R1YWwgdmFsdWVzIGdlbmVyYXRlZCBvbiB0aGUgc2VydmVyLlxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmICFpc0xvY2FsQ29sbGVjdGlvbikge1xuICAgIHNjaGVtYS5jbGVhbihkb2NUb1ZhbGlkYXRlLCB7XG4gICAgICBhdXRvQ29udmVydDogZmFsc2UsXG4gICAgICBleHRlbmRBdXRvVmFsdWVDb250ZXh0LFxuICAgICAgZmlsdGVyOiBmYWxzZSxcbiAgICAgIGdldEF1dG9WYWx1ZXM6IHRydWUsXG4gICAgICBpc01vZGlmaWVyOiAodHlwZSAhPT0gXCJpbnNlcnRcIiksXG4gICAgICBtdXRhdGU6IHRydWUsIC8vIENsZWFuIHRoZSBkb2MvbW9kaWZpZXIgaW4gcGxhY2VcbiAgICAgIHJlbW92ZUVtcHR5U3RyaW5nczogZmFsc2UsXG4gICAgICByZW1vdmVOdWxsc0Zyb21BcnJheXM6IGZhbHNlLFxuICAgICAgdHJpbVN0cmluZ3M6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gWFhYIE1heWJlIG1vdmUgdGhpcyBpbnRvIFNpbXBsZVNjaGVtYVxuICBpZiAoIXZhbGlkYXRlZE9iamVjdFdhc0luaXRpYWxseUVtcHR5ICYmIGlzRW1wdHkoZG9jVG9WYWxpZGF0ZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FmdGVyIGZpbHRlcmluZyBvdXQga2V5cyBub3QgaW4gdGhlIHNjaGVtYSwgeW91ciAnICtcbiAgICAgICh0eXBlID09PSAndXBkYXRlJyA/ICdtb2RpZmllcicgOiAnb2JqZWN0JykgK1xuICAgICAgJyBpcyBub3cgZW1wdHknKTtcbiAgfVxuXG4gIC8vIFZhbGlkYXRlIGRvY1xuICB2YXIgaXNWYWxpZDtcbiAgaWYgKG9wdGlvbnMudmFsaWRhdGUgPT09IGZhbHNlKSB7XG4gICAgaXNWYWxpZCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgaXNWYWxpZCA9IHZhbGlkYXRpb25Db250ZXh0LnZhbGlkYXRlKGRvY1RvVmFsaWRhdGUsIHtcbiAgICAgIG1vZGlmaWVyOiAodHlwZSA9PT0gXCJ1cGRhdGVcIiB8fCB0eXBlID09PSBcInVwc2VydFwiKSxcbiAgICAgIHVwc2VydDogaXNVcHNlcnQsXG4gICAgICBleHRlbmRlZEN1c3RvbUNvbnRleHQ6IHtcbiAgICAgICAgaXNJbnNlcnQ6ICh0eXBlID09PSBcImluc2VydFwiKSxcbiAgICAgICAgaXNVcGRhdGU6ICh0eXBlID09PSBcInVwZGF0ZVwiICYmIG9wdGlvbnMudXBzZXJ0ICE9PSB0cnVlKSxcbiAgICAgICAgaXNVcHNlcnQsXG4gICAgICAgIHVzZXJJZCxcbiAgICAgICAgaXNGcm9tVHJ1c3RlZENvZGUsXG4gICAgICAgIGRvY0lkLFxuICAgICAgICBpc0xvY2FsQ29sbGVjdGlvbixcbiAgICAgICAgLi4uKG9wdGlvbnMuZXh0ZW5kZWRDdXN0b21Db250ZXh0IHx8IHt9KSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBpZiAoaXNWYWxpZCkge1xuICAgIC8vIEFkZCB0aGUgSUQgYmFja1xuICAgIGlmIChjYWNoZWRJZCkge1xuICAgICAgZG9jLl9pZCA9IGNhY2hlZElkO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgYXJncyB0byByZWZsZWN0IHRoZSBjbGVhbmVkIGRvY1xuICAgIC8vIFhYWCBub3Qgc3VyZSB0aGlzIGlzIG5lY2Vzc2FyeSBzaW5jZSB3ZSBtdXRhdGVcbiAgICBpZiAodHlwZSA9PT0gXCJpbnNlcnRcIikge1xuICAgICAgYXJnc1swXSA9IGRvYztcbiAgICB9IGVsc2Uge1xuICAgICAgYXJnc1sxXSA9IGRvYztcbiAgICB9XG5cbiAgICAvLyBJZiBjYWxsYmFjaywgc2V0IGludmFsaWRLZXkgd2hlbiB3ZSBnZXQgYSBtb25nbyB1bmlxdWUgZXJyb3JcbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIGhhc0NhbGxiYWNrKSB7XG4gICAgICBhcmdzW2xhc3RdID0gd3JhcENhbGxiYWNrRm9yUGFyc2luZ01vbmdvVmFsaWRhdGlvbkVycm9ycyh2YWxpZGF0aW9uQ29udGV4dCwgYXJnc1tsYXN0XSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyZ3M7XG4gIH0gZWxzZSB7XG4gICAgZXJyb3IgPSBnZXRFcnJvck9iamVjdCh2YWxpZGF0aW9uQ29udGV4dCwgYGluICR7Y29sbGVjdGlvbi5fbmFtZX0gJHt0eXBlfWApO1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgLy8gaW5zZXJ0L3VwZGF0ZS91cHNlcnQgcGFzcyBgZmFsc2VgIHdoZW4gdGhlcmUncyBhbiBlcnJvciwgc28gd2UgZG8gdGhhdFxuICAgICAgY2FsbGJhY2soZXJyb3IsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldEVycm9yT2JqZWN0KGNvbnRleHQsIGFwcGVuZFRvTWVzc2FnZSA9ICcnKSB7XG4gIGxldCBtZXNzYWdlO1xuICBjb25zdCBpbnZhbGlkS2V5cyA9ICh0eXBlb2YgY29udGV4dC52YWxpZGF0aW9uRXJyb3JzID09PSAnZnVuY3Rpb24nKSA/IGNvbnRleHQudmFsaWRhdGlvbkVycm9ycygpIDogY29udGV4dC5pbnZhbGlkS2V5cygpO1xuICBpZiAoaW52YWxpZEtleXMubGVuZ3RoKSB7XG4gICAgY29uc3QgZmlyc3RFcnJvcktleSA9IGludmFsaWRLZXlzWzBdLm5hbWU7XG4gICAgY29uc3QgZmlyc3RFcnJvck1lc3NhZ2UgPSBjb250ZXh0LmtleUVycm9yTWVzc2FnZShmaXJzdEVycm9yS2V5KTtcblxuICAgIC8vIElmIHRoZSBlcnJvciBpcyBpbiBhIG5lc3RlZCBrZXksIGFkZCB0aGUgZnVsbCBrZXkgdG8gdGhlIGVycm9yIG1lc3NhZ2VcbiAgICAvLyB0byBiZSBtb3JlIGhlbHBmdWwuXG4gICAgaWYgKGZpcnN0RXJyb3JLZXkuaW5kZXhPZignLicpID09PSAtMSkge1xuICAgICAgbWVzc2FnZSA9IGZpcnN0RXJyb3JNZXNzYWdlO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlID0gYCR7Zmlyc3RFcnJvck1lc3NhZ2V9ICgke2ZpcnN0RXJyb3JLZXl9KWA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG1lc3NhZ2UgPSBcIkZhaWxlZCB2YWxpZGF0aW9uXCI7XG4gIH1cbiAgbWVzc2FnZSA9IGAke21lc3NhZ2V9ICR7YXBwZW5kVG9NZXNzYWdlfWAudHJpbSgpO1xuICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgZXJyb3IuaW52YWxpZEtleXMgPSBpbnZhbGlkS2V5cztcbiAgZXJyb3IudmFsaWRhdGlvbkNvbnRleHQgPSBjb250ZXh0O1xuICAvLyBJZiBvbiB0aGUgc2VydmVyLCB3ZSBhZGQgYSBzYW5pdGl6ZWQgZXJyb3IsIHRvbywgaW4gY2FzZSB3ZSdyZVxuICAvLyBjYWxsZWQgZnJvbSBhIG1ldGhvZC5cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGVycm9yLnNhbml0aXplZEVycm9yID0gbmV3IE1ldGVvci5FcnJvcig0MDAsIG1lc3NhZ2UsIEVKU09OLnN0cmluZ2lmeShlcnJvci5pbnZhbGlkS2V5cykpO1xuICB9XG4gIHJldHVybiBlcnJvcjtcbn1cblxuZnVuY3Rpb24gYWRkVW5pcXVlRXJyb3IoY29udGV4dCwgZXJyb3JNZXNzYWdlKSB7XG4gIHZhciBuYW1lID0gZXJyb3JNZXNzYWdlLnNwbGl0KCdjMl8nKVsxXS5zcGxpdCgnICcpWzBdO1xuICB2YXIgdmFsID0gZXJyb3JNZXNzYWdlLnNwbGl0KCdkdXAga2V5OicpWzFdLnNwbGl0KCdcIicpWzFdO1xuXG4gIHZhciBhZGRWYWxpZGF0aW9uRXJyb3JzUHJvcE5hbWUgPSAodHlwZW9mIGNvbnRleHQuYWRkVmFsaWRhdGlvbkVycm9ycyA9PT0gJ2Z1bmN0aW9uJykgPyAnYWRkVmFsaWRhdGlvbkVycm9ycycgOiAnYWRkSW52YWxpZEtleXMnO1xuICBjb250ZXh0W2FkZFZhbGlkYXRpb25FcnJvcnNQcm9wTmFtZV0oW3tcbiAgICBuYW1lOiBuYW1lLFxuICAgIHR5cGU6ICdub3RVbmlxdWUnLFxuICAgIHZhbHVlOiB2YWxcbiAgfV0pO1xufVxuXG5mdW5jdGlvbiB3cmFwQ2FsbGJhY2tGb3JQYXJzaW5nTW9uZ29WYWxpZGF0aW9uRXJyb3JzKHZhbGlkYXRpb25Db250ZXh0LCBjYikge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlZENhbGxiYWNrRm9yUGFyc2luZ01vbmdvVmFsaWRhdGlvbkVycm9ycyguLi5hcmdzKSB7XG4gICAgY29uc3QgZXJyb3IgPSBhcmdzWzBdO1xuICAgIGlmIChlcnJvciAmJlxuICAgICAgICAoKGVycm9yLm5hbWUgPT09IFwiTW9uZ29FcnJvclwiICYmIGVycm9yLmNvZGUgPT09IDExMDAxKSB8fCBlcnJvci5tZXNzYWdlLmluZGV4T2YoJ01vbmdvRXJyb3I6IEUxMTAwMCcgIT09IC0xKSkgJiZcbiAgICAgICAgZXJyb3IubWVzc2FnZS5pbmRleE9mKCdjMl8nKSAhPT0gLTEpIHtcbiAgICAgIGFkZFVuaXF1ZUVycm9yKHZhbGlkYXRpb25Db250ZXh0LCBlcnJvci5tZXNzYWdlKTtcbiAgICAgIGFyZ3NbMF0gPSBnZXRFcnJvck9iamVjdCh2YWxpZGF0aW9uQ29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBjYi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcENhbGxiYWNrRm9yUGFyc2luZ1NlcnZlckVycm9ycyh2YWxpZGF0aW9uQ29udGV4dCwgY2IpIHtcbiAgdmFyIGFkZFZhbGlkYXRpb25FcnJvcnNQcm9wTmFtZSA9ICh0eXBlb2YgdmFsaWRhdGlvbkNvbnRleHQuYWRkVmFsaWRhdGlvbkVycm9ycyA9PT0gJ2Z1bmN0aW9uJykgPyAnYWRkVmFsaWRhdGlvbkVycm9ycycgOiAnYWRkSW52YWxpZEtleXMnO1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlZENhbGxiYWNrRm9yUGFyc2luZ1NlcnZlckVycm9ycyguLi5hcmdzKSB7XG4gICAgY29uc3QgZXJyb3IgPSBhcmdzWzBdO1xuICAgIC8vIEhhbmRsZSBvdXIgb3duIHZhbGlkYXRpb24gZXJyb3JzXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgTWV0ZW9yLkVycm9yICYmXG4gICAgICAgIGVycm9yLmVycm9yID09PSA0MDAgJiZcbiAgICAgICAgZXJyb3IucmVhc29uID09PSBcIklOVkFMSURcIiAmJlxuICAgICAgICB0eXBlb2YgZXJyb3IuZGV0YWlscyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdmFyIGludmFsaWRLZXlzRnJvbVNlcnZlciA9IEVKU09OLnBhcnNlKGVycm9yLmRldGFpbHMpO1xuICAgICAgdmFsaWRhdGlvbkNvbnRleHRbYWRkVmFsaWRhdGlvbkVycm9yc1Byb3BOYW1lXShpbnZhbGlkS2V5c0Zyb21TZXJ2ZXIpO1xuICAgICAgYXJnc1swXSA9IGdldEVycm9yT2JqZWN0KHZhbGlkYXRpb25Db250ZXh0KTtcbiAgICB9XG4gICAgLy8gSGFuZGxlIE1vbmdvIHVuaXF1ZSBpbmRleCBlcnJvcnMsIHdoaWNoIGFyZSBmb3J3YXJkZWQgdG8gdGhlIGNsaWVudCBhcyA0MDkgZXJyb3JzXG4gICAgZWxzZSBpZiAoZXJyb3IgaW5zdGFuY2VvZiBNZXRlb3IuRXJyb3IgJiZcbiAgICAgICAgICAgICBlcnJvci5lcnJvciA9PT0gNDA5ICYmXG4gICAgICAgICAgICAgZXJyb3IucmVhc29uICYmXG4gICAgICAgICAgICAgZXJyb3IucmVhc29uLmluZGV4T2YoJ0UxMTAwMCcpICE9PSAtMSAmJlxuICAgICAgICAgICAgIGVycm9yLnJlYXNvbi5pbmRleE9mKCdjMl8nKSAhPT0gLTEpIHtcbiAgICAgIGFkZFVuaXF1ZUVycm9yKHZhbGlkYXRpb25Db250ZXh0LCBlcnJvci5yZWFzb24pO1xuICAgICAgYXJnc1swXSA9IGdldEVycm9yT2JqZWN0KHZhbGlkYXRpb25Db250ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIGNiLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9O1xufVxuXG52YXIgYWxyZWFkeUluc2VjdXJlZCA9IHt9O1xuZnVuY3Rpb24ga2VlcEluc2VjdXJlKGMpIHtcbiAgLy8gSWYgaW5zZWN1cmUgcGFja2FnZSBpcyBpbiB1c2UsIHdlIG5lZWQgdG8gYWRkIGFsbG93IHJ1bGVzIHRoYXQgcmV0dXJuXG4gIC8vIHRydWUuIE90aGVyd2lzZSwgaXQgd291bGQgc2VlbWluZ2x5IHR1cm4gb2ZmIGluc2VjdXJlIG1vZGUuXG4gIGlmIChQYWNrYWdlICYmIFBhY2thZ2UuaW5zZWN1cmUgJiYgIWFscmVhZHlJbnNlY3VyZWRbYy5fbmFtZV0pIHtcbiAgICBjLmFsbG93KHtcbiAgICAgIGluc2VydDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBmZXRjaDogW10sXG4gICAgICB0cmFuc2Zvcm06IG51bGxcbiAgICB9KTtcbiAgICBhbHJlYWR5SW5zZWN1cmVkW2MuX25hbWVdID0gdHJ1ZTtcbiAgfVxuICAvLyBJZiBpbnNlY3VyZSBwYWNrYWdlIGlzIE5PVCBpbiB1c2UsIHRoZW4gYWRkaW5nIHRoZSB0d28gZGVueSBmdW5jdGlvbnNcbiAgLy8gZG9lcyBub3QgaGF2ZSBhbnkgZWZmZWN0IG9uIHRoZSBtYWluIGFwcCdzIHNlY3VyaXR5IHBhcmFkaWdtLiBUaGVcbiAgLy8gdXNlciB3aWxsIHN0aWxsIGJlIHJlcXVpcmVkIHRvIGFkZCBhdCBsZWFzdCBvbmUgYWxsb3cgZnVuY3Rpb24gb2YgaGVyXG4gIC8vIG93biBmb3IgZWFjaCBvcGVyYXRpb24gZm9yIHRoaXMgY29sbGVjdGlvbi4gQW5kIHRoZSB1c2VyIG1heSBzdGlsbCBhZGRcbiAgLy8gYWRkaXRpb25hbCBkZW55IGZ1bmN0aW9ucywgYnV0IGRvZXMgbm90IGhhdmUgdG8uXG59XG5cbnZhciBhbHJlYWR5RGVmaW5lZCA9IHt9O1xuZnVuY3Rpb24gZGVmaW5lRGVueShjLCBvcHRpb25zKSB7XG4gIGlmICghYWxyZWFkeURlZmluZWRbYy5fbmFtZV0pIHtcblxuICAgIHZhciBpc0xvY2FsQ29sbGVjdGlvbiA9IChjLl9jb25uZWN0aW9uID09PSBudWxsKTtcblxuICAgIC8vIEZpcnN0IGRlZmluZSBkZW55IGZ1bmN0aW9ucyB0byBleHRlbmQgZG9jIHdpdGggdGhlIHJlc3VsdHMgb2YgY2xlYW5cbiAgICAvLyBhbmQgYXV0b3ZhbHVlcy4gVGhpcyBtdXN0IGJlIGRvbmUgd2l0aCBcInRyYW5zZm9ybTogbnVsbFwiIG9yIHdlIHdvdWxkIGJlXG4gICAgLy8gZXh0ZW5kaW5nIGEgY2xvbmUgb2YgZG9jIGFuZCB0aGVyZWZvcmUgaGF2ZSBubyBlZmZlY3QuXG4gICAgYy5kZW55KHtcbiAgICAgIGluc2VydDogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgLy8gUmVmZXJlbmNlZCBkb2MgaXMgY2xlYW5lZCBpbiBwbGFjZVxuICAgICAgICBjLnNpbXBsZVNjaGVtYShkb2MpLmNsZWFuKGRvYywge1xuICAgICAgICAgIG11dGF0ZTogdHJ1ZSxcbiAgICAgICAgICBpc01vZGlmaWVyOiBmYWxzZSxcbiAgICAgICAgICAvLyBXZSBkb24ndCBkbyB0aGVzZSBoZXJlIGJlY2F1c2UgdGhleSBhcmUgZG9uZSBvbiB0aGUgY2xpZW50IGlmIGRlc2lyZWRcbiAgICAgICAgICBmaWx0ZXI6IGZhbHNlLFxuICAgICAgICAgIGF1dG9Db252ZXJ0OiBmYWxzZSxcbiAgICAgICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgIHRyaW1TdHJpbmdzOiBmYWxzZSxcbiAgICAgICAgICBleHRlbmRBdXRvVmFsdWVDb250ZXh0OiB7XG4gICAgICAgICAgICBpc0luc2VydDogdHJ1ZSxcbiAgICAgICAgICAgIGlzVXBkYXRlOiBmYWxzZSxcbiAgICAgICAgICAgIGlzVXBzZXJ0OiBmYWxzZSxcbiAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgaXNGcm9tVHJ1c3RlZENvZGU6IGZhbHNlLFxuICAgICAgICAgICAgZG9jSWQ6IGRvYy5faWQsXG4gICAgICAgICAgICBpc0xvY2FsQ29sbGVjdGlvbjogaXNMb2NhbENvbGxlY3Rpb25cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZHMsIG1vZGlmaWVyKSB7XG4gICAgICAgIC8vIFJlZmVyZW5jZWQgbW9kaWZpZXIgaXMgY2xlYW5lZCBpbiBwbGFjZVxuICAgICAgICBjLnNpbXBsZVNjaGVtYShtb2RpZmllcikuY2xlYW4obW9kaWZpZXIsIHtcbiAgICAgICAgICBtdXRhdGU6IHRydWUsXG4gICAgICAgICAgaXNNb2RpZmllcjogdHJ1ZSxcbiAgICAgICAgICAvLyBXZSBkb24ndCBkbyB0aGVzZSBoZXJlIGJlY2F1c2UgdGhleSBhcmUgZG9uZSBvbiB0aGUgY2xpZW50IGlmIGRlc2lyZWRcbiAgICAgICAgICBmaWx0ZXI6IGZhbHNlLFxuICAgICAgICAgIGF1dG9Db252ZXJ0OiBmYWxzZSxcbiAgICAgICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgIHRyaW1TdHJpbmdzOiBmYWxzZSxcbiAgICAgICAgICBleHRlbmRBdXRvVmFsdWVDb250ZXh0OiB7XG4gICAgICAgICAgICBpc0luc2VydDogZmFsc2UsXG4gICAgICAgICAgICBpc1VwZGF0ZTogdHJ1ZSxcbiAgICAgICAgICAgIGlzVXBzZXJ0OiBmYWxzZSxcbiAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgaXNGcm9tVHJ1c3RlZENvZGU6IGZhbHNlLFxuICAgICAgICAgICAgZG9jSWQ6IGRvYyAmJiBkb2MuX2lkLFxuICAgICAgICAgICAgaXNMb2NhbENvbGxlY3Rpb246IGlzTG9jYWxDb2xsZWN0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgZmV0Y2g6IFsnX2lkJ10sXG4gICAgICB0cmFuc2Zvcm06IG51bGxcbiAgICB9KTtcblxuICAgIC8vIFNlY29uZCBkZWZpbmUgZGVueSBmdW5jdGlvbnMgdG8gdmFsaWRhdGUgYWdhaW4gb24gdGhlIHNlcnZlclxuICAgIC8vIGZvciBjbGllbnQtaW5pdGlhdGVkIGluc2VydHMgYW5kIHVwZGF0ZXMuIFRoZXNlIHNob3VsZCBiZVxuICAgIC8vIGNhbGxlZCBhZnRlciB0aGUgY2xlYW4vYXV0b3ZhbHVlIGZ1bmN0aW9ucyBzaW5jZSB3ZSdyZSBhZGRpbmdcbiAgICAvLyB0aGVtIGFmdGVyLiBUaGVzZSBtdXN0ICpub3QqIGhhdmUgXCJ0cmFuc2Zvcm06IG51bGxcIiBpZiBvcHRpb25zLnRyYW5zZm9ybSBpcyB0cnVlIGJlY2F1c2VcbiAgICAvLyB3ZSBuZWVkIHRvIHBhc3MgdGhlIGRvYyB0aHJvdWdoIGFueSB0cmFuc2Zvcm1zIHRvIGJlIHN1cmVcbiAgICAvLyB0aGF0IGN1c3RvbSB0eXBlcyBhcmUgcHJvcGVybHkgcmVjb2duaXplZCBmb3IgdHlwZSB2YWxpZGF0aW9uLlxuICAgIGMuZGVueSh7XG4gICAgICBpbnNlcnQ6IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIC8vIFdlIHBhc3MgdGhlIGZhbHNlIG9wdGlvbnMgYmVjYXVzZSB3ZSB3aWxsIGhhdmUgZG9uZSB0aGVtIG9uIGNsaWVudCBpZiBkZXNpcmVkXG4gICAgICAgIGRvVmFsaWRhdGUoXG4gICAgICAgICAgYyxcbiAgICAgICAgICBcImluc2VydFwiLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIGRvYyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHJpbVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgICAgICBmaWx0ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICBhdXRvQ29udmVydDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ0lOVkFMSUQnLCBFSlNPTi5zdHJpbmdpZnkoZXJyb3IuaW52YWxpZEtleXMpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgZmFsc2UsIC8vIGdldEF1dG9WYWx1ZXNcbiAgICAgICAgICB1c2VySWQsXG4gICAgICAgICAgZmFsc2UgLy8gaXNGcm9tVHJ1c3RlZENvZGVcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgdXBkYXRlOiBmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGRzLCBtb2RpZmllcikge1xuICAgICAgICAvLyBOT1RFOiBUaGlzIHdpbGwgbmV2ZXIgYmUgYW4gdXBzZXJ0IGJlY2F1c2UgY2xpZW50LXNpZGUgdXBzZXJ0c1xuICAgICAgICAvLyBhcmUgbm90IGFsbG93ZWQgb25jZSB5b3UgZGVmaW5lIGFsbG93L2RlbnkgZnVuY3Rpb25zLlxuICAgICAgICAvLyBXZSBwYXNzIHRoZSBmYWxzZSBvcHRpb25zIGJlY2F1c2Ugd2Ugd2lsbCBoYXZlIGRvbmUgdGhlbSBvbiBjbGllbnQgaWYgZGVzaXJlZFxuICAgICAgICBkb1ZhbGlkYXRlKFxuICAgICAgICAgIGMsXG4gICAgICAgICAgXCJ1cGRhdGVcIixcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7X2lkOiBkb2MgJiYgZG9jLl9pZH0sXG4gICAgICAgICAgICBtb2RpZmllcixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHJpbVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgICAgICBmaWx0ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICBhdXRvQ29udmVydDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ0lOVkFMSUQnLCBFSlNPTi5zdHJpbmdpZnkoZXJyb3IuaW52YWxpZEtleXMpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgZmFsc2UsIC8vIGdldEF1dG9WYWx1ZXNcbiAgICAgICAgICB1c2VySWQsXG4gICAgICAgICAgZmFsc2UgLy8gaXNGcm9tVHJ1c3RlZENvZGVcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgZmV0Y2g6IFsnX2lkJ10sXG4gICAgICAuLi4ob3B0aW9ucy50cmFuc2Zvcm0gPT09IHRydWUgPyB7fSA6IHt0cmFuc2Zvcm06IG51bGx9KSxcbiAgICB9KTtcblxuICAgIC8vIG5vdGUgdGhhdCB3ZSd2ZSBhbHJlYWR5IGRvbmUgdGhpcyBjb2xsZWN0aW9uIHNvIHRoYXQgd2UgZG9uJ3QgZG8gaXQgYWdhaW5cbiAgICAvLyBpZiBhdHRhY2hTY2hlbWEgaXMgY2FsbGVkIGFnYWluXG4gICAgYWxyZWFkeURlZmluZWRbYy5fbmFtZV0gPSB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbGxlY3Rpb24yO1xuIl19
