window.onload = ()=>{
    fetch('/api/search_restaurants', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'text': ''})})
    .then(( res => res.json()))
    .then((data)=>{
        if(data.length == 0){
            document.getElementById('content').innerHTML = `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
        }
        else{    
            let cards = '';
            data.forEach(item => {
                let type = (item.veg == true) ? "veg" : "non-veg";
                let card = `<restaurant-card id="${item.restaurant_id}" image="${item.restaurant_image_url}" rating="${item.rating}" review="${item.review}" buys="${item.buys}" title="${item.name}" type="${type}" address="${item.address}"></restaurant-card>`;
                cards += card;
            });
            document.getElementById('content').innerHTML = cards;
        }
    })
    .then(()=>{
        document.querySelectorAll('restuarant-cards').forEach((ele)=>{
            ele.addEventListener('click',(event)=>{
                fetch('/api/restaurant', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'restaurant_id': event.target.id})})
                .then(res => res.json())
                .catch((err)=> console.log(err))
            })
        })
    })
    .catch((err) => console.log(err))


    fetch('/api/search_food_items',{method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'text': ''})})
    .then( res => res.json())
    .then((data)=>{
        if(data.length == 0){
            document.getElementById('frame3').innerHTML += `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
        }
        else{    
            let cards = '';
            data.forEach(item => {
                let type = (item.veg == true) ? "veg" : "non-veg";
                let card = `<food-card image="${item.food_image_url}" id="${item.food_item_id}" title="${item.food_name}" type="${type}" price="₹${item.price}" rating="${0}" review="${0}" serving="${item.serving}" count="0"></food-card>`;
                cards += card;
            });
            document.getElementById('cards').innerHTML = cards;
        }
    })
    .then(()=>{
        document.querySelectorAll('food-card').forEach((ele)=>{
            ele.addEventListener('change',(event)=>{
                fetch('/api/edit_food_item_cart', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({ 'food_item_id': event.target.id, 'quantity': event.target.quantity})})
                .then((res)=>{
                    console.log(res.json());
                })
                .catch((err)=> console.log(err))
            });
        })
    })
    .catch((err) => console.log(err))


    document.getElementById('lens').addEventListener('click', ()=>{
        let value = document.getElementById('search').value;

        fetch('/api/search_restaurants', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'text': value})})
        .then(( res => res.json()))
        .then((data)=>{
            if(data.length == 0){
                document.getElementById('content').innerHTML = `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
            }
            else{    
                let cards = '';
                data.forEach(item => {
                    let type = (item.veg == true) ? "veg" : "non-veg";
                    let card = `<restaurant-card id="${item.restaurant_id}" image="${item.restaurant_image_url}" rating="${item.rating}" review="${item.review}" buys="${item.buys}" title="${item.name}" type="${type}" address="${item.address}"></restaurant-card>`;
                    cards += card;
                });
                document.getElementById('content').innerHTML = cards;
            }
        })
        .then(()=>{
            document.querySelectorAll('restuarant-cards').forEach((ele)=>{
                ele.addEventListener('click',(event)=>{
                    fetch('/api/restaurant'+event.target.restaurant_id, {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'restaurant_id': event.target.id})})
                    .then(res => res.json())
                    .catch((err)=> console.log(err))
                })
            })
        })
        .catch((err) => console.log(err))


        fetch('/api/search_food_items', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'text': value})})
        .then(( res => res.json()))
        .then((data)=>{
            if(data.length == 0){
                document.getElementById('frame3').innerHTML += `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
            }
            else{    
                let cards = '';
                data.forEach(item => {
                    let type = (item.veg == true) ? "veg" : "non-veg";
                    let card = `<food-card image="${item.food_image_url}" id="${item.food_item_id}" title="${item.food_name}" type="${type}" price="₹${item.price}" rating="${0}" review="${0}" serving="${item.serving}" count="0"></food-card>`;
                    cards += card;
                });
                document.getElementById('cards').innerHTML = cards;
            }
        })
        .then(()=>{
            document.querySelectorAll('food-card').forEach((ele)=>{
                ele.addEventListener('change',(event)=>{
                    fetch('/api/edit_food_item_cart', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({ 'food_item_id': event.target.id, 'quantity': event.target.quantity})})
                    .then((res)=>{
                        console.log(res.json());
                    })
                    .catch((err)=> console.log(err))
                });
            })
        })
        .catch((err) => console.log(err))
    })
}