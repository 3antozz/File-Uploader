const prisma = require('./client')


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

exports.addFile = async(originalName, fileName, size, folderId) => {
    const result = await prisma.file.create({
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
    console.log(result);
}