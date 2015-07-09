import AppLauncher from '../lib/app-launcher';

class ActivityHandler {

  static _handleActivity(activity) {
    if (activity.source.name === 'open-app') {
      AppLauncher.launchApp(activity.source.data.manifest,
                            activity.source.data.entry_point);
    } else if (activity.source.name === 'voice-command-request') {
      // If we are at inline activity, we shouldn't register message handler to
      // intercept 'open-app'.
      navigator.mozSetMessageHandler('activity', null);
      ActivityHandler._inlineActivityMode = true;
    }
  }

  static init() {
    if (!ActivityHandler._inlineActivityMode) {
      navigator.mozSetMessageHandler('activity',
                                     ActivityHandler._handleActivity);
    }
  }

  static uninit() {
    navigator.mozSetMessageHandler('activity', null);
  }
}

export default ActivityHandler;
