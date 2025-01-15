/* eslint-disable no-unused-vars */
const { Router } = require('express');
const db = require('../db/queries');
const fs = require('fs');
const asyncHandler = require('express-async-handler');

const uploadRouter = Router();
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `uploads/${req.user.username}/`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }); // Creates the directory, including parent directories if needed
      }
        cb(null, dir);
    },
});
const upload = multer({ storage: storage })

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('/login');
  }
}


uploadRouter.post('/upload', checkAuth, upload.array('files'), asyncHandler((req, res, next) => {
    console.log(req.files);
    console.log(req.body);
    res.redirect('/upload')
}))

uploadRouter.post('/create/:folderId', checkAuth, asyncHandler(async(req, res) => {
    const folderId = +req.params.folderId
    const { folder_name } = req.body;
    await db.addFolder(req.user.id, folderId, folder_name);
    res.redirect('/');
}))

uploadRouter.get('/:id', checkAuth, asyncHandler(async(req, res) => {
    const folderId = +req.params.id;
    const folder = await db.getFolder(folderId);
    res.send(folder)
}))


module.exports = uploadRouter;