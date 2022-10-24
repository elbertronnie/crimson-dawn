const { event } = require("jquery");

window.onload = ()=>{
    fetch('/api/search_restaurants?search='+'', {method: 'GET'})
    .then(( res => res.json()))
    .then((data)=>{
        if(data.length == 0){
            document.getElementById('content').innerHTML = `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
        }
        else{    
            let cards = '';
            data.forEach(element => {
                let card = // data
                cards += card;
            });
            document.getElementById('content').innerHTML = cards;
        }
    })
    .then(()=>{
        document.querySelectorAll('restuarant-cards').forEach((ele)=>{
            ele.addEventListener('click',(event)=>{
                fetch('/api/restaurant?restaurant_id='+event.target.restaurant_id, {method: 'GET'})
                .then(res => res.json())
                .catch((err)=> console.log(err))
            })
        })
    })
    .catch((err) => console.log(err))


    fetch('/api/search_food_items?search='+'', {method: 'GET'})
    .then( res => res.json())
    .then((data)=>{
        if(data.length == 0){
            document.getElementById('frame3').innerHTML += `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
        }
        else{    
            let cards = '';
            data.forEach(element => {
                let card = `<food-card image="${item.food_image_url}" id="${item.food_item_id}" title="${item.food_name}" type="${item.type}" price="₹${item.price}" rating="${0}" review="${0}" serving="${item.serving}" count="0"></food-card>`;
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

        fetch('/api/search_restaurants?search='+'', {method: 'GET'})
        .then(( res => res.json()))
        .then((data)=>{
            if(data.length == 0){
                document.getElementById('content').innerHTML = `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
            }
            else{    
                let cards = '';
                data.forEach(element => {
                    let card = // data
                    cards += card;
                });
                document.getElementById('content').innerHTML = cards;
            }
        })
        .then(()=>{
            document.querySelectorAll('restuarant-cards').forEach((ele)=>{
                ele.addEventListener('click',(event)=>{
                    fetch('/api/restaurant?restaurant_id='+event.target.restaurant_id, {method: 'GET'})
                    .then(res => res.json())
                    .catch((err)=> console.log(err))
                })
            })
        })
        .catch((err) => console.log(err))


        fetch('/api/search_food_items?search='+'', {method: 'GET'})
        .then(( res => res.json()))
        .then((data)=>{
            if(data.length == 0){
                document.getElementById('frame3').innerHTML += `<p style="width: 100%; text-align: center;">There are no searches.😕</p>`;
            }
            else{    
                let cards = '';
                data.forEach(element => {
                    let card = `<food-card image="${item.food_image_url}" id="${item.food_item_id}" title="${item.food_name}" type="${item.type}" price="₹${item.price}" rating="${0}" review="${0}" serving="${item.serving}" count="0"></food-card>`;
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