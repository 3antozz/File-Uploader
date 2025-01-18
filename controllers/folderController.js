const db = require('../db/queries');
const fn = require('./functions');
const { isAfter } = require('date-fns');
const { validationResult } = require('express-validator');




exports.createFolder = async(req, res) => {
    const result = validationResult(req);
    const { folder_name, folder_id } = req.body;
    if(!result.isEmpty()) {
        const folder = await db.getFolder(req.user.id, +folder_id);
        if (folder.SharedFolder){
            if(!isAfter(new Date(), folder.SharedFolder.expirationDate)) {
                res.locals.shareLink = `${req.protocol}://${req.get('host')}/share/${folder.SharedFolder.token}`
            } else {
                db.deleteSharedFolder(folder.SharedFolder.token);
            }
        }
        const chain = await db.getFoldersChain(+folder_id);
        fn.formatData(folder);
        return res.render('index', {title: folder.name, folderErrors: result.errors, folder: folder, chain: chain})
    }
    await db.addFolder(req.user.id, +folder_id, folder_name);
    res.redirect(`/folders/${folder_id}`)
}

exports.deleteFolder = async(req, res)=> {
    const referer = req.get('Referer');
    const { folder_id } = req.body;
    const user_id = req.user.id;
    await db.deleteFolder(+user_id, +folder_id);
    res.redirect(referer || '/');
}

exports.editForm = async(req, res) => {
    const folderId = req.params.id;
    const folder = await db.getFolder(+req.user.id, +folderId)
    res.render('edit', {title: 'Edit Folder', object: folder, action: '/folders/edit'})
}

exports.updateFolder = async(req, res) => {
    const {id, name} = req.body;
    const result = await db.updateFolder(+req.user.id, +id, name);
    res.redirect(`/folders/${result.parentId}`);
}

exports.getIndexFolder = async(req, res) => {
    const folder = await db.getRootFolder(req.user.id);
        if (folder.SharedFolder){
            if(!isAfter(new Date(), folder.SharedFolder.expirationDate)) {
                res.locals.shareLink = `${req.protocol}://${req.get('host')}/share/${folder.SharedFolder.token}`
            } else {
                db.deleteSharedFolder(folder.SharedFolder.token);
            }
        }
    fn.formatData(folder);
    res.render('index', {title: 'Upload Files', folder: folder, chain: [folder]});
}

exports.getFolder = async(req, res) => {
    const folderId = +req.params.id;
    const folder = await db.getFolder(req.user.id, folderId);
    if (folder.SharedFolder){
        if(!isAfter(new Date(), folder.SharedFolder.expirationDate)) {
            res.locals.shareLink = `${req.protocol}://${req.get('host')}/share/${folder.SharedFolder.token}`
        } else {
            db.deleteSharedFolder(folder.SharedFolder.token);
        }
    }
    const chain = await db.getFoldersChain(folderId);
    fn.formatData(folder);
    res.render('index', {title: folder.name, folder: folder, chain: chain});
}