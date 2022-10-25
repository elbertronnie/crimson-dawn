window.onload = ()=>{
    let rating = -1;
    document.querySelectorAll('input').forEach((ele)=>{
        ele.addEventListener('click',(event)=>{
            rating = event.target.value;
        })
    })
    document.getElementById('post').addEventListener('click', ()=>{
        let rest_id = (new URL(document.location)).searchParams.get('restaurant_id');
        let review =  document.getElementById('review').value;
        if(rating == -1){
            console.log('Rating is required');
            alert('Rating is necessary');
        }
        else{
            let data = {
                'review': review,
                'rating': rating,
                'restaurant_id': rest_id
            };
            console.log(data);
            fetch('/api/add_review', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
            .then(()=> console.log('Review posted'))
            .then(() => window.location.href = `./restaurants.html?restaurant_id=${rest_id}`)
            .catch(err=>console.log(err))
        }
    })
}
