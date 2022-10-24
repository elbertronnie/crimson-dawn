window.onload = ()=>{
    let rating = -1;
    document.querySelectorAll('input').forEach((ele)=>{
        ele.addEventListener('click',(event)=>{
            rating = event.target.value;
            // fetch()
        })
    })

    document.getElementById('post').addEventListener('click', ()=>{
        let review =  document.getElementById('review').value;
        if(rating == -1){
            console.log('Rating is required');
            alert('Rating is necessary');
        }
        else{
            // fetch()
        }
    })
}