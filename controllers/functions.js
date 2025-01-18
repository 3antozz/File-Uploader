const { format } = require('date-fns');
const path = require('node:path');

function formateDate (date) {
    return format(new Date(date), 'PPp')
}

function formatFileSize (sizeInBytes) {
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

exports.formatData = (object) => {
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

exports.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

exports.setFileName = (originalName) => {
    const suffix = crypto.randomUUID();
    const extension = path.extname(originalName);
    const name = path.basename(originalName, extension)
    const fileName = `${name}-${suffix}${extension}`
    return fileName;
}


