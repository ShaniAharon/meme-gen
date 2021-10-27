'use strict';

var gCanvas = document.querySelector('canvas');
var gCtx = gCanvas.getContext('2d');
var gSelectedLine = 0;

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
  // gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
  var elImg = new Image();
  elImg.src = img.url;
  console.log(elImg);
  elImg.onload = () => {
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);

    //can do forEach
    for (let i = 0; i < gMeme.lines.length; i++) {
      gCtx.font = gMeme.lines[i].size + 'px impact';
      // gCtx.strokeStyle = 'white';
      gCtx.fillText(meme.lines[i].txt, gMeme.lines[i].x, gMeme.lines[i].y);
      if (meme.selectedLineIdx === i) {
        //   console.log('selected', meme.selectedLineIdx);
        var width = gCtx.measureText(meme.lines[i].txt).width;
        gCtx.beginPath();
        gCtx.rect(gMeme.lines[i].x - 10, gMeme.lines[i].y - 35, width + 20, 55);
        gCtx.stroke();
      }
    }
  };
}

function onImgClick(imgId) {
  console.log(imgId);
  setSelectedImg(imgId);
  toggleEditor(true);
  toggleGallery(false);
  renderCanvas();
}

function toggleEditor(isShow) {
  const elEditor = document.querySelector('.meme-editor');
  elEditor.style.display = isShow ? 'flex' : 'none';
}

function toggleGallery(isShow) {
  const elGallery = document.querySelector('.image-gallery');
  elGallery.style.display = isShow ? 'flex' : 'none';
}

function onBackToGallery() {
  toggleGallery(true);
  toggleEditor(false);
}

function onUpdateText(inputText) {
  updateText(inputText, gSelectedLine);
  renderCanvas();
}

function onIncreaseSize(diff) {
  updateSize(diff, gSelectedLine);
  renderCanvas();
}

function onDecreaseSize(diff) {
  updateSize(diff, gSelectedLine);
  renderCanvas();
}

function onMoveUp(diff) {
  moveTextByDiff(diff, gSelectedLine);
  renderCanvas();
}

function onMoveDown(diff) {
  moveTextByDiff(diff, gSelectedLine);
  renderCanvas();
}

function onSwitchLine() {
  gSelectedLine++;
  gSelectedLine = setSelectedLineIdx(gSelectedLine);

  // gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
  renderCanvas();
}
