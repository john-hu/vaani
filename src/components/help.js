import 'gaia-dialog/gaia-dialog-alert';
import GaiaComponent from 'gaia-component';
import ToolbarActions from '../actions/toolbar';
import ActionsHelper from '../actions/actions-helper';
import AppActions from '../stores/app-actions';


var Help = GaiaComponent.register('vaani-help', {
  created: function () {
    this.setupShadowRoot();

    this.dialog = this.shadowRoot.querySelector('gaia-dialog-alert');
    if (AppActions.actions) {
      Object.keys(AppActions.actions).forEach(function(action) {
        var p = document.createElement('p');
        p.textContent = ActionsHelper.getDisplayText(action);
        this.dialog.appendChild(p);
      }.bind(this));
    }
  },
  attached: function () {
    this.dialog.open();
    this.dialog.addEventListener('closed', this.onClose.bind(this));
  },
  detached: function () {
    this.dialog.removeEventListener('closed', this.onClose.bind(this));
  },
  onClose: function () {
    ToolbarActions.setActiveItem('none');
  },
  template: `
    <div id="help">
      <gaia-dialog-alert>
        <h3>What can I ask Vaani?</h3>
      </gaia-dialog-alert>
    </div>
  `
});


export default Help;
