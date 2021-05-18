// const now = Date.now().toString()

// module.exports = {
//     now
// }

const generateTime = (text, user)=>{
    return {
        message:text,
        createdAt: Date.now(),
        username: user.username
    }
}

const generateTimeURL = (text,user)=>{
    return {
        url: text,
        createdAt: Date.now(),
        username: user.username
    }
}

module.exports = {
    generateTime,
    generateTimeURL
}