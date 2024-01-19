//const fs = require('fs');
const { readdir, stat } = require('fs/promises');
const path = require('path');

const filesNames = async () => {
  const folderPath = path.join(__dirname, 'secret-folder');
  try {
    const files = await readdir(folderPath);

    files.forEach(async (file) => {
      const filePath = path.join(folderPath, file);

      const statData = await stat(filePath);

      if (statData.isFile()) {
        const ext = path.extname(filePath);
        console.log(
          path.basename(filePath, ext) +
            ' - ' +
            ext.slice(1, ext.length) +
            ' - ' +
            statData.size / 1000 +
            'Kb',
        );
      }
    });
  } catch (err) {
    if (err) {
      console.error(err.message);
    }
  }
};
filesNames();
