import DialAction from './dial-action';
import OpenAppAction from './open-app-action';

class ActionsFactory {

  static createActions () {
    return {
      'DialAction-': new DialAction(), // call <number>
      'OpenAction-SoftwareApplication': new OpenAppAction() // open <app>
    };
  }

  static getDisplayText(type) {
    switch ('type') {
      case 'DialAction-':
        return DialAction.displayText;
      case 'OpenAction-SoftwareApplication':
        return OpenAppAction.displayText;
      default:
        return null;
    }
  }
}

export default ActionsFactory;
