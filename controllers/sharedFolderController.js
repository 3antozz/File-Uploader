const db = require('../db/queries');
const crypto = require('node:crypto');
const fn = require('./functions');
const { add, isAfter } = require('date-fns');



exports.shareFolder = async(req, res) => {
    let {folder_id, duration} = req.body;
    const folder = await db.getFolder(req.user.id, +folder_id);
    if (folder.SharedFolder && !isAfter(new Date(), folder.SharedFolder.expirationDate)) {
        throw new Error('Folder is already shared!');
    }
    if (!duration) { duration = 1}
    const referer = req.get('Referer');
    const token = crypto.randomUUID();
    const expirationDate = add(new Date(), { days: +duration});
    await db.shareFolder(+folder_id, token, expirationDate);
    res.redirect(referer || '/');
}

exports.getSharedFolder = async (req, res, next) => {
    const token = req.params.token;
    const folder = await db.getSharedFolder(token);
    if (!folder) {
        const error = new Error('Folder not Found');
        error.status = 403;
        return next(error)
    }
    if (isAfter(new Date(), folder.expirationDate)) {
        db.deleteSharedFolder(folder.token);
        const error = new Error('Session Expired');
        error.status = 403;
        return next(error)
    }
    fn.formatData(folder.folder);
    res.render('shared', {title: 'Shared Folder', folder: folder.folder, token: token, chain: [folder.folder]} )
}

exports.getSharedSubFolder = async (req, res, next) => {
    const token = req.params.token;
    const folderId = +req.params.folderId;
    const folder = await db.getSharedFolder(token);
    if (!folder) {
        const error = new Error('Folder not Found');
        error.status = 403;
        return next(error)
    }
    if (isAfter(new Date(), folder.expirationDate)) {
        db.deleteSharedFolder(folder.token);
        const error = new Error('Session Expired');
        error.status = 403;
        return next(error)
    }
    const subFolder = await db.getSharedSubFolder(folderId);
    const chain = await db.getSharedFolderChain(folderId, +folder.folderId);
    fn.formatData(subFolder);
    res.render('shared', {title: subFolder.name, folder: subFolder, token: token, chain: chain});
}

exports.stopSharing = async(req, res) => {
    const referer = req.get('Referer');
    const { folder_token } = req.body;
    await db.deleteSharedFolder(folder_token);
    res.redirect(referer || '/');
} 