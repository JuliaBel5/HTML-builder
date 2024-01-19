const fs = require('fs');
const path = require('path');
const fsp = require('fs/promises');

const target = path.join(__dirname, 'project-dist');
const source = path.join(__dirname, 'styles');
const stylesFile = path.join(`${__dirname}/project-dist`, 'style.css');

async function delFolder(target) {
  const files = await fsp.readdir(target); // чтение содержимого
  for await (const file of files) {
    const filePath = path.join(target, file); //  полный путь к файлу/папке
    const item = await fsp.stat(filePath); // инфо о файле/папке

    if (item.isDirectory()) {
      await delFolder(filePath);
    } else {
      // если это файл
      await fsp.unlink(filePath);
    }
  }
}

async function createHtml() {
  try {
    await delFolder(target);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  try {
    await fsp.mkdir(path.resolve(__dirname, 'project-dist'));
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
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
  await copyFiles(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets'),
  );
  console.log('Папка assets успешно скопирована');
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

async function copyFiles(source, target) {
  await fsp.mkdir(target, { recursive: true });

  const files = await fsp.readdir(source, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      await fsp.copyFile(
        path.join(source, file['name']),
        path.join(target, file['name']),
      );
    } else {
      let newSource = path.join(source, file.name);
      let newTarget = path.join(target, file.name);
      await copyFiles(newSource, newTarget);
    }
  }
}
