import DialAction from './dial-action';
import OpenAppAction from './open-app-action';

class ActionsFactory {

  static createActions () {
    var ret = {};
    ret[DialAction.actionName] = new DialAction();
    ret[OpenAppAction.actionName] = new OpenAppAction();
    return ret;
  }

  static getDisplayText(type) {
    var action = [DialAction, OpenAppAction].find((action) => {
      return action.actionName === type;
    });
    return action ? action.displayText : null;
  }
}

export default ActionsFactory;
