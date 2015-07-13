import AppLauncher from '../lib/app-launcher'

var AppActions = {
  /**
   * Initialize the app actions. It reads actions from manifests.
   */
  parseAppActions: function() {
    // actions structure:
    // var a = {
    //   '{ActionName}': {
    //     '{TargetType}': [
    //       { 'InvokeMethodProperty': 'InvokeMethodValue' }
    //     ]
    //   }
    // };
    // ActionName is comprised of action and object, like:
    //   DialAction-, OpenAction-SoftwareApplication.
    // example of target type, invoke method, and value:
    //    'activity': [{
    //      'activityName': command.target.activity.name,
    //      'activityData': command.target.activity.data
    //    }]
    AppLauncher.listApps((err, apps) => {
      var actions = {};
      apps.forEach(function(app) {
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
    });
  },

  _parseActions: function(actions, command) {
    var actType = command['@type'];
    var actObject = command.object || '';
    if (!actions[actType + '-' + actObject]) {
      actions[actType + '-' + actObject] = {};
    }

    if (command.target['@type'] === 'activity') {
      if (!actions[actType + '-' + actObject].activity) {
        actions[actType + '-' + actObject].activity = [];
      }
      actions[actType + '-' + actObject].activity.push({
        'activityName': command.target.activity.name,
        'activityData': command.target.activity.data
      });
    }
  }
}


export default AppActions;