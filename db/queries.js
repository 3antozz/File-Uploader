const prisma = require('./client')


exports.addUser = async (first_name, last_name, username, password) => {
    await prisma.user.create({
        data : {
            first_name,
            last_name,
            username,
            password
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