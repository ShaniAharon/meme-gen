'use strict';

var gCanvas = document.querySelector('canvas');
var gCtx = gCanvas.getContext('2d');

function onInit() {
  renderGallery();
  renderCanvas();
}

function renderGallery() {
  const imgs = getImgs();
  var strHtmls = imgs.map((img) => {
    return `
        <div>
        <img class="gallery-img" src="${img.url}" onclick="onImgClick('${img.id}')">
        </div>
        `;
  });
  const elGallery = document.querySelector('.image-gallery');
  elGallery.innerHTML = strHtmls.join('');
}

function renderCanvas() {
  var meme = getMeme();
  var img = getImgById(meme.selectedImgId);
  console.log(img);
  var elImg = new Image();
  elImg.src = img.url;
  console.log(elImg);
  elImg.onload = () => {
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
    gCtx.font = '20px impact';
    // gCtx.strokeStyle = 'white';
    gCtx.fillText(meme.lines[0].txt, 50, 50);
  };
}

function onImgClick(imgId) {
  console.log(imgId);
  setSelectedImg(imgId);
  renderCanvas();
}

function onUpdateText(inputText) {
  updateText(inputText);
  renderCanvas();
}
