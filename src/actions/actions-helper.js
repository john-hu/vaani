import Debug from 'debug';

let debug = Debug('ActionsHelper');

class ActionsHelper {
  static getDisplayText(action) {
    debug('getDisplayText', action);
    switch(action) {
      case 'DialAction-':
        return 'Call <number>';
      case 'OpenAction-SoftwareApplication':
        return 'Open <app name>';
      default:
        debug('getDisplayText', 'unsupported action: ' + action);
        return null;
    }
  }

  static getActionGrammar(action) {
    debug('getActionGrammar', action);
    switch(action) {
      case 'DialAction-':
        return 'public <dial> = call (one | two | three | four | five | ' +
                                     'six | seven | eight | nine | zero)+;';
      case 'OpenAction-SoftwareApplication':
        return 'public <open-app> = open (phone | messages | email | ' +
                                         'contacts | browser | gallery | ' +
                                         'camera | marketplace | clock | ' +
                                         'settings | calendar | music | ' +
                                         'video);';
      default:
        debug('getActionGrammar', 'unsupported action: ' + action);
        return null;
    }
  }

  static _parseDialAction(transcript) {
    var formalized = transcript.replace(/one/gim, '1')
                               .replace(/two/gim, '2')
                               .replace(/three/gim, '3')
                               .replace(/four/gim, '4')
                               .replace(/five/gim, '5')
                               .replace(/six/gim, '6')
                               .replace(/seven/gim, '7')
                               .replace(/eight/gim, '8')
                               .replace(/nine/gim, '9')
                               .replace(/zero/gim, '0');
    var matched = (/call ([0-9\s]+)/gim).exec(formalized);
    if (matched && matched.length > 1) {
      return {
        '@number': matched[1]
      };
    } else {
      return null;
    }
  }

  static _parseOpenAppAction(transcript) {
    var regex = new RegExp('open (phone|messages|email|' +
                           'contacts|browser|gallery|' +
                           'camera|marketplace|clock|' +
                           'settings|calendar|music|' +
                           'video)',
                    'gim');
    var matched = regex.exec(transcript);
    if (matched && matched.length > 1) {
      switch(matched[1]) {
        case 'phone':
          return {
            '@manifest': 'app://communications.gaiamobile.org/manifest.webapp',
            '@entry_point': 'dialer'
          };
        case 'contacts':
          return {
            '@manifest': 'app://communications.gaiamobile.org/manifest.webapp',
            '@entry_point': 'contacts'
          };
        case 'messges':
          return {
            '@manifest': 'app://sms.gaiamobile.org/manifest.webapp',
            '@entry_point': ''
          };
        case 'marketplace':
          return {
            '@manifest': 'https://marketplace.firefox.com/manifest.webapp',
            '@entry_point': ''
          };
        default:
          return {
            '@manifest': 'app://' + matched[1] +
                         '.gaiamobile.org/manifest.webapp',
            '@entry_point': ''
          };
      }
    } else {
      return null;
    }
  }

  static probeAction(action, transcript) {
    switch(action) {
      case 'DialAction-':
        var regex = new RegExp('call (one|two|three|four|five|' +
                                     'six|seven|eight|nine|zero|\s)+',
                              'gim');
        return regex.test(transcript);
      case 'OpenAction-SoftwareApplication':
        var regex = new RegExp('open (phone|messages|email|' +
                                     'contacts|browser|gallery|' +
                                     'camera|marketplace|clock|' +
                                     'settings|calendar|music|' +
                                     'video)',
                              'gim');
        return regex.test(transcript);
      default:
        return false;
    }
  }

  static parseResult(action, transcript) {
    debug('getActionGrammar', arguments);
    switch(action) {
      case 'DialAction-':
        return this._parseDialAction(transcript);
      case 'OpenAction-SoftwareApplication':
        return this._parseOpenAppAction(transcript);
      default:
        return null;
    }
  }
}

export default ActionsHelper;
