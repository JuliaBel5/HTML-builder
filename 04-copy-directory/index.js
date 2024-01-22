const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'files');
const target = path.join(__dirname, 'files-copy');

fs.stat(target, function (err) {
  if (err) {
    fs.mkdir(`${__dirname}/files-copy`, (err) => {
      if (err) throw err;

      copyFiles();
    });
  } else {
    fs.readdir(target, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(target, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
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
        });
      });
    }
  });
}
