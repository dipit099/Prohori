const {storageService} = require('../config/storage');
const fs = require('fs');

async function getFileUrl() {
  try {
    const res = await storageService.getFileUrl('prohori','posts/IMG_5931.jpg')
    console.log(res)
  } catch(err) {
    console.log(err)
  }
 }
 
 getFileUrl();

async function testList() {
  try {
    const res = await storageService.getAllFilesInDirectory('prohori','posts')
    console.log(res)
  } catch(err) {
    console.log(err)
  }
}

testList();


async function testUpload() {
  try {
    const file1 = fs.readFileSync('./IMG_5931.jpg');
    const file2 = fs.readFileSync('./IMG_5933.png');
    
    const result = await storageService.uploadFile(
      'prohori',
      [
        { fileName: 'IMG_5931.jpg', file: file1 },
        { fileName: 'IMG_5933.png', file: file2 },
      ],
      'posts'
    );
    console.log(result);
  } catch(err) {
    console.error(err);
  }
 }
 
 testUpload();


async function testDelete() {
  try {
    const res = await storageService.deleteFile(
      'prohori',
      ['posts/IMG_5931.jpg', 'posts/IMG_5932.jpg']  // This will delete posts/file1.jpg and posts/file2.jpg
    );
    console.log(res);
  } catch(err) {
    console.log(err);
  }
 }
 
 testDelete();