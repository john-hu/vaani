
class OpenAppAction {
  static get displayText() {
    return 'Open <app name>';
  }

  get grammar() {
    return 'open (phone | messages | email | ' +
                 'contacts | browser | gallery | ' +
                 'camera | marketplace | clock | ' +
                 'settings | calendar | music | ' +
                 'video)';
  }

  parse (transcript) {
    return new Promise((resolve, reject) => {
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
            resolve({
              '@manifest': 'app://communications.gaiamobile.org/manifest.webapp',
              '@entry_point': 'dialer'
            });
          case 'contacts':
            resolve({
              '@manifest': 'app://communications.gaiamobile.org/manifest.webapp',
              '@entry_point': 'contacts'
            });
          case 'messges':
            resolve({
              '@manifest': 'app://sms.gaiamobile.org/manifest.webapp',
              '@entry_point': ''
            });
          case 'marketplace':
            resolve({
              '@manifest': 'https://marketplace.firefox.com/manifest.webapp',
              '@entry_point': ''
            });
          default:
            resolve({
              '@manifest': 'app://' + matched[1] +
                           '.gaiamobile.org/manifest.webapp',
              '@entry_point': ''
            });
        }
      } else {
        reject();
      }
    });
  }

  probe (transcript) {
    var regex = new RegExp('open (phone|messages|email|' +
                                 'contacts|browser|gallery|' +
                                 'camera|marketplace|clock|' +
                                 'settings|calendar|music|' +
                                 'video)',
                          'gim');
    return regex.test(transcript);
  }
}

export default OpenAppAction;
