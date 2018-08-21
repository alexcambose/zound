(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Collection2 = Package['aldeed:collection2'].Collection2;
var ECMAScript = Package.ecmascript.ECMAScript;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:schema-index":{"server.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/aldeed_schema-index/server.js                                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let Collection2;
module.watch(require("meteor/aldeed:collection2"), {
  default(v) {
    Collection2 = v;
  }

}, 0);
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
module.watch(require("./common"));
Collection2.on('schema.attached', (collection, ss) => {
  function ensureIndex(index, name, unique, sparse) {
    Meteor.startup(() => {
      collection._collection._ensureIndex(index, {
        background: true,
        name,
        unique,
        sparse
      });
    });
  }

  function dropIndex(indexName) {
    Meteor.startup(() => {
      try {
        collection._collection._dropIndex(indexName);
      } catch (err) {// no index with that name, which is what we want
      }
    });
  }

  const propName = ss.version === 2 ? 'mergedSchema' : 'schema'; // Loop over fields definitions and ensure collection indexes (server side only)

  const schema = ss[propName]();
  Object.keys(schema).forEach(fieldName => {
    const definition = schema[fieldName];

    if ('index' in definition || definition.unique === true) {
      const index = {}; // If they specified `unique: true` but not `index`,
      // we assume `index: 1` to set up the unique index in mongo

      let indexValue;

      if ('index' in definition) {
        indexValue = definition.index;
        if (indexValue === true) indexValue = 1;
      } else {
        indexValue = 1;
      }

      const indexName = `c2_${fieldName}`; // In the index object, we want object array keys without the ".$" piece

      const idxFieldName = fieldName.replace(/\.\$\./g, '.');
      index[idxFieldName] = indexValue;
      const unique = !!definition.unique && (indexValue === 1 || indexValue === -1);
      let sparse = definition.sparse || false; // If unique and optional, force sparse to prevent errors

      if (!sparse && unique && definition.optional) sparse = true;

      if (indexValue === false) {
        dropIndex(indexName);
      } else {
        ensureIndex(index, indexName, unique, sparse);
      }
    }
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"common.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/aldeed_schema-index/common.js                                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let SimpleSchema;
module.watch(require("simpl-schema"), {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let Collection2;
module.watch(require("meteor/aldeed:collection2"), {
  default(v) {
    Collection2 = v;
  }

}, 1);
// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions(['index', // one of Number, String, Boolean
'unique', // Boolean
'sparse'] // Boolean
);
Collection2.on('schema.attached', (collection, ss) => {
  // Define validation error messages
  if (ss.version >= 2 && ss.messageBox && typeof ss.messageBox.messages === 'function') {
    ss.messageBox.messages({
      en: {
        notUnique: '{{label}} must be unique'
      }
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("/node_modules/meteor/aldeed:schema-index/server.js");

/* Exports */
Package._define("aldeed:schema-index", exports);

})();

//# sourceURL=meteor://💻app/packages/aldeed_schema-index.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWxkZWVkOnNjaGVtYS1pbmRleC9zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2FsZGVlZDpzY2hlbWEtaW5kZXgvY29tbW9uLmpzIl0sIm5hbWVzIjpbIkNvbGxlY3Rpb24yIiwibW9kdWxlIiwid2F0Y2giLCJyZXF1aXJlIiwiZGVmYXVsdCIsInYiLCJNZXRlb3IiLCJvbiIsImNvbGxlY3Rpb24iLCJzcyIsImVuc3VyZUluZGV4IiwiaW5kZXgiLCJuYW1lIiwidW5pcXVlIiwic3BhcnNlIiwic3RhcnR1cCIsIl9jb2xsZWN0aW9uIiwiX2Vuc3VyZUluZGV4IiwiYmFja2dyb3VuZCIsImRyb3BJbmRleCIsImluZGV4TmFtZSIsIl9kcm9wSW5kZXgiLCJlcnIiLCJwcm9wTmFtZSIsInZlcnNpb24iLCJzY2hlbWEiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImZpZWxkTmFtZSIsImRlZmluaXRpb24iLCJpbmRleFZhbHVlIiwiaWR4RmllbGROYW1lIiwicmVwbGFjZSIsIm9wdGlvbmFsIiwiU2ltcGxlU2NoZW1hIiwiZXh0ZW5kT3B0aW9ucyIsIm1lc3NhZ2VCb3giLCJtZXNzYWdlcyIsImVuIiwibm90VW5pcXVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsV0FBSjtBQUFnQkMsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLDJCQUFSLENBQWIsRUFBa0Q7QUFBQ0MsVUFBUUMsQ0FBUixFQUFVO0FBQUNMLGtCQUFZSyxDQUFaO0FBQWM7O0FBQTFCLENBQWxELEVBQThFLENBQTlFO0FBQWlGLElBQUlDLE1BQUo7QUFBV0wsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGVBQVIsQ0FBYixFQUFzQztBQUFDRyxTQUFPRCxDQUFQLEVBQVM7QUFBQ0MsYUFBT0QsQ0FBUDtBQUFTOztBQUFwQixDQUF0QyxFQUE0RCxDQUE1RDtBQUErREosT0FBT0MsS0FBUCxDQUFh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SHlCLENBQTNCLENBR1k7QUFIWjtBQU1BcEMsWUFBWU8sRUFBWixDQUFlLGlCQUFmLEVBQWtDLENBQUNDLFVBQUQsRUFBYUMsRUFBYixLQUFvQjtBQUNwRDtBQUNBLE1BQUlBLEdBQUdlLE9BQUgsSUFBYyxDQUFkLElBQW1CZixHQUFHNEIsVUFBdEIsSUFBb0MsT0FBTzVCLEdBQUc0QixVQUFILENBQWNDLFFBQXJCLEtBQWtDLFVBQTFFLEVBQXNGO0FBQ3BGN0IsT0FBRzRCLFVBQUgsQ0FBY0MsUUFBZCxDQUF1QjtBQUNyQkMsVUFBSTtBQUNGQyxtQkFBVztBQURUO0FBRGlCLEtBQXZCO0FBS0Q7QUFDRixDQVRELEUiLCJmaWxlIjoiL3BhY2thZ2VzL2FsZGVlZF9zY2hlbWEtaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29sbGVjdGlvbjIgZnJvbSAnbWV0ZW9yL2FsZGVlZDpjb2xsZWN0aW9uMic7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxuaW1wb3J0ICcuL2NvbW1vbic7XG5cbkNvbGxlY3Rpb24yLm9uKCdzY2hlbWEuYXR0YWNoZWQnLCAoY29sbGVjdGlvbiwgc3MpID0+IHtcbiAgZnVuY3Rpb24gZW5zdXJlSW5kZXgoaW5kZXgsIG5hbWUsIHVuaXF1ZSwgc3BhcnNlKSB7XG4gICAgTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICAgICAgY29sbGVjdGlvbi5fY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoaW5kZXgsIHtcbiAgICAgICAgYmFja2dyb3VuZDogdHJ1ZSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdW5pcXVlLFxuICAgICAgICBzcGFyc2UsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyb3BJbmRleChpbmRleE5hbWUpIHtcbiAgICBNZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uLl9jb2xsZWN0aW9uLl9kcm9wSW5kZXgoaW5kZXhOYW1lKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAvLyBubyBpbmRleCB3aXRoIHRoYXQgbmFtZSwgd2hpY2ggaXMgd2hhdCB3ZSB3YW50XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBwcm9wTmFtZSA9IHNzLnZlcnNpb24gPT09IDIgPyAnbWVyZ2VkU2NoZW1hJyA6ICdzY2hlbWEnO1xuXG4gIC8vIExvb3Agb3ZlciBmaWVsZHMgZGVmaW5pdGlvbnMgYW5kIGVuc3VyZSBjb2xsZWN0aW9uIGluZGV4ZXMgKHNlcnZlciBzaWRlIG9ubHkpXG4gIGNvbnN0IHNjaGVtYSA9IHNzW3Byb3BOYW1lXSgpO1xuICBPYmplY3Qua2V5cyhzY2hlbWEpLmZvckVhY2goKGZpZWxkTmFtZSkgPT4ge1xuICAgIGNvbnN0IGRlZmluaXRpb24gPSBzY2hlbWFbZmllbGROYW1lXTtcbiAgICBpZiAoJ2luZGV4JyBpbiBkZWZpbml0aW9uIHx8IGRlZmluaXRpb24udW5pcXVlID09PSB0cnVlKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHt9O1xuICAgICAgLy8gSWYgdGhleSBzcGVjaWZpZWQgYHVuaXF1ZTogdHJ1ZWAgYnV0IG5vdCBgaW5kZXhgLFxuICAgICAgLy8gd2UgYXNzdW1lIGBpbmRleDogMWAgdG8gc2V0IHVwIHRoZSB1bmlxdWUgaW5kZXggaW4gbW9uZ29cbiAgICAgIGxldCBpbmRleFZhbHVlO1xuICAgICAgaWYgKCdpbmRleCcgaW4gZGVmaW5pdGlvbikge1xuICAgICAgICBpbmRleFZhbHVlID0gZGVmaW5pdGlvbi5pbmRleDtcbiAgICAgICAgaWYgKGluZGV4VmFsdWUgPT09IHRydWUpIGluZGV4VmFsdWUgPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXhWYWx1ZSA9IDE7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluZGV4TmFtZSA9IGBjMl8ke2ZpZWxkTmFtZX1gO1xuICAgICAgLy8gSW4gdGhlIGluZGV4IG9iamVjdCwgd2Ugd2FudCBvYmplY3QgYXJyYXkga2V5cyB3aXRob3V0IHRoZSBcIi4kXCIgcGllY2VcbiAgICAgIGNvbnN0IGlkeEZpZWxkTmFtZSA9IGZpZWxkTmFtZS5yZXBsYWNlKC9cXC5cXCRcXC4vZywgJy4nKTtcbiAgICAgIGluZGV4W2lkeEZpZWxkTmFtZV0gPSBpbmRleFZhbHVlO1xuICAgICAgY29uc3QgdW5pcXVlID0gISFkZWZpbml0aW9uLnVuaXF1ZSAmJiAoaW5kZXhWYWx1ZSA9PT0gMSB8fCBpbmRleFZhbHVlID09PSAtMSk7XG4gICAgICBsZXQgc3BhcnNlID0gZGVmaW5pdGlvbi5zcGFyc2UgfHwgZmFsc2U7XG5cbiAgICAgIC8vIElmIHVuaXF1ZSBhbmQgb3B0aW9uYWwsIGZvcmNlIHNwYXJzZSB0byBwcmV2ZW50IGVycm9yc1xuICAgICAgaWYgKCFzcGFyc2UgJiYgdW5pcXVlICYmIGRlZmluaXRpb24ub3B0aW9uYWwpIHNwYXJzZSA9IHRydWU7XG5cbiAgICAgIGlmIChpbmRleFZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICBkcm9wSW5kZXgoaW5kZXhOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVuc3VyZUluZGV4KGluZGV4LCBpbmRleE5hbWUsIHVuaXF1ZSwgc3BhcnNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufSk7XG4iLCIvLyBjb2xsZWN0aW9uMiBjaGVja3MgdG8gbWFrZSBzdXJlIHRoYXQgc2ltcGwtc2NoZW1hIHBhY2thZ2UgaXMgYWRkZWRcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBDb2xsZWN0aW9uMiBmcm9tICdtZXRlb3IvYWxkZWVkOmNvbGxlY3Rpb24yJztcblxuLy8gRXh0ZW5kIHRoZSBzY2hlbWEgb3B0aW9ucyBhbGxvd2VkIGJ5IFNpbXBsZVNjaGVtYVxuU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoW1xuICAnaW5kZXgnLCAvLyBvbmUgb2YgTnVtYmVyLCBTdHJpbmcsIEJvb2xlYW5cbiAgJ3VuaXF1ZScsIC8vIEJvb2xlYW5cbiAgJ3NwYXJzZScsIC8vIEJvb2xlYW5cbl0pO1xuXG5Db2xsZWN0aW9uMi5vbignc2NoZW1hLmF0dGFjaGVkJywgKGNvbGxlY3Rpb24sIHNzKSA9PiB7XG4gIC8vIERlZmluZSB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzXG4gIGlmIChzcy52ZXJzaW9uID49IDIgJiYgc3MubWVzc2FnZUJveCAmJiB0eXBlb2Ygc3MubWVzc2FnZUJveC5tZXNzYWdlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHNzLm1lc3NhZ2VCb3gubWVzc2FnZXMoe1xuICAgICAgZW46IHtcbiAgICAgICAgbm90VW5pcXVlOiAne3tsYWJlbH19IG11c3QgYmUgdW5pcXVlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
