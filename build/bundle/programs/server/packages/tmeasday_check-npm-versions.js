(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"tmeasday:check-npm-versions":{"check-npm-versions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/tmeasday_check-npm-versions/check-npm-versions.js                                                     //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
const module1 = module;
module1.export({
  checkNpmVersions: () => checkNpmVersions
});
let semver;
module1.watch(require("semver"), {
  default(v) {
    semver = v;
  }

}, 0);

// Returns:
//   - true      if a version of the package in the range is installed
//   - false     if no version is installed
//   - version#  if incompatible version is installed
const compatibleVersionIsInstalled = (name, range) => {
  try {
    const installedVersion = require(`${name}/package.json`).version;

    if (semver.satisfies(installedVersion, range)) {
      return true;
    } else {
      return installedVersion;
    }
  } catch (e) {
    // XXX add something to the tool to make this more reliable
    const message = e.toString(); // One message comes out of the install npm package the other from npm directly

    if (message.match("Cannot find module") || message.match("Can't find npm module")) {
      return false;
    } else {
      throw e;
    }
  }
};

const checkNpmVersions = (packages, packageName) => {
  const failures = {};
  Object.keys(packages).forEach(name => {
    const range = packages[name];
    const failure = compatibleVersionIsInstalled(name, range);

    if (failure !== true) {
      failures[name] = failure;
    }
  });

  if (Object.keys(failures).length === 0) {
    return true;
  }

  const errors = [];
  Object.keys(failures).forEach(name => {
    const installed = failures[name];
    const requirement = `${name}@${packages[name]}`;

    if (installed) {
      errors.push(` - ${name}@${installed} installed, ${requirement} needed`);
    } else {
      errors.push(` - ${name}@${packages[name]} not installed.`);
    }
  });
  const qualifier = packageName ? `(for ${packageName}) ` : '';
  console.warn(`WARNING: npm peer requirements ${qualifier}not installed:
${errors.join('\n')}

Read more about installing npm peer dependencies:
  http://guide.meteor.com/using-packages.html#peer-npm-dependencies
`);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"semver":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// node_modules/meteor/tmeasday_check-npm-versions/node_modules/semver/package.json                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
exports.name = "semver";
exports.version = "5.1.0";
exports.main = "semver.js";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"semver.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// node_modules/meteor/tmeasday_check-npm-versions/node_modules/semver/semver.js                                  //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("/node_modules/meteor/tmeasday:check-npm-versions/check-npm-versions.js");

/* Exports */
Package._define("tmeasday:check-npm-versions", exports);

})();

//# sourceURL=meteor://💻app/packages/tmeasday_check-npm-versions.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zL2NoZWNrLW5wbS12ZXJzaW9ucy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUxIiwibW9kdWxlIiwiZXhwb3J0IiwiY2hlY2tOcG1WZXJzaW9ucyIsInNlbXZlciIsIndhdGNoIiwicmVxdWlyZSIsImRlZmF1bHQiLCJ2IiwiY29tcGF0aWJsZVZlcnNpb25Jc0luc3RhbGxlZCIsIm5hbWUiLCJyYW5nZSIsImluc3RhbGxlZFZlcnNpb24iLCJ2ZXJzaW9uIiwic2F0aXNmaWVzIiwiZSIsIm1lc3NhZ2UiLCJ0b1N0cmluZyIsIm1hdGNoIiwicGFja2FnZXMiLCJwYWNrYWdlTmFtZSIsImZhaWx1cmVzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJmYWlsdXJlIiwibGVuZ3RoIiwiZXJyb3JzIiwiaW5zdGFsbGVkIiwicmVxdWlyZW1lbnQiLCJwdXNoIiwicXVhbGlmaWVyIiwiY29uc29sZSIsIndhcm4iLCJqb2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFBTUEsVUFBUUMsTUFBZDtBQUFxQkQsUUFBUUUsTUFBUixDQUFlO0FBQUNDLG9CQUFpQixNQUFJQTtBQUF0QixDQUFmO0FBQXdELElBQUlDLE1BQUo7QUFBV0osUUFBUUssS0FBUixDQUFjQyxRQUFRLFFBQVIsQ0FBZCxFQUFnQztBQUFDQyxVQUFRQyxDQUFSLEVBQVU7QUFBQ0osYUFBT0ksQ0FBUDtBQUFTOztBQUFyQixDQUFoQyxFQUF1RCxDQUF2RDs7QUFFeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQywrQkFBK0IsQ0FBQ0MsSUFBRCxFQUFPQyxLQUFQLEtBQWlCO0FBQ3BELE1BQUk7QUFDRixVQUFNQyxtQkFBbUJOLFFBQVMsR0FBRUksSUFBSyxlQUFoQixFQUFnQ0csT0FBekQ7O0FBQ0EsUUFBSVQsT0FBT1UsU0FBUCxDQUFpQkYsZ0JBQWpCLEVBQW1DRCxLQUFuQyxDQUFKLEVBQStDO0FBQzdDLGFBQU8sSUFBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU9DLGdCQUFQO0FBQ0Q7QUFDRixHQVBELENBT0UsT0FBT0csQ0FBUCxFQUFVO0FBQ1Y7QUFDQSxVQUFNQyxVQUFVRCxFQUFFRSxRQUFGLEVBQWhCLENBRlUsQ0FHVjs7QUFDQSxRQUFJRCxRQUFRRSxLQUFSLENBQWMsb0JBQWQsS0FBdUNGLFFBQVFFLEtBQVIsQ0FBYyx1QkFBZCxDQUEzQyxFQUFtRjtBQUNqRixhQUFPLEtBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxZQUFNSCxDQUFOO0FBQ0Q7QUFDRjtBQUNGLENBbEJEOztBQW9CTyxNQUFNWixtQkFBbUIsQ0FBQ2dCLFFBQUQsRUFBV0MsV0FBWCxLQUEyQjtBQUN6RCxRQUFNQyxXQUFXLEVBQWpCO0FBRUFDLFNBQU9DLElBQVAsQ0FBWUosUUFBWixFQUFzQkssT0FBdEIsQ0FBK0JkLElBQUQsSUFBVTtBQUN0QyxVQUFNQyxRQUFRUSxTQUFTVCxJQUFULENBQWQ7QUFDQSxVQUFNZSxVQUFVaEIsNkJBQTZCQyxJQUE3QixFQUFtQ0MsS0FBbkMsQ0FBaEI7O0FBRUEsUUFBSWMsWUFBWSxJQUFoQixFQUFzQjtBQUNwQkosZUFBU1gsSUFBVCxJQUFpQmUsT0FBakI7QUFDRDtBQUNGLEdBUEQ7O0FBU0EsTUFBSUgsT0FBT0MsSUFBUCxDQUFZRixRQUFaLEVBQXNCSyxNQUF0QixLQUFpQyxDQUFyQyxFQUF3QztBQUN0QyxXQUFPLElBQVA7QUFDRDs7QUFFRCxRQUFNQyxTQUFTLEVBQWY7QUFFQUwsU0FBT0MsSUFBUCxDQUFZRixRQUFaLEVBQXNCRyxPQUF0QixDQUErQmQsSUFBRCxJQUFVO0FBQ3RDLFVBQU1rQixZQUFZUCxTQUFTWCxJQUFULENBQWxCO0FBQ0EsVUFBTW1CLGNBQWUsR0FBRW5CLElBQUssSUFBR1MsU0FBU1QsSUFBVCxDQUFlLEVBQTlDOztBQUVBLFFBQUlrQixTQUFKLEVBQWU7QUFDYkQsYUFBT0csSUFBUCxDQUFhLE1BQUtwQixJQUFLLElBQUdrQixTQUFVLGVBQWNDLFdBQVksU0FBOUQ7QUFDRCxLQUZELE1BRU87QUFDTEYsYUFBT0csSUFBUCxDQUFhLE1BQUtwQixJQUFLLElBQUdTLFNBQVNULElBQVQsQ0FBZSxpQkFBekM7QUFDRDtBQUNGLEdBVEQ7QUFXQSxRQUFNcUIsWUFBWVgsY0FBZSxRQUFPQSxXQUFZLElBQWxDLEdBQXdDLEVBQTFEO0FBQ0FZLFVBQVFDLElBQVIsQ0FBYyxrQ0FBaUNGLFNBQVU7RUFDekRKLE9BQU9PLElBQVAsQ0FBWSxJQUFaLENBQWtCOzs7O0NBRGxCO0FBTUQsQ0FwQ00sQyIsImZpbGUiOiIvcGFja2FnZXMvdG1lYXNkYXlfY2hlY2stbnBtLXZlcnNpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNlbXZlciBmcm9tICdzZW12ZXInO1xuXG4vLyBSZXR1cm5zOlxuLy8gICAtIHRydWUgICAgICBpZiBhIHZlcnNpb24gb2YgdGhlIHBhY2thZ2UgaW4gdGhlIHJhbmdlIGlzIGluc3RhbGxlZFxuLy8gICAtIGZhbHNlICAgICBpZiBubyB2ZXJzaW9uIGlzIGluc3RhbGxlZFxuLy8gICAtIHZlcnNpb24jICBpZiBpbmNvbXBhdGlibGUgdmVyc2lvbiBpcyBpbnN0YWxsZWRcbmNvbnN0IGNvbXBhdGlibGVWZXJzaW9uSXNJbnN0YWxsZWQgPSAobmFtZSwgcmFuZ2UpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpbnN0YWxsZWRWZXJzaW9uID0gcmVxdWlyZShgJHtuYW1lfS9wYWNrYWdlLmpzb25gKS52ZXJzaW9uO1xuICAgIGlmIChzZW12ZXIuc2F0aXNmaWVzKGluc3RhbGxlZFZlcnNpb24sIHJhbmdlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpbnN0YWxsZWRWZXJzaW9uO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFhYWCBhZGQgc29tZXRoaW5nIHRvIHRoZSB0b29sIHRvIG1ha2UgdGhpcyBtb3JlIHJlbGlhYmxlXG4gICAgY29uc3QgbWVzc2FnZSA9IGUudG9TdHJpbmcoKTtcbiAgICAvLyBPbmUgbWVzc2FnZSBjb21lcyBvdXQgb2YgdGhlIGluc3RhbGwgbnBtIHBhY2thZ2UgdGhlIG90aGVyIGZyb20gbnBtIGRpcmVjdGx5XG4gICAgaWYgKG1lc3NhZ2UubWF0Y2goXCJDYW5ub3QgZmluZCBtb2R1bGVcIikgfHwgbWVzc2FnZS5tYXRjaChcIkNhbid0IGZpbmQgbnBtIG1vZHVsZVwiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGNoZWNrTnBtVmVyc2lvbnMgPSAocGFja2FnZXMsIHBhY2thZ2VOYW1lKSA9PiB7XG4gIGNvbnN0IGZhaWx1cmVzID0ge307XG5cbiAgT2JqZWN0LmtleXMocGFja2FnZXMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICBjb25zdCByYW5nZSA9IHBhY2thZ2VzW25hbWVdO1xuICAgIGNvbnN0IGZhaWx1cmUgPSBjb21wYXRpYmxlVmVyc2lvbklzSW5zdGFsbGVkKG5hbWUsIHJhbmdlKTtcblxuICAgIGlmIChmYWlsdXJlICE9PSB0cnVlKSB7XG4gICAgICBmYWlsdXJlc1tuYW1lXSA9IGZhaWx1cmU7XG4gICAgfVxuICB9KTtcblxuICBpZiAoT2JqZWN0LmtleXMoZmFpbHVyZXMpLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY29uc3QgZXJyb3JzID0gW107XG5cbiAgT2JqZWN0LmtleXMoZmFpbHVyZXMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICBjb25zdCBpbnN0YWxsZWQgPSBmYWlsdXJlc1tuYW1lXTtcbiAgICBjb25zdCByZXF1aXJlbWVudCA9IGAke25hbWV9QCR7cGFja2FnZXNbbmFtZV19YDtcblxuICAgIGlmIChpbnN0YWxsZWQpIHtcbiAgICAgIGVycm9ycy5wdXNoKGAgLSAke25hbWV9QCR7aW5zdGFsbGVkfSBpbnN0YWxsZWQsICR7cmVxdWlyZW1lbnR9IG5lZWRlZGApO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvcnMucHVzaChgIC0gJHtuYW1lfUAke3BhY2thZ2VzW25hbWVdfSBub3QgaW5zdGFsbGVkLmApO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgcXVhbGlmaWVyID0gcGFja2FnZU5hbWUgPyBgKGZvciAke3BhY2thZ2VOYW1lfSkgYCA6ICcnO1xuICBjb25zb2xlLndhcm4oYFdBUk5JTkc6IG5wbSBwZWVyIHJlcXVpcmVtZW50cyAke3F1YWxpZmllcn1ub3QgaW5zdGFsbGVkOlxuJHtlcnJvcnMuam9pbignXFxuJyl9XG5cblJlYWQgbW9yZSBhYm91dCBpbnN0YWxsaW5nIG5wbSBwZWVyIGRlcGVuZGVuY2llczpcbiAgaHR0cDovL2d1aWRlLm1ldGVvci5jb20vdXNpbmctcGFja2FnZXMuaHRtbCNwZWVyLW5wbS1kZXBlbmRlbmNpZXNcbmApO1xufTtcbiJdfQ==
