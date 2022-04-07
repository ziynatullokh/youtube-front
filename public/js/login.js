loginForm.onsubmit = async (event) => {
    event.preventDefault()
    const name = usernameInput.value.trim()
    const password = passwordInput.value.trim()


    if(!name) return alert("Nikname bo'lishi kerak")
    else if(!password ) return alert("Parol yozilishi kerak")

    const body = {
        name,
        password
    }

    const header = {
        'Content-type':'application/json'
    }

    let response = await fetch(backend + '/login',{
        method:"POST",
        headers:header,
        body: JSON.stringify(body)
    })
    response = await response.json()
    console.log(response)
    
    if(response.success){
        window.localStorage.setItem('youtubeToken',response.data[0]?.token)
        responseMsg.textContent = response.sms
        setTimeout( () => {
            window.location = '/'

        },1000)
    }
    else{
        responseMsg.textContent = response.sms
    }
}