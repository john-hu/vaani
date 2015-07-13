import AppLauncher from '../lib/app-launcher';
import LauncherFactory from '../launchers/launcher-factory';

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
    var actKey = command['@type'] + '-' + (command.object || '');
    if (!actions[actKey]) {
      actions[actKey] = {};
    }

    var data = LauncherFactory.parse(command.target['@type'], command);
    if (data) {
      actions[actKey]['@type'] = command.target['@type'];
      if (!actions[actKey][command.target['@type']]) {
        actions[actKey][command.target['@type']] = [];
      }
      actions[actKey][command.target['@type']].push(data);
    }
  }
}


export default AppActions;
