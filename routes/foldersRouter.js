/* eslint-disable no-unused-vars */
const { Router } = require('express');
const db = require('../db/queries');
const fs = require('fs');
const path = require('node:path');
const asyncHandler = require('express-async-handler');
const crypto = require('node:crypto');

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
    res.render('index', {title: 'Folder', folder: folder});
}))


module.exports = uploadRouter;