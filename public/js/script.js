const buttons = document.querySelectorAll(".buy")
buttons.forEach(button=>{
    button.addEventListener("click", () => {
        let id=button.id
        fetch(`http://localhost:8080/courses/create-checkout-session/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })   
        .then(res => { 
            if (res.ok) return res.json()
            return res.json().then(json => Promise.reject(json))
        })
        .then(({ url }) => {
            window.location = url
        })
        .catch(e => {
            window.location = `http://localhost:8080/profile/`
        })
    })
})