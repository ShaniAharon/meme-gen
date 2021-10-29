'use strict';

var gCanvas = document.querySelector('canvas');
var gCtx = gCanvas.getContext('2d');
var gSelectedLine = 0;
var gCurrMeme;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];
var gStartPos;
var isDrag = false;
var toggle = false;
var gStickerPage = 1;
var isClickedOff = false;

const elInput = document.querySelector('.insert-text');

function onInit() {
  renderGallery();
  addMouseListeners();
  addTouchListeners();
}

function renderGallery(searchWord = '') {
  let imgs;
  if (!searchWord) imgs = getImgs();
  else imgs = getSortBySearchImgs(searchWord);
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

//render stickers
function renderStickers(idx) {
  var stickers = getStickers(idx);
  if (!stickers.length) {
    gStickerPage = 1;
    stickers = getStickers(1);
  }
  var strHtmls = stickers.map((stick) => {
    return `
    <li onclick="onSticker('${stick}')">${stick}</li>
    `;
  });
  var elStick = document.querySelector('.stickers');
  elStick.innerHTML = strHtmls.join('');
}

function renderCanvas() {
  var img = getImgById(gCurrMeme.selectedImgId);
  var elImg = new Image();
  elImg.src = img.url;
  elImg.onload = () => {
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);

    for (let i = 0; i < gCurrMeme.lines.length; i++) {
      gCtx.font = gCurrMeme.lines[i].size + 'px impact';
      gCtx.strokeStyle = gCurrMeme.lines[i].stroke;
      gCtx.fillStyle = gCurrMeme.lines[i].color;
      gCtx.fillText(
        gCurrMeme.lines[i].txt,
        gCurrMeme.lines[i].x,
        gCurrMeme.lines[i].y
      );
      gCtx.strokeText(
        gCurrMeme.lines[i].txt,
        gCurrMeme.lines[i].x,
        gCurrMeme.lines[i].y
      );

      var width = gCtx.measureText(gCurrMeme.lines[i].txt).width;
      var height = gCtx.measureText(
        gCurrMeme.lines[i].txt
      ).fontBoundingBoxAscent;
      gCurrMeme.lines[i].lineHeight = height;
      gCurrMeme.lines[i].lineWidth = width;

      if (gCurrMeme.selectedLineIdx === i && !isClickedOff) {
        gCtx.beginPath();
        gCtx.rect(
          gCurrMeme.lines[i].x - 10,
          gCurrMeme.lines[i].y - height,
          width + 20,
          height + 5
        );
        gCtx.stroke();
      }
    }
    isClickedOff = false;
  };
}

//fix when enter a img or meme put the selected line as the line with the box on
function onImgClick(imgId) {
  gCurrMeme = createMeme(imgId);
  toggleEditor(true);
  toggleGallery(false);
  toggleMemes(false);
  toggleAbout(false);
  toggleSearch(false);
  renderStickers(1);
  renderCanvas();
  elInput.value = gCurrMeme.lines[gCurrMeme.selectedLineIdx].txt;
}

function onMemeClick(memeId) {
  let selectedMeme = getMemeById(memeId);
  gCurrMeme = selectedMeme;
  toggleEditor(true);
  toggleGallery(false);
  toggleMemes(false);
  toggleAbout(false);
  toggleSearch(false);
  renderCanvas();
  elInput.value = gCurrMeme.lines[gCurrMeme.selectedLineIdx].txt;
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

function toggleAbout(isShow) {
  const elAbout = document.querySelector('.about');
  elAbout.style.display = isShow ? 'flex' : 'none';
}

function toggleSearch(isShow) {
  const elSearch = document.querySelector('.search-sec');
  elSearch.style.display = isShow ? 'flex' : 'none';
}

function onOpenNav() {
  const nav = document.querySelector('.nav');
  nav.classList.toggle('show-nav');
  const btnBurger = document.querySelector('.btn-burger');
  btnBurger.innerText = btnBurger.innerText === 'X' ? '☰' : 'X';
}

function onCloseNav() {
  const nav = document.querySelector('.nav');
  nav.classList.remove('show-nav');
  const btnBurger = document.querySelector('.btn-burger');
  btnBurger.innerText = '☰';
}

function onBackToGallery() {
  toggleGallery(true);
  toggleEditor(false);
  toggleMemes(false);
  toggleAbout(true);
  toggleSearch(true);
}

function onBackToMemes() {
  renderMemes();
  toggleGallery(false);
  toggleEditor(false);
  toggleMemes(true);
  toggleAbout(false);
  toggleSearch(false);
}

function onUpdateText(inputText) {
  //fixed a bug when gselected is not the marked line
  //used the obj selectedLineIdx insted , fixed
  updateText(inputText, gCurrMeme.id);
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
  elInput.value = gCurrMeme.lines[gCurrMeme.selectedLineIdx].txt;

  renderCanvas();
}

function onAddLine() {
  addLine(gCurrMeme.id);
  renderCanvas();
  elInput.value = gCurrMeme.lines[gCurrMeme.selectedLineIdx].txt;
}

function onRemoveLine() {
  //when remove a line need to change selected line , cause an error
  //and return in isLineClicked if there are no lines, error
  removeLine(gCurrMeme.id);
  renderCanvas();
}

function onAlignLeft() {
  alignLeft(gCurrMeme.id);
  renderCanvas();
}

function onAlignRight() {
  alignRight(gCurrMeme.id);
  renderCanvas();
}

function onAlignCenter() {
  alignCenter(gCurrMeme.id);
  renderCanvas();
}

function onPickColor(color) {
  setLineColor(gCurrMeme.id, color);
  renderCanvas();
}

function onPickStrokeColor(color) {
  setLineStrokeColor(gCurrMeme.id, color);
  renderCanvas();
}

//fix later
function onFont(font) {
  setFont(font, gCurrMeme.id);
  renderCanvas();
}

function onSave() {
  isClickedOff = true;
  renderCanvas();
  //remove all black boxes before the save
  setTimeout(function () {
    var dataUrl = gCanvas.toDataURL();
    updateDataUrl(dataUrl, gCurrMeme.id);
    saveMeme();
    onBackToMemes();
  }, 500);
}

//drag logic
function addMouseListeners() {
  gCanvas.addEventListener('mousemove', onMove);
  gCanvas.addEventListener('mousedown', onDown);
  gCanvas.addEventListener('mouseup', onUp);
  gCanvas.addEventListener('click', onClick);
}

function addTouchListeners() {
  gCanvas.addEventListener('touchmove', onMove);
  gCanvas.addEventListener('touchstart', onDown);
  gCanvas.addEventListener('touchend', onClick);
  gCanvas.addEventListener('touchend', onUp);
}

function onClick(ev) {
  const pos = getEvPos(ev);
  const lineIdx = whichLineClicked(pos, gCurrMeme.id);
  if (lineIdx < 0) {
    // //flag to remove the black selected box when clicked aside on the canvas
    // //user can do it before the save soo it will save clean with no box
    // isClickedOff = true;
    // renderCanvas();
    return;
  }
  gSelectedLine = setSelectedLineIdx(lineIdx, gCurrMeme.id);
  elInput.value = gCurrMeme.lines[gCurrMeme.selectedLineIdx].txt;
  renderCanvas();
}

function onDown(ev) {
  const pos = getEvPos(ev);
  if (!isLineClicked(pos, gCurrMeme.id)) return;
  isDrag = true;
  gStartPos = pos;
  document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
  if (isDrag) {
    const pos = getEvPos(ev);
    const dx = pos.x - gStartPos.x;
    const dy = pos.y - gStartPos.y;
    gStartPos = pos;
    moveLine(dx, dy, gCurrMeme.id);
    renderCanvas();
  }
}

function onUp() {
  isDrag = false;
  document.body.style.cursor = 'auto';
}

function getEvPos(ev) {
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  };
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault();
    ev = ev.changedTouches[0];
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    };
  }
  return pos;
}

function downloadCanvas(elLink) {
  const data = gCanvas.toDataURL();
  elLink.href = data;
  elLink.download = 'my-img.jpg';
}

//search logic
function renderSearch(inputText) {
  renderGallery(inputText);
}

function onWordClicked(elWord) {
  const wordText = elWord.innerText.toLowerCase();
  let keyWordsMap = getKeyWordsMap();
  renderGallery(wordText);
  var strFontSize = elWord.style.fontSize;
  var size = +strFontSize.substring(0, strFontSize.indexOf('p'));
  elWord.style.fontSize = size + keyWordsMap[wordText] + 'px';
}

//stickers logic
function onSticker(sticker) {
  addSticker(sticker, gCurrMeme.id);
  renderCanvas();
}

function onNextStickerPage(diff) {
  if (gStickerPage === 1 && diff === -1) return;
  gStickerPage += diff;
  if (gStickerPage >= getStickersLength() - 1) {
    gStickerPage = 1;
  }
  renderStickers(gStickerPage);
}

//share with web api
async function onShareCanvas() {
  const dataUrl = gCanvas.toDataURL();
  const blob = await (await fetch(dataUrl)).blob();
  const filesArray = [
    new File([blob], 'myMeme.png', {
      type: blob.type,
      lastModified: new Date().getTime(),
    }),
  ];
  const shareData = {
    files: filesArray,
  };
  navigator.share(shareData);
}
