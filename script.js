let pegadiv = document.querySelector('#imgList');

function carregar() {
  let imagem = [
    './imgs/icons/add-friend.png',
    './imgs/icons/correct.png',
    './imgs/icons/addfriend-black.png',
    './imgs/icons/arrow-down.png',
    './imgs/icons/brain.png',
    './imgs/icons/config.png',
    './imgs/icons/delete.png',
    './imgs/icons/editar.png',
    './imgs/icons/graphic-black.png',
    './imgs/icons/graphic-white.png',
    './imgs/icons/group.png',
    './imgs/icons/lixo.png',
    './imgs/icons/pencil.png',
    './imgs/icons/search-black.png',
    './imgs/icons/search-white.png',
    './imgs/icons/users.png',
    './imgs/logos/logoequipe4.png',
    './imgs/miscellaneous/coisaboa.png',
    './imgs/miscellaneous/discordjs.png',
    './imgs/miscellaneous/fantauva.png',
    './imgs/miscellaneous/petLove.png',
    './imgs/miscellaneous/qualofluxo.png',
    './imgs/miscellaneous/refrigerantes.png',
  ];

  imagem.forEach((imagem) => {
    pegadiv.insertAdjacentHTML(
      'beforeend',
      `
    
    <img src="${imagem}" alt="fotos" /> 
    
    
    `
    );
  });
}
carregar();
//import brain from './imgs/icons/brain.png';
