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



const query =  `WITH RECURSIVE fh AS (
                SELECT id, name, "parentId" FROM "Folder" WHERE id=8
                UNION ALL
                SELECT f.id, f.name, f."parentId" FROM "Folder" AS f JOIN fh ON fh."parentId" = f.id)
                SELECT id, name FROM fh ORDER BY "parentId" NULLS FIRST;`