'use strict';

var gCanvas = document.querySelector('canvas');
var gCtx = gCanvas.getContext('2d');
var gSelectedLine = 0;
var gCurrMeme;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];
var gStartPos;
var isDrag = false;
var toggle = false;

const elInput = document.querySelector('.insert-text');

function onInit() {
  renderGallery();
  addMouseListeners();
  addTouchListeners();
  // renderCanvas();
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
  // gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
  var elImg = new Image();
  elImg.src = img.url;
  elImg.onload = () => {
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);

    //can do forEach
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
      // if (gCurrMeme.selectedLineIdx === i) {
      //   console.log('selected', meme.selectedLineIdx);
      var width = gCtx.measureText(gCurrMeme.lines[i].txt).width;
      var height = gCtx.measureText(
        gCurrMeme.lines[i].txt
      ).fontBoundingBoxAscent;
      gCurrMeme.lines[i].lineHeight = height;
      gCurrMeme.lines[i].lineWidth = width;

      if (gCurrMeme.selectedLineIdx === i) {
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
  };
}

function onImgClick(imgId) {
  gCurrMeme = createMeme(imgId);
  // setSelectedImg(imgId);
  toggleEditor(true);
  toggleGallery(false);
  toggleMemes(false);
  toggleAbout(false);
  renderCanvas();
}

function onMemeClick(memeId) {
  let selectedMeme = getMemeById(memeId);
  gCurrMeme = selectedMeme;
  toggleEditor(true);
  toggleGallery(false);
  toggleMemes(false);
  toggleAbout(false);
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

function toggleAbout(isShow) {
  const elAbout = document.querySelector('.about');
  elAbout.style.display = isShow ? 'flex' : 'none';
}

function onOpenNav() {
  const nav = document.querySelector('.nav');
  toggle = !toggle;
  nav.classList.toggle('show-nav');
  const btnBurger = document.querySelector('.btn-burger');
  btnBurger.innerText = toggle ? 'X' : '☰';
}

function onBackToGallery() {
  toggleGallery(true);
  toggleEditor(false);
  toggleMemes(false);
  toggleAbout(true);
}

function onBackToMemes() {
  renderMemes();
  toggleGallery(false);
  toggleEditor(false);
  toggleMemes(true);
  toggleAbout(false);
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
  elInput.value = gCurrMeme.lines[gCurrMeme.selectedLineIdx].txt;

  // gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
  renderCanvas();
}

//new
// TODO: add in the top then bootom then middle
function onAddLine() {
  addLine(gCurrMeme.id);
  renderCanvas();
}

function onRemoveLine() {
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
  var dataUrl = gCanvas.toDataURL();
  updateDataUrl(dataUrl, gCurrMeme.id);
  saveMeme();
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
  gCanvas.addEventListener('touchend', onUp);
}

function onClick(ev) {
  const pos = getEvPos(ev);
  const lineIdx = whichLineClicked(pos, gCurrMeme.id);
  console.log(lineIdx);
  if (lineIdx < 0) return;
  gSelectedLine = setSelectedLineIdx(lineIdx, gCurrMeme.id);
  elInput.value = gCurrMeme.lines[gCurrMeme.selectedLineIdx].txt;
  renderCanvas();
}

function onDown(ev) {
  const pos = getEvPos(ev);
  console.log(pos);
  console.log(gCurrMeme.lines[0].x, gCurrMeme.lines[0].y);
  if (!isLineClicked(pos, gCurrMeme.id)) return;
  console.log('hit');
  // setCircleDrag(true);
  isDrag = true;
  gStartPos = pos;
  document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
  // const circle = getCircle();
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
  document.body.style.cursor = 'grab';
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
