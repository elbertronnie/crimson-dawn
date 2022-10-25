window.onload = function(){

    let rest_id = (new URL(document.location)).searchParams.get('restaurant_id');
    document.getElementById('rest').href = `./restaurants.html?restaurant_id=${rest_id}`;
    fetch('/api/restaurant', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'restaurant_id': rest_id})})
    .then((res)=>{
        return res.json();
    })
    .then((data)=>{
        document.getElementById('rest-name').innerHTML = data.name;
        document.getElementById('rest-address').innerHTML = data.address;
        document.getElementById('rest-rating').innerHTML = data.rating;
        document.getElementById('rest-img').style.backgroundImage().url = data.restaurant_image_url;
        data.tags.forEach((tag) => {
            document.getElementById('rest-tags').innerHTML += tag.tag_name;
        });

        return data.reviews;
    })
    .then((reviews)=>{
        console.log(reviews);
        let content = '';
        if(reviews.length == 0){
            document.getElementsByClassName('frame3').innerHTML = 'No one has reviewed yet';
        }
        reviews.forEach((unit)=>{
            let block = 
            `<div class="unit">
                <div class="head3">
                    <div class="profile">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M26.6667 28V25.3333C26.6667 23.9188 26.1048 22.5623 25.1046 21.5621C24.1044 20.5619 22.7479 20 21.3334 20H10.6667C9.25222 20 7.89567 20.5619 6.89547 21.5621C5.89528 22.5623 5.33337 23.9188 5.33337 25.3333V28" stroke="#090A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 14.6667C18.9456 14.6667 21.3334 12.2789 21.3334 9.33333C21.3334 6.38781 18.9456 4 16 4C13.0545 4 10.6667 6.38781 10.6667 9.33333C10.6667 12.2789 13.0545 14.6667 16 14.6667Z" stroke="#090A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        <div id="cust-name">${unit.name}</div>
                    </div>
                    <rating-pill rating=${unit.rating}></rating-pill>
                </div>
                <div id="review">${unit.review}</div>
            </div>`;
            content += block;
        })
        document.getElementById('frame3').innerHTML = content;
    })
    .catch((err)=>{
        console.log(err);
    })
}