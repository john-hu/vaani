import Debug from 'debug';

let debug = Debug('ActivityLauncher');

class ActivityLauncher {
  static formalizeActivityData(data, args) {
    debug('formalizeActivityData', arguments);
    var jsonText = JSON.stringify(data);
    for(var key in args) {
      jsonText = jsonText.replace(new RegExp(key, 'g'), args[key]);
    }
    return JSON.parse(jsonText);
  }

  static sendActivity(action, args) {
    var data = this.formalizeActivityData(action.activityData, args);
    new MozActivity({
      'name': action.activityName,
      'data': data
    });
  }
}

export default ActivityLauncher;