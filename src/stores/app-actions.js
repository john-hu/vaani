var AppActions = {
  /**
   * Initialize the app actions. It reads actions from manifests.
   */
  init: function() {
    var allApps = navigator.mozApps.mgmt.getAll();
    allApps.onsuccess = () => {
      var actions = {};
      var list = allApps.result;
      list.forEach(function(app) {
        var manifest = app.manifest;
        if (manifest.custom_commands) {
          manifest.custom_commands.forEach(
            AppActions._parseActions.bind(AppActions, actions));
        } else if (manifest.entry_points) {
          Object.keys(manifest.entry_points).forEach(function(key) {
            var customCommands = manifest.entry_points[key].custom_commands;
            if (customCommands) {
              customCommands.forEach(
                AppActions._parseActions.bind(AppActions, actions));
            }
          });
        }
      });
      AppActions.actions = actions;
    };
  },

  _parseActions: function(actions, command) {
    if (!actions[command['@type']]) {
      actions[command['@type']] = [];
    }

    if (command.target.activity) {
      actions[command['@type']].push({
        'activityName': command.target.activity.name,
        'activityData': command.target.activity.data
      });
    }
  }
}


export default AppActions;
