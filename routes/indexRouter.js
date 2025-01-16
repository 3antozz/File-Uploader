const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const db = require('../db/queries');
const { format } = require('date-fns');

const indexRouter = Router();

const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}



function formatData (object) {
    object.creationDate = formateDate(object.creationDate);
    object.files.forEach((file) => {
        file.uploadDate = formateDate(file.uploadDate);
        file.size =  formatFileSize(file.size);
    })
    object.subfolders.forEach((folder) => {
        folder.creationDate = formateDate(folder.creationDate);;
    })
    return object;
}

function formateDate (date) {
    return format(new Date(date), 'PP, k:m')
}

function formatFileSize(sizeInBytes) {
    let formattedSize;
    if (sizeInBytes >= 1_000_000_000) {
      formattedSize = (sizeInBytes / 1_000_000_000).toFixed(2) + ' GB';
    } else if (sizeInBytes >= 1_000_000) { 
      formattedSize = (sizeInBytes / 1_000_000).toFixed(2) + ' MB';
    } else if (sizeInBytes >= 1_000) {
      formattedSize = (sizeInBytes / 1_000).toFixed(2) + ' KB';
    } else {
      formattedSize = sizeInBytes + ' Bytes';
    }
    return formattedSize;
  }


indexRouter.get('/', checkAuth, asyncHandler(async(req, res) => {
    const folder = await db.getRootFolder(req.user.id);
    formatData(folder);
    res.render('index', {title: 'Upload Files', folder: folder});
}));

indexRouter.get('/upload', checkAuth, asyncHandler((req, res) => {
    res.render('upload', {title: 'Upload Files'});
}));



module.exports = indexRouter;