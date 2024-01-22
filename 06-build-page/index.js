const fs = require('fs');
const path = require('path');
const fsp = require('fs/promises');

const target = path.join(__dirname, 'project-dist');
const source = path.join(__dirname, 'styles');
const stylesFile = path.join(`${__dirname}/project-dist`, 'style.css');

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

function createBundle() {
  fs.readdir(source, (err, files) => {
    if (err) {
      console.error(err);
      return;
    } else {
      // console.log('В папке обнаружены следующие файлы: ' + files);
      files.forEach(async (file) => {
        const filePath = path.join(source, file);
        const ext = path.extname(filePath);
        const statData = await fsp.stat(filePath);
        if (statData.isFile() && ext === '.css') {
          const stream = fs.createReadStream(path.join(source, file), 'utf8');
          let arr = [];
          stream.on('readable', () => {
            let data = stream.read();
            if (data !== null) {
              arr.push(data);
              fs.appendFile(stylesFile, arr.join(), (err) => {
                if (err) throw err;
                //console.log(`Файл ${file} успешно скопирован и записан`);
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
  console.log('Файл style.css успешно сформирован');
}
