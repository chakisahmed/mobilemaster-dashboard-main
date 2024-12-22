const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../.next/export');

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }

  fs.rmdir(directory, err => {
    if (err) throw err;
    console.log(`${directory} is deleted!`);
  });
});
