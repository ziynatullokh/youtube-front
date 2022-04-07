
let token = window.localStorage.getItem('youtubeToken')

if(token){
    profileRender(token)
}



microfonIn.onclick = () => {
    const voice = new webkitSpeechRecognition()

    voice.lang = 'uz-UZ'
    voice.continious = false

    voice.onresult = async event => {
        const input = event.results[0][0].transcript
        console.log(input)
        serachInput.value = input
        datalist.innerHTML = null
        videoList.innerHTML = null
        if(!input) {
            videoList.innerHTML = null
            let response = await fetch(backend + '/users')
            response = await response.json()
            return renderUsers(response.data)
        }
    
        const filter = words.data.filter( el=> {
            const [key] = Object.keys(el)
    
            if(el[key].videoName.includes(input)){
                const [option] = createElement('option')
                option.value = el[key].videoName
                datalist.append(option)
                return el
            }
        })
        filter.map( async path => {
            videoList.innerHTML = null
            const [key] = Object.keys(path)
            
            let res = await fetch(backend + '/video?info=' + key)
                res = await res.json()
                videoList.append(renderVideo(key,res.data[0].owner[0],res.data[0]))
        })
    }
    voice.start()
}



async function profileRender (token){
    let response = await req('/profile',"GET",null,{token})
    if(response.ok){
        profileImage.src = backend + '/' +response.data.data[0].profileImage
        profilehtml.href ='/upload'
    }
}

function serach(){
    return new Promise( async (resolve, reject) => {
        let response = await fetch(backend + '/video')
        response = await response.json()
        if(response.success){
            resolve(response)
        }else{
            reject(response)
        }
    })
}


sarchFormSubmit.onsubmit = event => {
    event.preventDefault()
}


let words = []
serachInput.addEventListener('keyup', async ()=>{
    const input = serachInput.value.trim()
    datalist.innerHTML = null
    if(!input) return 
    
    words.data.map( el=> {
        const [key] = Object.keys(el)

        if(el[key].videoName.includes(input)){
            const [option] = createElement('option')
            option.value = el[key].videoName
            datalist.append(option)
            return el
        }
    })
})



searchForm.onclick = async () => {
    const input = serachInput.value.trim()
    datalist.innerHTML = null
    videoList.innerHTML = null

    if(!input) {
        videoList.innerHTML = null
        let response = await fetch(backend + '/users')
        response = await response.json()
        return renderUsers(response.data)
    }

    const filter = words.data.filter( el=> {
        const [key] = Object.keys(el)

        if(el[key].videoName.includes(input)){
            const [option] = createElement('option')
            option.value = el[key].videoName
            datalist.append(option)
            return el
        }
    })
    filter.map( async path => {
        videoList.innerHTML = null
        const [key] = Object.keys(path)
        
        let res = await fetch(backend + '/video?info=' + key)
            res = await res.json()
            videoList.append(renderVideo(key,res.data[0].owner[0],res.data[0]))
    })
}

function renderUsers (arr){
    if(!arr.length) return 
    usersList.innerHTML = null
    arr.map( async el => {
        
        el.videos.map( async path => {
            let res = await fetch(backend + '/video?info=' + path)
            res = await res.json()
            
            videoList.append(renderVideo(path,el,res.data[0]))
        })

        const [li,a,img,span] =createElement('li','a','img','span')

        li.classList.add('channel')
        li.onclick = async() => {
            videoList.innerHTML = null
            let response = await fetch(backend + '/users/' + el.userId)
            response = await response.json()
            
            response.data[0].videos.map( async el => {
                let res = await fetch(backend + '/video?info=' + el)
                res = await res.json()
                
                videoList.append(renderVideo(el,response.data[0],res.data[0]))
            })
        }

        a.href = '#'

        img.setAttribute('src' , backend + '/' + el.profileImage)
        img.style.width = '30px'
        img.style.height = '30px'
        
        span.textContent = el.name

        a.append(img,span)

        li.append(a)

        

        usersList.append(li)
    })
}

function renderVideo (path,userData,videoData){
    const [li,video,div1,img1,div2,h2,h3,time,a,span,img2] = createElement('li','video','div','img','div','h2','h3','time','a','span','img')

    li.classList.add('iframe')

    video.setAttribute('src', backend + '/video?watch=' + path)
    video.setAttribute('controls','')

    div1.classList.add('iframe-footer')
    
    img1.setAttribute('alt', 'avatar')
    img1.setAttribute('src', backend + '/' + userData.profileImage)

    div2.classList.add('iframe-footer-text')


    h2.classList.add('channel-name')
    h2.textContent = userData.name

    h3.classList.add('iframe-title')
    h3.textContent = videoData.videoName
    
    time.classList.add('uploaded-time')
    time.textContent = videoData.time

    // const [like1,span1, like2,span2,watch,span3,down,span4] = createElement('h6','span','h6','span','watch','span3','down','span4')

    // like1.textContent = 'Like'
    // span1.textContent = videoData.like

    // like2.textContent = 'Dislike'
    // span2.textContent = videoData.dislike

    // time.append(like1,span1,like2,span2)

    a.classList.add('download')
    a.href = backend + '/video?download=' + path

    span.textContent = (videoData.size /1024 /1024 | 0) + 'MB'
    
    img2.setAttribute('src', './img/download.png')

    a.append(span,img2)

    div2.append(h2,h3,time,a)

    div1.append(img1,div2)

    li.append(video,div1)
    
    return li
}

let cashe = {}


setInterval( async() => {
    words = await serach()
    let response = await fetch(backend + '/users')
    response = await response.json()

    if(cashe.users != response.data?.length){
        renderUsers(response.data)
    }
    cashe.users = response.data.length
},1000)


setTimeout( async() => {
    words = await serach()
    let response = await fetch(backend + '/users')
    response = await response.json()

    if(cashe.users != response.data?.length){
        renderUsers(response.data)
    }
    cashe.users = response.data.length
},1)