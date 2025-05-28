const prisma = require('./client')
const { getFolderChain, getFolderChainLimit } = require('@prisma/client/sql')

exports.addUser = async (username, password) => {
    await prisma.user.create({
        data : {
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
            files: {
                orderBy: [
                    { uploadDate: 'desc' },
                    { originalName: 'asc' }
                ] 
            },
            subfolders: {
                orderBy: [
                    { name: 'asc' },
                    { creationDate: 'desc' }
                ] 
            },
            SharedFolder: true
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
            files: {
                orderBy: [
                    { uploadDate: 'desc' },
                    { originalName: 'asc' }
                ]  
            },
            subfolders: {
                orderBy: [
                    { name: 'asc' },
                    { creationDate: 'desc' }
                ] 
            },
            SharedFolder: true
        },
    })
}

exports.getFoldersChain = async (folderId) => {
    return await prisma.$queryRawTyped(getFolderChain(folderId))
}


exports.deleteFolder = async (userId, folderId) => {
    return await prisma.folder.delete({
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

exports.addFile = async(originalName, fileName, size, url, folderId) => {
    await prisma.file.create({
        data: {
            originalName,
            fileName,
            size,
            url,
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

exports.shareFolder = async(folderId, token, expirationDate) => {
    await prisma.sharedFolder.create({
        data : {
            expirationDate,
            token,
            folder: {
                connect: {
                    id: folderId
                }
            }
        }
    })
}

exports.getSharedFolder = async(token) => {
    return prisma.sharedFolder.findUnique({
        where: {
            token: token
        },
        include: {
            folder: {
                include: {
                    files: {
                        orderBy: [
                            { uploadDate: 'desc' },
                            { originalName: 'asc' }
                        ]  
                    },
                    subfolders: {
                        orderBy: [
                            { name: 'asc' },
                            { creationDate: 'desc' }
                        ] 
                    }
                }
            }
        }
    })
}

exports.getSharedSubFolder = async(folderId) => {
    return prisma.folder.findUnique({
        where: {
            id: folderId
        },
        include: {
            files: {
                orderBy: [
                    { uploadDate: 'desc' },
                    { originalName: 'asc' }
                ] 
            },
            subfolders: {
                orderBy: [
                    { name: 'asc' },
                    { creationDate: 'desc' }
                ] 
            }
        }
    })
}

exports.getSharedFolderChain = async(folderId, rootId) => {
    return await prisma.$queryRawTyped(getFolderChainLimit(folderId, rootId))
}

exports.deleteSharedFolder = async(token) => {
    await prisma.sharedFolder.delete({
        where: {
            token: token
        }
    })
}