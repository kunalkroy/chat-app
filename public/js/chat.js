// this function will run when the client connects to the server

// const { getUsersList } = require("../utils/user")

// io()
const search = Qs.parse(location.search, {ignoreQueryPrefix:true})
const socket = io()
// socket.on('updatedCount', (count)=>{
//     console.log('here')
//     console.log(count)
//     console.log('count has been updated', count)
// })
const $messageForm = document.querySelector('#messageForm')
const messageFormInput = document.querySelector('#messsageBox')
const messageFormButton = document.querySelector('#show')
const $message = document.querySelector('#messages');
const $template = document.querySelector('#message-template').innerHTML;
const $urlTemplate = document.querySelector('#url-template').innerHTML;
const $listTemplate = document.querySelector('#sideBar').innerHTML;

const autoScroll = ()=>{
    const $newMessage = $message.lastElementChild
    const $newMessageVisibleHeight = $newMessage.offsetHeight
    const newMessageStyles = getComputedStyle($newMessage)
    const $newMessageHeight = $newMessage.offsetHeight + parseInt(newMessageStyles.marginBottom)
    const visibleHeight = $message.offsetHeight
    const totalHeight = $message.scrollHeight
    if(visibleHeight+ $message.scrollTop >= totalHeight- $newMessageHeight){
        // console.log('iiiiiiiiiiiiiiii')
      $message.scrollTop = $message.scrollHeight
    }


}

// console.log($listTemplate)
socket.on('display', (message)=>{
    // console.log(message)
    // console.log(moment(message.createdAt).format('DD MM h mm a'))
    var output = Mustache.render($template, {message: message.message, 
        username: message.username,createdAt: moment(message.createdAt).format('DD MMM h:mm a') })
    // console.log(output)
    $message.insertAdjacentHTML('beforeEnd', output)
    autoScroll()
})

socket.on('displayURL', (message)=>{
    // console.log(document.getElementsByTagName('a'))
    // document.getElementById('locationURL').setAttribute(href=message)
    var output = Mustache.render($urlTemplate, {
        message:message.url,username: message.username ,createdAt: moment(message.createdAt).format('DD MMM h:mm a') })
    $message.insertAdjacentHTML('beforeEnd', output)
})

// socket.on('displayLocation', (location)=>{
//     console.log(location.latitude, location.longitude)
// })


$messageForm.addEventListener('submit', (event)=>{
    event.preventDefault()
    messageFormButton.disabled =  true
    // for above we could have also used setAttribute and removeAttribute
    let val = document.getElementById('messsageBox').value
    messageFormInput.value = ''
    socket.emit('show', val, (error)=>{
        messageFormButton.disabled =  false
        messageFormInput.focus()
        if(error){
            console.log(error)
            return
        }
        console.log('delivered')
    })
})

const $locationButton = document.querySelector('#location')

$locationButton.addEventListener('click', () => {
    $locationButton.disabled =  true
    // console.log('clicked')
    if(!navigator.geolocation){
        return alert('your browser does not suppport Geolocation')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position.coords)
        socket.emit('sendLocation', {latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }, ()=>{
           console.log('Location shared') 
           $locationButton.disabled =  false
        })
        autoScroll()
    }); 
})

socket.emit('join',search, (error)=>{
    if(error){
        alert(error.error)
        location.href = '/'
    }
})

socket.on('roomData', ({room, usersList})=>{
    // console.log($listTemplate)
    var output = Mustache.render($listTemplate, {room: room, usersList:usersList})
    console.log(output)
    document.querySelector('#side').innerHTML= output
})