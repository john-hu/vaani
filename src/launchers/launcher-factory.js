import ActivityLuncher from './activity-launcher'


class LauncherFactory {
  static parse (type, command) {
    switch(type) {
      case 'activity':
        return ActivityLuncher.parse(command);
      default:
        return;
    }
  }

  static execute (type, action, args) {
    switch(type) {
      case 'activity':
        ActivityLuncher.execute(action, args);
        break;
    }
  }
}

export default LauncherFactory;
