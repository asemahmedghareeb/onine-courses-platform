const buttons = document.querySelectorAll(".buy")

buttons.forEach(button=>{

    button.addEventListener("click", () => {
        let id=button.id
        console.log(id)
        console.log('accessed')

        fetch(`https://mr-ahmed-ghareeb.cyclic.app/courses/create-checkout-session/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({

            // }), 
    })  
    .then(res => { 
        if (res.ok) return res.json()
        return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
        console.log(url)
        window.location = url
    })
    .catch(e => {
        console.log('bug')
        console.error(e.error)
    })
    })
})