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

function updateText(inputText) {
  gMeme.lines[0].txt = inputText;
}

function setSelectedImg(imgId) {
  gMeme.selectedImgId = +imgId;
}
