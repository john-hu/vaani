/* global navigator */

class AppLauncher {
  /**
   * Launches an app or returns an error
   * @param appName {String} The app to launch
   */
  static launch (appName, entryPoint, callback) {
    this.findByName(appName, (err, app) => {
      if (err) {
        callback(err);
        return;
      }

      app.launch(entryPoint);
    });
  }
  /**
   * Launches an app or returns an error
   * @param manifest {String} The app to launch
   * @param entryPoint {String} The entry point of this app to launch
   */
  static launchApp (manifestURL, entryPoint, callback) {
    this.findByManifest(manifestURL, (err, app) => {
      if (err) {
        if (callback) {
          callback(err);
        }
        return;
      }

      app.launch(entryPoint);
    });
  }

  static listApps (callback) {
    if (this.installedApps) {
      callback(null, this.installedApps);
      return;
    }

    var allApps = navigator.mozApps.mgmt.getAll();
    allApps.onsuccess = () => {
      this.installedApps = allApps.result;
      callback(null, this.installedApps);
    };
    allApps.onerror = callback;
  }

  static listAppNames (callback) {
    this.listApps((error, installedApps) => {
      if (error) {
        callback(error);
        return;
      }
      var names = [];
      installedApps.map(function(app) {
        if (app.manifest.entry_points) {
          Object.keys(app.manifest.entry_points).forEach(function(key) {
            names.push(app.manifest.entry_points[key].name);
          });
        } else {
          names.push(app.manifest.name);
        }
      });
      callback(null, names);
    });
  }

  /**
   * Finds an app by name
   * @param appName {String} The app to find
   */
  static findByName (appName, callback) {
    if (!navigator.mozApps || !navigator.mozApps.mgmt) {
      callback(Error('navigator.mozApps not found'));
      return;
    }

    this.listApps((error, installedApps) => {
      if (error) {
        callback(error);
        return;
      }
      var foundApp = installedApps.find((app, index, array) => {
        if (app.manifest.entry_points) {
          // convert key(string) to boolean if found.
          return !!Object.keys(app.manifest.entry_points).find(function(key) {
            return app.manifest.entry_points[key].name.toLowerCase() ===
                   appName.toLowerCase();;
          });
        } else {
          return app.manifest.name.toLowerCase() === appName.toLowerCase();
        }
      });

      if (foundApp) {
        callback(null, foundApp);
      }
      else {
        callback(new Error('App (' + appName + ') not found.'));
      }
    });
  }

  /**
   * Finds an app by manifestURL
   * @param manifestURL {String} The app to find
   */
  static findByManifest (manifestURL, callback) {
    this.listApps((error, installedApps) => {
      if (error) {
        callback(error);
        return;
      }

      var foundApp = installedApps.find((app, index, array) => {
        return app.manifestURL === manifestURL;
      });

      if (foundApp) {
        callback(null, foundApp);
      }
      else {
        callback(new Error('App (' + manifestURL + ') not found.'));
      }
    });
  }
}


export default AppLauncher;
