const users = []

const addUser = (id, username, room) => {
    if(!username || !room){
        return { 
            error: 'Please provide a username'
        }
    }
    const newUser = username.trim().toLowerCase()

    const ifExists = users.find((user)=>{
        return newUser === user.username && room=== user.room
    })
    // console.log(ifExists)
    if(ifExists){
        return {
            error: 'username is already taken'
        }
    }
    users.push({
        id:id, username: newUser, room:room 
    })
    
}

// addUser(10,'kunal   ', 'dbg')
// console.log(addUser(11,'manasa   ', 'blr'))
// console.log(users)
const removeUser = (id) => {
    const index = users.findIndex((user)=>{
        return user.id===id 
    })
    if(index>-1){
        const deletedUser = users.splice(index,1)
        return deletedUser
    }
    else{
        return {
            error: 'unable to find element by Id'
        }
    }
    
    
}

const getuserInfo = (id)=>{
    let user = users.find((user)=>{
        return user.id===id
    })
    return user
}

const getUsersList = (room) => {
    let lists = users.filter( (user) => {
        return user.room === room
    })
    return lists
}

// getUsersList();
module.exports = {
    getUsersList,
    removeUser,
    addUser,
    getuserInfo
}