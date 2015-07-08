import Debug from 'debug';
import AppStore from '../stores/app';
import AppActions from '../stores/app-actions';
import Vaani from '../lib/vaani';
import AppLauncher from '../lib/app-launcher';
import TalkieActions from './talkie';
import ActionsHelper from './actions-helper';
import ActivityHelper from './activity-helper';


let debug = Debug('StandingByActions');


class StandingByActions {
  /**
   * Initializes a Vaani instance
   */
  static setupSpeech () {
    debug('setupSpeech');

    var grammars =  `
      #JSGF v1.0;
      grammar fxosVoiceCommands;
    `;
    Object.keys(AppActions.actions).forEach(function(action) {
      grammars += ActionsHelper.getActionGrammar(action);
    });

    this.vaani = new Vaani({
      grammar: grammars,
      interpreter: this._interpreter.bind(this),
      onSay: this._onSay.bind(this),
      onSayDone: this._onSayDone.bind(this),
      onListen: this._onListen.bind(this),
      onListenDone: this._onListenDone.bind(this)
    });
  }

  /**
   * Greets the user and waits for a response
   */
  static greetUser () {
    debug('greetUser');

    this.vaani.say('How may I help you?', true);
  }

  /**
   * Interprets the result of speech recognition
   * @param err {Error|null} An error if speech was not understood
   * @param command {String} Text returned from the speech recognition
   */
  static _interpreter (err, command) {
    debug('_interpreter', arguments);

    TalkieActions.setActiveAnimation('none');

    if (err) {
      debug('_interpreter error', err);

      this.vaani.say('I didn\'t understand, say again.', true);

      return;
    }

    var actions = Object.keys(AppActions.actions);
    var action = actions.find(function(act) {
      return ActionsHelper.probeAction(act, command);
    });

    if (!action) {
      debug('No action matched.', command);

      this.vaani.say('I cannot understand your command.');
      return;
    }

    var param = ActionsHelper.parseResult(action, command);
    if (!param) {
      debug('Unable to interpret command.', command);

      this.vaani.say('I cannot understand the object of your command.');

      return;
    }

    ActivityHelper.sendActivity(AppActions.actions[action][0], param);
  }

  /**
   * A hook that's fired when Vaani's say function is called
   * @param sentence {String} The sentence to be spoken
   * @param waitForResponse {Boolean} Indicates if we will wait
   *        for a response after the sentence has been said
   */
  static _onSay (sentence, waitForResponse) {
    debug('_onSay', arguments);

    AppStore.state.standingBy.text = sentence;

    TalkieActions.setActiveAnimation('sending');
    TalkieActions.setMode('none');
  }

  /**
   * A hook that's fired when Vaani's say function is finished
   * @param sentence {String} The sentence to be spoken
   * @param waitForResponse {Boolean} Indicates if we will wait
   *        for a response after the sentence has been said
   */
  static _onSayDone (sentence, waitForResponse) {
    if (!waitForResponse) {
      TalkieActions.setActiveAnimation('none');
    }
  }

  /**
   * A hook that's fired when Vaani's listen function is called
   */
  static _onListen () {
    debug('_onListen');

    AppStore.state.standingBy.text = '';

    TalkieActions.setActiveAnimation('receiving');
  }

  /**
   * A hook that's fired when Vaani's listen function is finished
   */
  static _onListenDone () {
  }

  /**
   * The action that handles mic toggles
   */
  static toggleMic () {
    debug('toggleMic');

    if (this.vaani.isSpeaking || this.vaani.isListening) {
      this.vaani.cancel();

      AppStore.state.standingBy.text = '';

      TalkieActions.setActiveAnimation('none');
      TalkieActions.setMode('none');

      return;
    }

    this.greetUser();
  }
}


export default StandingByActions;
