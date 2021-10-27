'use strict';

const MEMES_KEY = 'memes';
var gImgs = [
  {id: 1, url: 'img/1.jpg', keywords: ['happy']},
  {id: 2, url: 'img/2.jpg', keywords: ['happy']},
];

var gMemes = loadFromStorage(MEMES_KEY) || [];

// var gCurrMeme = {
//   selectedImgId: 1,
//   selectedLineIdx: 0,
//   lines: [
//     {
//       txt: 'I never eat Falafel',
//       size: 20,
//       align: 'left',
//       color: 'red',
//       x: 50,
//       y: 50,
//     },
//     {
//       txt: 'I never eat Falafel2',
//       size: 20,
//       align: 'left',
//       color: 'red',
//       x: 50,
//       y: 250,
//     },
//   ],
// };

function getImgs() {
  return gImgs;
}

function getMemes() {
  return gMemes;
}

function getImgById(imgId) {
  console.log(imgId);
  return gImgs.find((img) => img.id === imgId);
}

function createMeme(imgId) {
  let meme = {
    selectedImgId: +imgId,
    selectedLineIdx: 0,
    id: makeId(),
    dataUrl: '',
    lines: [
      {
        txt: 'I never eat Falafel',
        size: 20,
        align: 'left',
        font: 'impact',
        stroke: 'black',
        color: 'white',
        x: 50,
        y: 50,
      },
      {
        txt: 'I never eat Falafel2',
        size: 20,
        align: 'left',
        font: 'impact',
        stroke: 'black',
        color: 'white',
        x: 50,
        y: 250,
      },
    ],
  };
  gMemes.push(meme);
  return meme;
}

//new
function createNewLine() {
  let line = {
    txt: 'I never eat Falafel',
    size: 20,
    align: 'left',
    font: 'impact',
    stroke: 'black',
    color: 'white',
    x: 50,
    y: 50,
  };
  return line;
}

// function getMeme() {
//   return gCurrMeme;
// }

function getMemeById(memeId) {
  return gMemes.find((meme) => meme.id === memeId);
}

function updateText(inputText, lineIdx, memeId) {
  let meme = getMemeById(memeId);
  meme.lines[lineIdx].txt = inputText;
}

function updateSize(diff, lineIdx, memeId) {
  let meme = getMemeById(memeId);
  meme.lines[lineIdx].size += diff * 10;
}

function moveTextByDiff(diff, lineIdx, memeId) {
  let meme = getMemeById(memeId);
  meme.lines[lineIdx].y += diff * 10;
}

//new
function addLine(memeId) {
  let meme = getMemeById(memeId);
  meme.lines.push(createNewLine());
}

function removeLine(memeId) {
  let meme = getMemeById(memeId);
  if (!meme.lines.length) return;
  meme.lines.splice(meme.selectedLineIdx, 1);
}

function alignLeft(memeId) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].x = 15;
}

function alignRight(memeId) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].x =
    285 - meme.lines[meme.selectedLineIdx].lineWidth;
}

function alignCenter(memeId) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].x =
    150 - meme.lines[meme.selectedLineIdx].lineWidth / 2;
}

function setLineColor(memeId, color) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].color = color;
}

function setLineStrokeColor(memeId, color) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].stroke = color;
}

function setFont(font, memeId) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].font = font;
}

function setSelectedImg(imgId, memeId) {
  let meme = getMemeById(memeId);
  meme.selectedImgId = +imgId;
}

function setSelectedLineIdx(idx, memeId) {
  let meme = getMemeById(memeId);
  if (idx >= meme.lines.length) idx = 0;
  meme.selectedLineIdx = idx;
  return meme.selectedLineIdx;
}

function saveMeme() {
  _saveMemesToStorage();
}

function updateDataUrl(dataUrl, memeId) {
  let meme = getMemeById(memeId);
  meme.dataUrl = dataUrl;
}

function _saveMemesToStorage() {
  saveToStorage(MEMES_KEY, gMemes);
}

//drag logic

function isLineClicked(pos, memeId) {
  let meme = getMemeById(memeId);
  var lineX = meme.lines[meme.selectedLineIdx].x;
  var lineY = meme.lines[meme.selectedLineIdx].y;
  var lineWidth = meme.lines[meme.selectedLineIdx].lineWidth;
  var lineHeight = meme.lines[meme.selectedLineIdx].lineHeight;
  console.log(lineX + lineWidth);
  console.log(lineY - lineHeight);
  return (
    lineX <= pos.x &&
    lineX + lineWidth >= pos.x &&
    lineY >= pos.y &&
    lineY - lineHeight <= pos.y
  );
  //fontBoundingBoxAscent clac height
}

function moveLine(dx, dy, memeId) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].x += dx;
  meme.lines[meme.selectedLineIdx].y += dy;
}

//new
function whichLineClicked(pos, memeId) {
  let meme = getMemeById(memeId);
  var lineIdx = -1;
  meme.lines.some((line, idx) => {
    var lineX = line.x;
    var lineY = line.y;
    var lineWidth = line.lineWidth;
    var lineHeight = line.lineHeight;
    console.log(lineY);
    if (
      lineX <= pos.x &&
      lineX + lineWidth >= pos.x &&
      lineY >= pos.y &&
      lineY - lineHeight <= pos.y
    ) {
      lineIdx = idx;
      console.log('yes');
      return;
    }
  });

  return lineIdx;
  //fontBoundingBoxAscent clac height
}
