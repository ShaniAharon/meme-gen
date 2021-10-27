'use strict';

var gImgs = [
  {id: 1, url: 'img/1.jpg', keywords: ['happy']},
  {id: 2, url: 'img/2.jpg', keywords: ['happy']},
];

var gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
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

function getImgs() {
  return gImgs;
}

function getImgById(imgId) {
  console.log(imgId);
  return gImgs.find((img) => img.id === imgId);
}

function getMeme() {
  return gMeme;
}

function updateText(inputText, lineIdx) {
  gMeme.lines[lineIdx].txt = inputText;
}

function updateSize(diff, lineIdx) {
  gMeme.lines[lineIdx].size += diff * 10;
}

function moveTextByDiff(diff, lineIdx) {
  gMeme.lines[lineIdx].y += diff * 10;
}

function setSelectedImg(imgId) {
  gMeme.selectedImgId = +imgId;
}

function setSelectedLineIdx(idx) {
  if (idx >= gMeme.lines.length) idx = 0;
  gMeme.selectedLineIdx = idx;
  return gMeme.selectedLineIdx;
}
