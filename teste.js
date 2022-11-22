const fs = require('fs');
let teste = () => {
  const dir = './imgs/icons';
  const names = [];

  fs.readdir(dir, (err, arquivos) => {
    arquivos.forEach((arquivo) => {
      names.push(arquivo);
      console.log(names, '✔');
    });
  });
};

teste();
