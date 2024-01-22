const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const source = path.join(__dirname, 'styles');
const targetFile = path.join(`${__dirname}/project-dist`, 'bundle.css');

async function createBundle() {
  try {
    await fsp.rm(targetFile, { force: true });
    const files = await fsp.readdir(source);

    console.log('В папке обнаружены следующие файлы: ' + files);

    const writableStream = fs.createWriteStream(path.join(targetFile), {
      flags: 'a',
    });

    writableStream.on('finish', () => {
      console.log('Файл bundle.css успешно сформирован');
    });

    for (const file of files) {
      const isCss = path.extname(file) === '.css';

      if (!isCss) return;

      const readableStream = fs.createReadStream(
        path.join(source, file),
        'utf8',
      );

      readableStream.pipe(writableStream);

      readableStream.on('end', () => {
        console.log(`Файл ${file} успешно скопирован и записан`);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

createBundle();
