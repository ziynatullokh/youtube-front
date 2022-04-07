const backend = 'http://192.168.43.59:5555' 

async function req(path,method,body=null,headers =null){
    
    try{
        let response
        if(method == 'GET'){
            response = await fetch(backend + path, {
                method,
                headers,
                body
            })
        }
        else{ 
            response = await fetch(backend + path, {
            method,
            body
        })}
        response = await response.json()

        if(!response.success) throw new Error(response.sms)
        return {ok:true,sms:response.sms, data:response}
    }catch(error){
        return {ok:false, sms: error.message, data:{}}
    }
}

function createElement(...arr){
    return arr.map( el => document.createElement(el))
}