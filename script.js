const paletteColor = document.getElementById('color-palette');
const colors = document.getElementsByClassName('color');
const pixelBoard = document.getElementById('pixel-board');
const pixels = document.getElementsByClassName('pixel');
const whiteColor = 'rgb(255,255,255)';
const objPixels = {};

const createButtons = (button, index) => {
  const btn = button;
  if (index !== 4) {
    btn.classList.add('color');
  } else {
    btn.id = 'button-random-color';
    btn.innerHTML = 'Cores aleatórias';
  }
};

const createPalette = () => {
  for (let index = 0; index < 5; index += 1) {
    const button = document.createElement('button');
    createButtons(button, index);
    if (index === 0) button.classList.add('selected');
    paletteColor.appendChild(button);
  }
};

const random = () => Math.round(Math.random() * 255);
const rgbColor = () => `rgb(${random()},${random()},${random()})`;

const randomColor = () => {
  const randomColors = ['rgb(0,0,0)'];
  colors[0].style.backgroundColor = 'rgb(0,0,0)';
  for (let index = 1; index < colors.length; index += 1) {
    const color = rgbColor();
    if (randomColors.includes(color) || color === whiteColor) {
      index -= 1;
    } else {
      colors[index].style.backgroundColor = color;
      randomColors.push(color);
    }
  }
  localStorage.setItem('colorPalette', JSON.stringify(randomColors));
};

const restoreColors = () => {
  const arrayColors = JSON.parse(localStorage.getItem('colorPalette'));
  if (arrayColors) {
    for (let index = 0; index < arrayColors.length; index += 1) {
      colors[index].style.backgroundColor = arrayColors[index];
    }
  } else {
    randomColor();
  }
};

const clearBoard = () => {
  for (let index = 0; index < pixels.length; index += 1) {
    pixels[index].style.backgroundColor = whiteColor;
    objPixels[index] = whiteColor;
  }
  localStorage.setItem('pixelBoard', JSON.stringify(objPixels));
};

const adjustBoardDimension = (pixelsSide) => {
  if (pixelsSide > 35) {
    pixelBoard.style.minHeight = '58rem';
    pixelBoard.style.minWidth = '58rem';
  } else if (pixelsSide > 25) {
    pixelBoard.style.minHeight = '48rem';
    pixelBoard.style.minWidth = '48rem';
  } else if (pixelsSide > 15) {
    pixelBoard.style.minHeight = '38rem';
    pixelBoard.style.minWidth = '38rem';
  } else {
    pixelBoard.style.minHeight = '28rem';
    pixelBoard.style.minWidth = '28rem';
  }
};

const adjustTemplate = (pixelsSide) => {
  if (pixelsSide < 8) {
    pixelBoard.style.gridTemplateColumns = `repeat(${pixelsSide}, 40px`;
    pixelBoard.style.gridTemplateRows = `repeat(${pixelsSide}, 40px`;
    pixelBoard.style.minHeight = '20rem';
    pixelBoard.style.minWidth = '20rem';
  } else {
    pixelBoard.style.gridTemplateColumns = `repeat(${pixelsSide}, 1fr`;
    pixelBoard.style.gridTemplateRows = `repeat(${pixelsSide}, 1fr`;
    adjustBoardDimension(pixelsSide);
  }
};

const createPixel = (index) => {
  const newPixel = document.createElement('button');
  newPixel.classList.add('pixel');
  newPixel.style.backgroundColor = whiteColor;
  pixelBoard.appendChild(newPixel);
  objPixels[index] = whiteColor;
};

const loadDesign = () => {
  const dataPixels = JSON.parse(localStorage.getItem('pixelBoard'));
  if (dataPixels) {
    for (let index = 0; index < pixels.length; index += 1) {
      pixels[index].style.backgroundColor = dataPixels[index];
      objPixels[index] = dataPixels[index];
    }
  } else {
    localStorage.setItem('pixelBoard', JSON.stringify(objPixels));
  }
};

const createBoard = (pixelsSide, resizeBoard) => {
  const totalPixels = pixelsSide ** 2;
  adjustTemplate(pixelsSide);
  for (let index = 0; index < totalPixels; index += 1) {
    createPixel(index);
  }
  localStorage.setItem('boardSize', totalPixels);
  if (resizeBoard) loadDesign();
};

const restoreBord = () => {
  const pixelsLength = localStorage.getItem('boardSize');
  if (pixelsLength) {
    createBoard(pixelsLength ** (1 / 2), true);
    const restoreStyles = JSON.parse(localStorage.getItem('pixelBoard'));
    for (let index = 0; index < restoreStyles.length; index += 1) {
      objPixels[index] = restoreStyles[index];
    }
  } else {
    createBoard(5, true);
  }
};

const resizeBoard = () => {
  let pixelsSide = document.getElementById('board-size');
  pixelsSide = parseInt(pixelsSide.value, 10);
  if (Number.isNaN(pixelsSide)) {
    alert('Board inválido!');
  } else if (pixelsSide < 5) {
    pixelsSide = 5;
  } else if (pixelsSide >= 50) {
    pixelsSide = 50;
  }
  pixelBoard.innerHTML = '';
  createBoard(pixelsSide, false);
  localStorage.setItem('boardSize', pixels.length);
};

const changeSelected = () => {
  for (let index = 0; index < colors.length; index += 1) {
    colors[index].addEventListener('click', () => {
      const colorSelected = document.querySelector('.selected');
      colorSelected.classList.remove('selected');
      colors[index].classList.add('selected');
    });
  }
};

const paint = (element) => {
  const elClick = element;
  const elementUp = element.parentElement;
  const colorSelected = document.querySelector('.selected');
  const backColor = colorSelected.style.backgroundColor;
  elClick.style.backgroundColor = backColor;
  const index = Array.prototype.indexOf.call(elementUp.children, elClick);
  objPixels[index] = backColor;
  localStorage.setItem('pixelBoard', JSON.stringify(objPixels));
};

const clickButtons = () => {
  document.addEventListener('click', (event) => {
    const element = event.target;
    if (element.id === 'generate-board') resizeBoard();
    if (element.id === 'button-random-color') randomColor();
    if (element.id === 'clear-board') clearBoard();
    if (element.classList.contains('pixel')) paint(element);
  });
};

window.onload = () => {
  createPalette();
  restoreColors();
  restoreBord();
  changeSelected();
  clickButtons();
};
