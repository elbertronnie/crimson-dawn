window.onload = ()=>{
    fetch('/api/search_restaurants', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'text': 'b'})})
    .then(( res => res.json()))
    .then((data)=>{
        console.log(data);
        if(data.restaurant_id.length == 0){
            document.getElementById('content').innerHTML = `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
        }
        else{    
            let cards = '';
            let iter = -1;
            data.restaurants.forEach(item => {
                let type = (item.veg == true) ? "veg" : "non-veg";
                let card = `<a href="./restaurant.html?restaurant_id=${item.restaurant_id}"><restaurant-card restaurant-id="${item.restaurant_id}"></restaurant-card></a>`;
                cards += card;
            });
            document.getElementById('content').innerHTML = cards;
        }
    })
    .catch((err) => console.log(err))


    fetch('/api/search_food_items',{method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'text': 'b'})})
    .then( res => res.json())
    .then((data)=>{
        console.log(data);
        if(data.food_item.length == 0){
            document.getElementById('frame3').innerHTML += `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
        }
        else{    
            let cards = '';
            data.forEach(item => {
                let type = (item.veg == true) ? "veg" : "non-veg";
                let card = `<food-card food-item-id="${item.food_item_id}" edit></food-card>`;
                cards += card;
            });
            document.getElementById('cards').innerHTML = cards;
        }
    })
    .catch((err) => console.log(err))


    document.getElementById('lens').addEventListener('click', ()=>{
        let value = document.getElementById('search').value;

        fetch('/api/search_restaurants', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'text': value})})
        .then(( res => res.json()))
        .then((data)=>{
            console.log(data);
            if(data.length == 0){
                document.getElementById('content').innerHTML = `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
            }
            else{    
                let cards = '';
                data.forEach(item => {
                    let type = (item.veg == true) ? "veg" : "non-veg";
                    let card = `<a href="./restaurant.html?restaurant_id=${item.restaurant_id}"><restaurant-card restaurant-id="${item.restaurant_id}"></restaurant-card></a>`;
                    cards += card;
                });
                document.getElementById('content').innerHTML = cards;
            }
        })
        .catch((err) => console.log(err))


        fetch('/api/search_food_items', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'text': value})})
        .then(( res => res.json()))
        .then((data)=>{
            console.log(data);
            if(data.length == 0){
                document.getElementById('frame3').innerHTML += `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
            }
            else{    
                let cards = '';
                data.forEach(item => {
                    let type = (item.veg == true) ? "veg" : "non-veg";
                    let card = `<food-card food-item-id="${item.food_item_id}" edit></food-card>`;
                    cards += card;
                });
                document.getElementById('cards').innerHTML = cards;
            }
        })
        .catch((err) => console.log(err))
    })
}