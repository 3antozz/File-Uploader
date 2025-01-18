const db = require('../db/queries');
const { createClient } = require('@supabase/supabase-js');
require("dotenv").config();
const fn = require('./functions');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


exports.uploadFile = async (req, res, next) => {
    console.log(req.file);
    const folderId = +req.body.folder_id;
    try {
        for(const file of req.files) {
            file.filename = fn.setFileName(file.originalname);
            const { error } = await supabase.storage.from('main').upload(`/${req.user.username}/${file.filename}`, file.buffer, {
                contentType: file.mimetype,
                })
            const result = supabase
                .storage
                .from('main')
                .getPublicUrl(`${req.user.username}/${file.filename}`, {
                download: true,
            })
            if (error) {
                console.log(error);
                throw new Error(error);
            }
            await db.addFile(file.originalname, file.filename, +file.size, result.data.publicUrl, folderId);
        }
        res.redirect(`/folders/${folderId}`)
    } catch(error) {
        return next(error);
    }
}

exports.editForm = async(req, res) => {
    const fileId = req.params.id;
    const file = await db.getFile(+req.user.id, +fileId)
    res.render('edit', {title: 'Edit File', object: file, action: '/files/edit'})
}

exports.updateFile = async(req, res) => {
    const {id, name} = req.body;
    const result = await db.updateFile(+req.user.id, +id, name);
    res.redirect(`/folders/${result.folderId}`);
}

exports.deleteFile = async(req, res)=> {
    const referer = req.get('Referer');
    const { file_id, file_name } = req.body;
    const user_id = req.user.id;
    const { error } = await supabase
        .storage
        .from('main')
        .remove([`${req.user.username}/${file_name}`])
    if (error) {
        console.log(error);
        throw new Error(error);
    }
    await db.deleteFile(+user_id, +file_id);
    res.redirect(referer || '/');
}
