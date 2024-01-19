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
    //console.log('Файла text.txt не существует, создаю новый');
    createFile();
  } else {
    fs.unlink(file, (err) => {
      if (err) {
        console.error(err);
        return;
      } else {
        //console.log('Старый файл text.txt успешно удален. Создан новый файл');
        createFile();
      }
    });
  }
});

function writeFile() {
  int.question('What do we say to the God of Death? ', (answer) => {
    //const text = answer.toString;
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
