const prisma = require('./client')
const { getFolderChain } = require('@prisma/client/sql')

exports.addUser = async (first_name, last_name, username, password) => {
    await prisma.user.create({
        data : {
            first_name,
            last_name,
            username,
            password,
            folders: {
                create : {
                    name: 'myFiles',
                }
            }
        }
    })
}

exports.getUserByUsername = async (username) => {
    const user = await prisma.user.findUnique({
        where : {
            username: username
        }
    })
    return user;
}

exports.getUserByID = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    return user;
}


exports.addFolder = async (userId, folderId, name) => {
    await prisma.folder.create({
        data : {
            name: name,
            owner: {
                connect: {
                    id: userId
                }
            },
            parent: {
                connect: {
                    id: folderId
                }
            }
        }
    })
}

exports.getRootFolder = async(userId) => {
    const result = await prisma.folder.findFirst({
        where: {
            userId: userId
        },
        include: {
            files: true,
            subfolders: true
        },
        orderBy: {
            id: 'asc'
        }
    })
    return result;
}

exports.getFolder = async (userId, id) => {
    return await prisma.folder.findUnique({
        where: {
            userId: userId,
            id: id
        },
        include: {
            files: true,
            subfolders: true
        },
    })
}

exports.getFoldersChain = async (folderId) => {
    return await prisma.$queryRawTyped(getFolderChain(folderId))
}


exports.deleteFolder = async (userId, folderId) => {
    await prisma.folder.delete({
        where: {
            userId: userId,
            id: folderId
        }
    })
}

exports.updateFolder = async (userId, folderId, name) => {
    const folder = await prisma.folder.update({
        where: {
            id: folderId,
            userId: userId
        },
        data: {
            name: name
        }
    })
    return folder;
}

exports.getFile = async (userId, fileId) => {
    return await prisma.file.findUnique({
        where: {
            id: fileId,
            folder: {
                owner: {
                    id: userId
                }
            }
        }
    })
}

exports.addFile = async(originalName, fileName, size, folderId) => {
    await prisma.file.create({
        data: {
            originalName,
            fileName,
            size,
            folder: {
                connect: {
                    id: folderId
                }
            }
        }
    })
}

exports.deleteFile = async (userId, fileId) => {
    await prisma.file.delete({
        where: {
            folder: {
                userId: userId
            },
            id: fileId
        }
    })
}

exports.updateFile = async (userId, fileId, name) => {
    const file = await prisma.file.update({
        where: {
            id: fileId,
            folder: {
                owner: {
                    id: userId
                }
            }
        },
        data: {
            originalName: name
        }
    })
    return file;
}