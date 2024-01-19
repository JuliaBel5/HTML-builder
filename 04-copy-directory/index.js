const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'files');
const target = path.join(__dirname, 'files-copy');

fs.stat(target, function (err) {
  if (err) {
    //  console.log('Нет такой');
    fs.mkdir(`${__dirname}/files-copy`, (err) => {
      if (err) throw err;
      //console.log('Папка успешно создана');
      copyFiles();
    });
  } else {
    // console.log('Нашел');
    fs.readdir(target, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
      //  console.log('Вот он ' + files);

      files.forEach((file) => {
        const filePath = path.join(target, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }

          //  console.log(`Файл ${file} удален`);
        });
      });
      copyFiles();
    });
  }
});

function copyFiles() {
  fs.readdir(source, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        const filePath = path.join(source, file);
        console.log('Копирую файл: ' + file);

        fs.copyFile(filePath, path.join(target, file), (err) => {
          if (err) throw err;
          //  console.log(`Файл ${file}  скопирован`);
        });
      });
    }
  });
}
