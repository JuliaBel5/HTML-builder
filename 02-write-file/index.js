const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const file = path.join(__dirname, 'text.txt');
const int = readline.createInterface({ input, output });

function createFile() {
  fs.open(file, 'w', (err) => {
    if (err) throw err;
  });
}

fs.stat(file, function (err) {
  if (err) {
    createFile();
  } else {
    fs.unlink(file, (err) => {
      if (err) {
        console.error(err);
        return;
      } else {
        createFile();
      }
    });
  }
});

function writeFile() {
  int.question('What do we say to the God of Death? ', (answer) => {
    if (answer !== 'exit') {
      fs.appendFile(file, answer + '\n', (err) => {
        if (err) throw err;
        writeFile();
      });
    } else if (answer === 'exit') {
      console.log('Not today.');
      int.close();
    }
  });
}

writeFile();

int.on('SIGINT', () => {
  console.log('Valar morghulis!');
  int.close();
});
