const { Router } = require('express');
const db = require('../db/queries');
const fs = require('fs');
const path = require('node:path');
const asyncHandler = require('express-async-handler');
const crypto = require('node:crypto');
const { format } = require('date-fns');

const uploadRouter = Router();
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userFolder = path.join(__dirname, '..', 'uploads', req.user.username);
        fs.mkdirSync(userFolder, { recursive: true });
        cb(null, userFolder);
    },
    filename: function (req, file, cb) {
        const suffix = crypto.randomUUID();
        const extension = path.extname(file.originalname);
        const name = path.basename(file.originalname, extension)
        cb(null, `${name}-${suffix}${extension}`)
    }
});
const upload = multer({ storage: storage })

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('/login');
  }
}


uploadRouter.post('/upload', checkAuth, upload.array('files'), asyncHandler(async (req, res, next) => {
    const folderId = +req.body.folder_id;
    console.log(req.files);
    try {
        for(const file of req.files) {
            await db.addFile(file.originalname, file.filename, +file.size, folderId);
        }
        res.redirect(`/folders/${folderId}`)
    } catch(error) {
        return next(error);
    }
}))

uploadRouter.post('/create', checkAuth, asyncHandler(async(req, res) => {
    const { folder_name, folder_id } = req.body;
    await db.addFolder(req.user.id, +folder_id, folder_name);
    res.redirect('/');
}))

uploadRouter.get('/:id', checkAuth, asyncHandler(async(req, res) => {
    const folderId = +req.params.id;
    const folder = await db.getFolder(req.user.id, folderId);
    formatData(folder);
    console.log(folder);
    res.render('index', {title: 'Folder', folder: folder});
}))

function formateDate (date) {
    return format(new Date(date), 'PPp')
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


module.exports = uploadRouter;