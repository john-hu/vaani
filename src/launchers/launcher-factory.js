import ActivityLuncher from './activity-launcher'


class LauncherFactory {
  static parse (type, command) {
    switch(type) {
      case 'WebActivity':
        return ActivityLuncher.parse(command);
      default:
        return;
    }
  }

  static execute (type, action, args) {
    switch(type) {
      case 'WebActivity':
        ActivityLuncher.execute(action, args);
        break;
    }
  }
}

export default LauncherFactory;
