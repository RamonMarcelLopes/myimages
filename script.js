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
    './imgs/logos/silemar.png',
    './imgs/logos/jacareimage.png',
    './imgs/miscellaneous/coisaboa.png',
    './imgs/miscellaneous/discordjs.png',
    './imgs/miscellaneous/fantauva.png',
    './imgs/miscellaneous/petLove.png',
    './imgs/miscellaneous/qualofluxo.png',
    './imgs/miscellaneous/refri.png',
    './imgs/miscellaneous/capi.png',
    './imgs/miscellaneous/dog.png',
    './imgs/miscellaneous/peackyblinder.png',
    './imgs/miscellaneous/tropadoskexada.png',
  ];

  imagem.forEach((imagem) => {
    pegadiv.insertAdjacentHTML(
      'beforeend',
      `
    <div id="content"> 
    <img id="fotosmisc" src="${imagem}" alt="imagem" /> 
    </div>
    
    `
    );
  });
}
carregar();
//import brain from './imgs/icons/brain.png';
