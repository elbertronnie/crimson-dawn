window.onload = ()=>{
    document.getElementById('log').addEventListener('click', ()=>{
        fetch('/logout', {method: 'POST'})
        .then(res => console.log(res.json()))
        .catch(err => console.log(err))
    })
}