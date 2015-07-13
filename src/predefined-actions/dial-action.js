
class DialAction {
  static get displayText() {
    return 'Call/Dial <number>';
  }

  get grammar() {
    return '<DialAction-> = (call | dial) (one | two | three | four | ' +
                           'five | six | seven | eight | nine | zero)+;';
  }

  parse (transcript) {
    return new Promise((resolve, reject) => {
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
      var matched = (/(call|dial) ([0-9\s]+)/gim).exec(formalized);
      if (matched && matched.length > 1) {
        resolve({
          '@number': matched[2]
        });
      } else {
        reject();
      }
    });
  }

  probe (transcript) {
    var regex = new RegExp('(call|dial) (one|two|three|four|five|' +
                                        'six|seven|eight|nine|zero|\s)+',
                              'gim');
    return regex.test(transcript);
  }
}

export default DialAction;
