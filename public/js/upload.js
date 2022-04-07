
let token = window.localStorage.getItem('youtubeToken')

if(token){
    profileRender(token)
}
else{
    window.location='/login'
}



async function profileRender (token){
    let response = await req('/profile',"GET",null,{token})
    if(!response.ok){ 
        return window.location = '/login'
    }
    response.data.data[0].videos.map( async path => {
        let res = await fetch(backend + '/video?info=' + path)
        res = await res.json()


        userVideoList.append(renderVideo(path,res.data[0]))

    })

}

function renderVideo(path,videoData){
    
    
    const [li, video, p, img] = createElement('li','video','p','img')

    li.classList.add('video-item')

    video.setAttribute('src', backend + '/video?watch=' + path)
    video.setAttribute('controls','')

    p.classList.add('content')

    p.setAttribute('contenteditable',true)
    p.setAttribute('id', 'changeVideoNameInput')
    p.textContent=videoData.videoName
    p.addEventListener('keyup', async(event) => {
        
        if(event.keyCode == 13){
            p.setAttribute('contenteditable',false)
            let name = changeVideoNameInput.textContent.trim()
            if(!name || name>30) return alert("invalid video name")
            let res = await fetch(backend + '/video?info=' + path,{
                method:'PUT',
                headers:{
                    'Content-type':'application/json',
                    token
                },
                body:JSON.stringify({
                    videoName: name
                })
            })
            res = await res.json()
            console.log(res)
        }
    })

    img.setAttribute('src', './img/delete.png')
    img.classList.add('delete-icon')
    img.setAttribute('width', '25px')
    img.onclick = async () => {
        deleteVideo(path)
        li.remove()
    }



    li.append(video,p,img)

    return li
}

async function deleteVideo(path){
    let res = await fetch(backend + '/video?info=' + path,{
        method:'DELETE',
        headers:{
            'Content-type':'application/json',
            token
        }
    })
    res = await res.json()
    console.log(res)
}


uploadButton.onsubmit = async event => {
    event.preventDefault()

    const videoName = videoInput.value.trim()
    const file = uploadInput.files[0]

    if(!videoName) return alert("Video nomini yozing")
	else if( !file || !file.size) return alert("Video tanlanishi shart")
	else if( file.size > 52428800) return alert("Video 50 Mb dan ko'p bo'lmasligi kerak")

    const form = new FormData() 
    form.append('videoName',videoName)
    form.append('file',file)

    let response = await fetch(backend + '/upload',{
        method:"POST",
        headers:{token},
        body: form
    })
    response = await response.json()
    if(response.success){
        responseMsg.textContent = response.sms
        setTimeout( () => {
            userVideoList.append(renderVideo(response.data[0].videopath,response.data[0].data))
        },200)
    }
    else{
        responseMsg.textContent = response.sms
    }
}
