registerForm.onsubmit = async (event) => {
    event.preventDefault()
    const name = usernameInput.value.trim()
    const password = passwordInput.value.trim()
    const file = uploadInput.files[0]

    if(!name) return alert("Nikname bo'lishi kerak")
    else if(!password ) return alert("Parol yozilishi kerak")
	else if( !file || !file.size) return alert("Rasm tanlanishi shart")

    const form = new FormData() 
    form.append('name',name)
    form.append('password',password)
    form.append('file',file)


    let response = await req('/register','POST',form)
    if(response.ok){
        window.localStorage.setItem('youtubeToken',response.data.data[0].token)
        responseMsg.textContent = response.sms
        setTimeout( () => {
            window.location = '/'
        },1000)
    }
    else{
        responseMsg.textContent = response.sms
    }
}