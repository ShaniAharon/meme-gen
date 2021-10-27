'use strict';

var gCanvas = document.querySelector('canvas');
var gCtx = gCanvas.getContext('2d');
var gSelectedLine = 0;
var gCurrMeme;

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

function renderMemes() {
  var memes = getMemes();
  if (!memes.length) return;
  var strHtmls = memes.map((meme) => {
    return `
    <div>
    <img class="gallery-img" src="${meme.dataUrl}" onclick="onMemeClick('${meme.id}')" />
    </div>
    `;
  });
  var elMemes = document.querySelector('.memes');
  elMemes.innerHTML = strHtmls.join('');
}

function renderCanvas() {
  // var meme = getMeme();
  var img = getImgById(gCurrMeme.selectedImgId);
  console.log(img);
  // gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
  var elImg = new Image();
  elImg.src = img.url;
  console.log(elImg);
  elImg.onload = () => {
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);

    //can do forEach
    for (let i = 0; i < gCurrMeme.lines.length; i++) {
      gCtx.font = gCurrMeme.lines[i].size + 'px impact';
      // gCtx.strokeStyle = 'white';
      gCtx.fillText(
        gCurrMeme.lines[i].txt,
        gCurrMeme.lines[i].x,
        gCurrMeme.lines[i].y
      );
      if (gCurrMeme.selectedLineIdx === i) {
        //   console.log('selected', meme.selectedLineIdx);
        var width = gCtx.measureText(gCurrMeme.lines[i].txt).width;
        gCtx.beginPath();
        gCtx.rect(
          gCurrMeme.lines[i].x - 10,
          gCurrMeme.lines[i].y - 35,
          width + 20,
          55
        );
        gCtx.stroke();
      }
    }
  };
}

function onImgClick(imgId) {
  console.log(imgId);
  gCurrMeme = createMeme(imgId);
  // setSelectedImg(imgId);
  toggleEditor(true);
  toggleGallery(false);
  toggleMemes(false);
  renderCanvas();
}

function onMemeClick(memeId) {
  let selectedMeme = getMemeById(memeId);
  gCurrMeme = selectedMeme;
  toggleEditor(true);
  toggleGallery(false);
  toggleMemes(false);
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

function toggleMemes(isShow) {
  const elMemes = document.querySelector('.saved-memes');
  elMemes.style.display = isShow ? 'flex' : 'none';
}

function onBackToGallery() {
  toggleGallery(true);
  toggleEditor(false);
  toggleMemes(false);
}

function onBackToMemes() {
  renderMemes();
  toggleGallery(false);
  toggleEditor(false);
  toggleMemes(true);
}

function onUpdateText(inputText) {
  updateText(inputText, gSelectedLine, gCurrMeme.id);
  renderCanvas();
}

function onIncreaseSize(diff) {
  updateSize(diff, gSelectedLine, gCurrMeme.id);
  renderCanvas();
}

function onDecreaseSize(diff) {
  updateSize(diff, gSelectedLine, gCurrMeme.id);
  renderCanvas();
}

function onMoveUp(diff) {
  moveTextByDiff(diff, gSelectedLine, gCurrMeme.id);
  renderCanvas();
}

function onMoveDown(diff) {
  moveTextByDiff(diff, gSelectedLine, gCurrMeme.id);
  renderCanvas();
}

function onSwitchLine() {
  gSelectedLine++;
  gSelectedLine = setSelectedLineIdx(gSelectedLine, gCurrMeme.id);

  // gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
  renderCanvas();
}

function onSave() {
  var dataUrl = gCanvas.toDataURL();
  updateDataUrl(dataUrl, gCurrMeme.id);
  saveMeme();
}
