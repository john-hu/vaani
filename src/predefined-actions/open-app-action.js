import AppLauncher from '../lib/app-launcher';

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
        AppLauncher.findByName(matched[1], (err, app) => {
          if (err) {
            reject(err);
            return;
          }
          var entryPoint = '';
          if (app.manifest.entry_points) {
            // convert key(string) to boolean if found.
            entryPoint = Object.keys(app.manifest.entry_points).find((key) => {
              return app.manifest.entry_points[key].name.toLowerCase() ===
                     matched[1].toLowerCase();;
            });
          }
          resolve({
            '@manifest': app.manifestURL,
            '@entry_point': entryPoint
          });
        });
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
