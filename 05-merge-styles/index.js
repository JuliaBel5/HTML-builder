const fs = require('fs');
const path = require('path');
const { stat } = require('fs/promises');
const source = path.join(__dirname, 'styles');
const targetFile = path.join(`${__dirname}/project-dist`, 'bundle.css');

fs.stat(targetFile, function (err) {
  if (err) {
    console.log('Файла bundle.css не существует, создаю новый');
    createBundle();
  } else {
    fs.unlink(targetFile, (err) => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log('Старый файл bundle.css успешно удален');
        createBundle();
      }
    });
  }
});

function createBundle() {
  fs.readdir(source, (err, files) => {
    if (err) {
      console.error(err);
      return;
    } else {
      console.log('В папке обнаружены следующие файлы: ' + files);

      files.forEach(async (file) => {
        const filePath = path.join(source, file);
        const ext = path.extname(filePath);

        const statData = await stat(filePath);

        if (statData.isFile() && ext === '.css') {
          const stream = fs.createReadStream(path.join(source, file), 'utf8');
          let arr = [];
          stream.on('readable', () => {
            let data = stream.read();
            if (data !== null) {
              arr.push(data);
              fs.appendFile(targetFile, arr.join(), (err) => {
                if (err) throw err;
                console.log(`Файл ${file} успешно скопирован и записан`);
              });

              stream.on('end', () => {
                return arr;
              });
            }
          });
        }
      });
    }
  });
  console.log('Файл bundle.css успешно сформирован');
}
