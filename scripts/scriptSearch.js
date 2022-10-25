window.onload = ()=>{
    fetch('/api/search_restaurants', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'text': ''})})
    .then(( res => res.json()))
    .then((data)=>{
        console.log(data);
        if(data.restaurants.length == 0){
            document.getElementById('content').innerHTML = `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
        }
        else{    
            let cards = '';
            data.restaurants.forEach(item => {
                let card = `<a href="./restaurants.html?restaurant_id=${item.restaurant_id}"><restaurant-card restaurant-id="${item.restaurant_id}"></restaurant-card></a>`;
                cards += card;
            });
            document.getElementById('content').innerHTML = cards;
        }
    })
    .catch((err) => console.log(err))


    fetch('/api/search_food_items',{method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'text': ''})})
    .then( res => res.json())
    .then((data)=>{
        console.log(data);
        if(data.food_items.length == 0){
            document.getElementById('frame3').innerHTML += `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
        }
        else{    
            let cards = '';
            data.food_items.forEach(item => {
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
            if(data.restaurants.length == 0){
                document.getElementById('content').innerHTML = `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
            }
            else{    
                let cards = '';
                data.restaurants.forEach(item => {
                    let card = `<a href="./restaurants.html?restaurant_id=${item.restaurant_id}"><restaurant-card restaurant-id="${item.restaurant_id}"></restaurant-card></a>`;
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
            if(data.food_items.length == 0){
                document.getElementById('frame3').innerHTML += `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
            }
            else{    
                let cards = '';
                data.food_item_id.forEach(item => {
                    let card = `<food-card food-item-id="${item.food_item_id}" edit></food-card>`;
                    cards += card;
                });
                document.getElementById('cards').innerHTML = cards;
            }
        })
        .catch((err) => console.log(err))
    })
}