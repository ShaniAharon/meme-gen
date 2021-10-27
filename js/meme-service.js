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
        color: 'red',
        x: 50,
        y: 50,
      },
      {
        txt: 'I never eat Falafel2',
        size: 20,
        align: 'left',
        color: 'red',
        x: 50,
        y: 250,
      },
    ],
  };
  gMemes.push(meme);
  return meme;
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
