import Debug from 'debug';
import AppStore from '../stores/app';
import DisplayActions from '../actions/display';


let debug = Debug('ToolbarActions');


class ToolbarActions {
  /**
   * Sets the active item
   * @param value {String} The active item
   */
  static setActiveItem (value) {
    debug('setActiveItem', arguments);

    AppStore.state.toolbar.activeItem = value;
    if (value === 'none') {
      DisplayActions.changeViews(null);
    }
    AppStore.emitChange();
  }
}


export default ToolbarActions;
