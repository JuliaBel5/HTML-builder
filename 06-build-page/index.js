const fs = require('fs');
const path = require('path');
const fsp = require('fs/promises');

const target = path.join(__dirname, 'project-dist');
const source = path.join(__dirname, 'styles');
const stylesFile = path.join(`${__dirname}/project-dist`, 'style.css');

async function createBundle() {
  try {
    const files = await fsp.readdir(source);
    console.log('В папке обнаружены следующие файлы: ' + files);

    const writableStream = fs.createWriteStream(path.join(stylesFile), {
      flags: 'a',
    });

    writableStream.on('finish', () => {
      console.log('Файл style.css успешно сформирован');
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

async function createHtml() {
  try {
    await fsp.rm(target, {
      recursive: true,
      force: true,
      maxRetries: 1000,
    });

    await fsp.mkdir(path.resolve(__dirname, 'project-dist'));
  } catch (error) {
    console.log(error);
  }

  createBundle();

  let template = await fsp.readFile(
    path.resolve(__dirname, 'template.html'),
    'utf8',
  );

  const htmlItems = await fsp.readdir(path.resolve(__dirname, 'components'));

  for (const htmlItem of htmlItems) {
    if (path.extname(htmlItem) === '.html') {
      console.log(htmlItem);
      const fileName = htmlItem.split('.')[0];
      const htmlContent = await fsp.readFile(
        path.resolve(path.resolve(__dirname, 'components'), htmlItem),
        'utf8',
      );
      template = template.replace(`{{${fileName}}}`, htmlContent);
    }
  }

  await fsp.writeFile(
    path.resolve(path.resolve(__dirname, 'project-dist'), 'index.html'),
    template,
  );
  console.log('Файл index.html успешно создан');

  fs.cp(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets'),
    { recursive: true },
    (err) => {
      if (err) return;

      console.log('Папка assets успешно скопирована');
    },
  );
}

createHtml();
