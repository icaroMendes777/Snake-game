/*

visão geral:

-temos uma grid onde cada elemento possui no ID coordenadas x,y

-a velocidade é determinada na variável speed*
que é global e mede em milisegundos o intervalo entre um render e outro.

-as coordenadas que a cobra ocupa são armazenadas em um array na variável snake* - Global

-as variáveis px e py determinam a posição do ponto preto.

-se a cobra toca em si mesma o jogo acaba.


OBS: algumas funcionalidades ainda estão para ser implementadas
mas o básico já funciona.

-----------------------------------------------------------------
*/

//VARIÁVEIS GLOBAIS

var px = 5; ///posicao corrente do ponto preto
var py = 5;

var rowsT = 25; ///linhas e colunas do grid a serem implementadas dinamicamente no futuro
var colT = 25;

var snake = []; ///colocar array de casas ocupadas pela cobra

var direction = "up";
var preDirection = "up";

var prey = [0, 6]; //posição inicial do ponto preto para capturar
var speed = 280; //quantos milisegundos entre cada render
var fail = false; //marca se o jogo chegou ao fim
var score = 0;

/*
===============
Função principal

carregado o documento, inicia o jogo,
o re-render é chamado aqui

===============
*/
document.addEventListener(
  "DOMContentLoaded",
  function () {
    makeGrid(rowsT, colT);

    ////posição inicial da cobra
    snake = [
      [4, 6],
      [4, 7],
      [4, 8],
      [4, 9],
      [4, 10],
      [4, 11],
    ];

    ///recebe o input do teclado
    document.addEventListener("keydown", function (key) {
      changeDirection(key);
    });

    ///render o jogo
    renderSnake();
    renderDot();

    setInterval(refresh, speed);
  },
  false
);

///funcionalidade de mudar a velocidade +++++++++ ainda não implementada
function updateSpeed() {
  return;
}

///recebe quando uma tecla é pressionada
/// e se corresponder a um comando ou atualizaçao na direção seta a variável

function changeDirection(key) {
  //a direção antiga é guardada nessa variável
  //se o movimento não der certo o valor antigo é chamado
  preDirection = direction;
  switch (key.keyCode) {
    case 38:
      direction = "up";
      break;
    case 37:
      direction = "left";
      break;
    case 39:
      direction = "right";
      break;
    case 40:
      direction = "down";
      break;
  }
}

///faz o refresh da página
function refresh() {
  ///caso a flag de derrota esteja ativada, termina o jogo
  if (fail) {
    renderRedSnake();
    alert("YOU LOOOOOOOOST!!!! \n\n GAME OVER.");

    ///reinicia a cobra para a posição inicial
    snake = [
      [4, 6],
      [4, 7],
      [4, 8],
      [4, 9],
      [4, 10],
      [5, 10],
    ];

    ///cria um novo ponto preto inicial
    createRandomDot();
    ///reinicia o score
    score = 0;
    fail = false;
  }

  ///está tudo ok ou o jogo foi reiniciado
  ///continua normal
  updateSpeed();
  move();
  blank();
  renderDot();
  renderSnake();
  updateScore();
}

////renderiza a imagem da cobra (preto)
function renderSnake() {
  snake.forEach(function (el) {
    setBk(el[0], el[1]);
  });
}

///renderiza a cobra em vermelho
function renderRedSnake() {
  snake.forEach(function (el) {
    setRed(el[0], el[1]);
  });
}

///volta todos os pontos da grid para cinza
function blank() {
  let listDiv = document.querySelectorAll("#grid-container div");

  listDiv.forEach((el) => {
    el.style.backgroundColor = "lightgrey";
  });
}

///cria um ponto preto em um lugar aleatório na grid
/// que não está sendo ocupado pela cobra
function createRandomDot() {
  ///pos* é a posição do ponto preto
  let pos = [];
  pos[0] = Math.trunc(Math.random() * colT);
  pos[1] = Math.trunc(Math.random() * rowsT);

  if (prey == pos) {
    createRandomDot();
    return;
  }
  if (isInSnake(pos)) {
    ///caso o ponto gerado já esteja ocupado pela cobra, chama recursivo
    createRandomDot();
    return;
  } else {
    prey = pos;
    //debug(prey);
    setBk(prey[0], prey[1]);
  }
}

function renderDot() {
  setBk(prey[0], prey[1]);
}

function updateScore() {
  document.querySelector("#scoreN").innerHTML = score;
}

function move() {
  let newDot = [];
  let newY = 0;
  let newX = 0;
  switch (direction) {
    case "up":
      newY = snake[0][1] == 0 ? rowsT - 1 : snake[0][1] - 1;
      newDot = [snake[0][0], newY];
      break;

    case "down":
      newY = snake[0][1] == rowsT - 1 ? 0 : snake[0][1] + 1;
      newDot = [snake[0][0], newY];
      break;

    case "right":
      newX = snake[0][0] == colT - 1 ? 0 : snake[0][0] + 1;
      newDot = [newX, snake[0][1]];
      break;

    case "left":
      newX = snake[0][0] == 0 ? colT - 1 : snake[0][0] - 1;
      newDot = [newX, snake[0][1]];
      break;
  }

  if (isInSnake(newDot)) {
    if (!comparePosition(newDot, snake[1]))
      fail = true; ///a cobra tocou em si mesma
    else direction = preDirection; ///a cobra deu ré, mantém a direção antiga

    return;
  }

  snake.unshift(newDot);

  ///caso que o novo ponto
  ///está justo na frente da cobra
  if (comparePosition(newDot, prey)) {
    score++;
    createRandomDot();
    return;
  }

  snake.pop();
}

function fail() {
  fail = true;
}

// compara se duas posições são iguais ou não
function comparePosition(p1, p2) {
  if (p1[0] == p2[0] && p1[1] == p2[1]) return true;
  return false;
}

//muda uma coordenada para a cor preta
function setBk(c, r) {
  var id = "#item-" + c + "-" + r;

  document.querySelector(id).style.backgroundColor = "black";
}

//muda uma coordenada para a cor cinza
function unsetBk(c, r) {
  var id = "#item-" + c + "-" + r;

  document.querySelector(id).style.backgroundColor = "lightgrey";
}

//muda uma coordenada para a cor vermelha
function setRed(c, r) {
  var id = "#item-" + c + "-" + r;
  document.querySelector(id).style.backgroundColor = "red";
}

/*
 * gera a grid
 */
function makeGrid(col, row) {
  let div = document.createElement("div");

  div.className = "grid-item";

  let newDiv = null;

  console.log(div);
  for (r = 0; r < row; r++)
    for (c = 0; c < col; c++) {
      newDiv = div.cloneNode(true);
      newDiv.setAttribute("id", "item-" + c + "-" + r);
      document.querySelector("#grid-container").append(newDiv);
    }
  //
}

function isInSnake(position) {
  let exists = false;

  snake.forEach(function (el) {
    if (comparePosition(el, position)) exists = true;
  });

  return exists;
}

/*
Funções para debugar
*/

function debug(val, pre = null) {
  if (pre == null) console.log(" - " + val);
  else console.log(pre + " - " + val);
}

function debugArray(array) {
  console.log("  array -" + array.length + " elements:");
  array.forEach(function (el, ind) {
    console.log("    " + ind + " -> " + el);
  });
}
