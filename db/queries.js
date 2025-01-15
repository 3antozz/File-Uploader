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

exports.getFolder = async (id) => {
    const folder = await prisma.folder.findUnique({
        where: {
            id: id
        },
        include: {
            files: true,
            subfolders: true
        }
    })
    return folder;
}