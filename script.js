// const fs = require('fs');

let pegadiv = document.querySelector('#imgList');

// let teste = () => {
//   const dir = './imgs/icons';
//   const names = [];

//   fs.readdir(dir, (err, arquivos) => {
//     arquivos.forEach((arquivo) => {
//       names.push(arquivo);
//       console.log(names, '✔');
//     });
//   });
// };

let carregar = () => {
  let imagem = ['https://google.com/google.jpg', './imgs/icons/correct.png'];

  imagem.forEach((imagem) => {
    pegadiv.insertAdjacentHTML(
      'beforeend',
      `
    
    <img src="${imagem}" alt="fotos" /> 
    
    
    `
    );
  });
};
// carregar();
