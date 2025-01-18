const db = require('../db/queries');
const fn = require('./functions');

exports.createFolder = async(req, res) => {
    const { folder_name, folder_id } = req.body;
    const referer = req.get('Referer');
    await db.addFolder(req.user.id, +folder_id, folder_name);
    res.redirect(referer || '/');
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

exports.getFolder = async(req, res) => {
    const folderId = +req.params.id;
    const folder = await db.getFolder(req.user.id, folderId);
    const chain = await db.getFoldersChain(folderId);
    fn.formatData(folder);
    res.render('index', {title: 'Folder', folder: folder, chain: chain});
}