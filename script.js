let pegadiv = document.querySelector("#imgList");
let imgSalva = document.getElementById("fotosmisc");
let href = window.location.href;

async function carregar() {
  let imagem = [
    "./imgs/icons/add-friend.png",
    "./imgs/logos/castem.png",
    "./imgs/icons/correct.png",
    "./imgs/icons/addfriend-black.png",
    "./imgs/icons/arrow-down.png",
    "./imgs/icons/brain.png",
    "./imgs/icons/config.png",
    "./imgs/icons/delete.png",
    "./imgs/icons/editar.png",
    "./imgs/icons/graphic-black.png",
    "./imgs/icons/graphic-white.png",
    "./imgs/icons/group.png",
    "./imgs/icons/lixo.png",
    "./imgs/icons/pencil.png",
    "./imgs/icons/search-black.png",
    "./imgs/icons/search-white.png",
    "./imgs/icons/users.png",
    "./imgs/logos/logoequipe4.png",
    "./imgs/logos/silemar.png",
    "./imgs/logos/jacareimage.png",
    "./imgs/miscellaneous/coisaboa.png",
    "./imgs/miscellaneous/discordjs.png",
    "./imgs/miscellaneous/fantauva.png",
    "./imgs/miscellaneous/petLove.png",
    "./imgs/miscellaneous/qualofluxo.png",
    "./imgs/miscellaneous/refri.png",
    "./imgs/miscellaneous/capi.png",
    "./imgs/miscellaneous/dog.png",
    "./imgs/miscellaneous/peackyblinder.png",
    "./imgs/miscellaneous/tropadoskexada.png",
    "./imgs/miscellaneous/recibo.png",
    "./imgs/miscellaneous/cara.png",
    "./imgs/miscellaneous/coroa.png",
    "./imgs/miscellaneous/verbs.png",
    "./imgs/miscellaneous/spinner.gif",
    "./imgs/logos/whatsapp.png",
    "./imgs/logos/logogelado.svg",
    "./imgs/logos/atualizar.svg",
    "./imgs/logos/deletar.svg",
    "./imgs/logos/paleta.svg",
    "./imgs/logos/sacola.svg",
    "./imgs/logos/prisma.svg",
    "./imgs/logos/nest.png",
    "./imgs/logos/jacarestw.png",
    "https://github.com/RamonMarcelLopes/RamonMarcelLopes/raw/output/github-contribution-grid-snake-dark.svg",
    "./imgs/miscellaneous/ns.png",
    "./imgs/miscellaneous/elgeladon.png",
    "./imgs/miscellaneous/XboxSwagger.png",
    "./imgs/icons/defaultUser.jpg",
    "./imgs/miscellaneous/cda-front.png",
    "./imgs/miscellaneous/CDA_SERVER.png",
    "./imgs/logos/lps.png",
    "./imgs/miscellaneous/triang.png",
  ];

  imagem.forEach((imagem) => {
    pegadiv.insertAdjacentHTML(
      "beforeend",
      `
    <div id="content"> 
    <a id="a-img" href="${href}${imagem}" target="_blank">
    <img id="fotosmisc" src="${imagem}" alt="imagem" /> 
    </a>
    </div>
    
    `
    );
  });
}

carregar();

//import brain from './imgs/icons/brain.png';
