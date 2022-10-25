window.onload = function(){

    let food;
    let rest_id = Number((new URL(document.location)).searchParams.get('restaurant_id'));
    console.log(rest_id);

    document.getElementById('review').href = `./review.html?restaurant_id=${rest_id}`;
    document.getElementById('rest-review').href = `./reviewRest.html?restaurant_id=${rest_id}`;
    fetch('/api/restaurant', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'restaurant_id': rest_id})})
    .then((res)=>{
        return res.json();
    })
    .then((data)=>{
        console.log(data);
        food = data.food_items;
        let cards = '';
        document.getElementById('rest-name').innerHTML = data.name;
        document.getElementById('rest-address').innerHTML = data.address;
        document.getElementById('rest-rating').innerHTML = data.rating;
        document.getElementById('rest-img').style.backgroundImage.url = data.restaurant_image_url;
        data.tags.forEach((tag) => {
            document.getElementById('rest-tags').innerHTML += tag.tag_name;
        });
        data.food_items.forEach((item)=>{
            let type = (item.veg == true) ? "veg" : "non-veg";
            let card = `<food-card image="${item.food_image_url}" id="${item.food_item_id}" title="${item.food_name}" type="${type}" price="₹${item.price}" rating="${0}" review="${0}" serving="${item.serving}" count="0"></food-card>`;
            cards += card;
        });
        console.log(cards);
        document.getElementById('food-cards').innerHTML = cards;
    })
    .catch((err)=>{
        console.log(err);
    })

    document.getElementById('search').addEventListener('input',(event)=>{
        let cards = '';
        food.forEach((item)=>{
            if(item.food_name.toLowerCase().includes(event.target.value.toLowerCase())){
                let type = (item.veg == true) ? "veg" : "non-veg";
                let card = `<food-card image="${item.food_image_url}" id="${item.food_item_id}" title="${item.food_name}" type=${type} price="₹${item.price}" rating="${0}" review="${0}" serving="${item.serving}" count="0"></food-card>`;
                cards += card;
            }
        })
        document.getElementById('food-cards').innerHTML = cards;
    })

    document.querySelectorAll('food-card').forEach((ele)=>{
        ele.addEventListener('change',(event)=>{
            fetch('/api/edit_food_item_cart', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({ 'food_item_id': event.target.id, 'quantity': event.target.quantity})})
            .then((res)=>{
                return res.json();
            })
            .catch((err)=> console.log(err))
        });
    })
}