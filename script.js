let pegadiv = document.querySelector("#imgList");
let href = window.location.href;

async function carregar() {
  // Busca os caminhos das imagens automaticamente via API
  const response = await fetch("/api/images");
  const { images } = await response.json();

  // URLs externas que você quer incluir além das da pasta imgs/
  const extras = [
    "https://github.com/RamonMarcelLopes/RamonMarcelLopes/raw/output/github-contribution-grid-snake-dark.svg",
  ];

  const todasImagens = [...images, ...extras];

  todasImagens.forEach((imagem) => {
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