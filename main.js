exports = module.exports = function(config) {
  var cloudflare = require("cloudflare");
  var cf = cloudflare({
    email: config.email,
    key: config.key
  });
  var app = {
    wrapper: require("node-promise-wrapper"),
    zone: function(domain) {
      return new Promise(async function(resolve, reject) {
        var {error, zones} = await app.wrapper("zones", app.zones(domain));
        if (typeof zones !== "undefined") {
          if (typeof zones[domain.toLowerCase()] !== "undefined") {
            resolve(zones[domain.toLowerCase()]);
          } else {
            reject({status: 404, error: "Not found."});
          }
        } else {
          reject(error);
        }
      });
    },
    _zones: undefined,
    zones: function(domain, force) {
      if (typeof force === "undefined") force = false;
      return new Promise(async function(resolve, reject) {
        if (typeof app._zones !== "undefined" && force !== true) {
          resolve(app._zones);
        } else {
          var {error, result} = await app.wrapper("result", cf.zones.browse());
          if (typeof result !== "undefined" && typeof result.result !== "undefined") {
            var zones = result.result;
            if (typeof app._zones === "undefined") app._zones = {};
            for (var i=0; i<=zones.length-1; i++) {
              app._zones[zones[i].name.toLowerCase()] = zones[i];
            }
            resolve(app._zones);
          } else {
            reject(error);
          }
        }
      });
    },
    dns: {
      list: function(domain) {
        return new Promise(async function(resolve, reject) {
          var {error, zone} = await app.wrapper("zone", app.zone(domain));
          if (typeof zone !== "undefined") {
            var {error, result} = await app.wrapper("result", cf.dnsRecords.browse(zone.id));
            if (typeof result !== "undefined" && typeof result.result !== "undefined") {
              resolve(result.result);
            } else {
              reject(result);
            }
          } else {
            reject(error);
          }
        });
      },
      add: function(domain, value) {
        return new Promise(async function(resolve, reject) {
          var {error, zone} = await app.wrapper("zone", app.zone(domain));
          if (typeof zone !== "undefined") {
            var {error, result} = await app.wrapper("result", cf.dnsRecords.add(zone.id, value));
            if (typeof result !== "undefined") {
              if (typeof result.success === true) {
                resolve(result);
              } else {
                reject(result);
              }
            } else {
              reject(error);
            }
          } else {
            reject(error);
          }
        });
      },
      delete: function(domain, query) {
        return new Promise(async function(resolve, reject) {
          if (typeof query === "undefined") {
            reject({status: 404, error: "No query."});
          } else {
            var {error, zone} = await app.wrapper("zone", app.zone(domain));
            if (typeof zone !== "undefined") {
              var {error, list} = await app.wrapper("list", app.dns.list(domain));
              if (typeof list !== "undefined") {
                var deleted = 0;
                for (var i=0; i<=list.length-1; i++) {
                  var record = list[i];
                  var deleteRecord = true;
                  for (var key in query) {
                    if (query[key] != record[key]) {
                      deleteRecord = false;
                    }
                  }
                  if (deleteRecord === true) {
                    var {error, result} = await app.wrapper("result", cf.dnsRecords.del(zone.id, record.id));
                    if (typeof result === "undefined" || result.success !== true) {
                      reject(error);
                      break;
                    } else {
                      deleted += 1;
                    }
                  }
                }
                resolve({status: 100, message: "Done", deleted: deleted});
              } else {
                reject(error);
              }
            } else {
              reject(error);
            }
          }
        });
      }
    }
  };
  return app;
};

(async function() {
  var app = new exports({
    email: "order@5683.me",
    key: "9901b4a28642a4781973ddcaaef8e5d059ed8"
  });
  // var {error, result} = await app.wrapper("result", app.dns.add("ylo.one", {type: "A", name: "test3", content: "149.28.54.63", proxied: true}));
  // var {error, result} = await app.wrapper("result", app.dns.delete("ylo.one", {type: "A"}));
  // console.log(error, result);
})();