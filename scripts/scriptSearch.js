function search(text, cart){
    fetch('/api/search_restaurants', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'text': text})})
    .then(( res => res.json()))
    .then((data)=>{
        console.log(data);
        if(data.restaurants.length == 0){
            document.getElementById('content').innerHTML = `<p style="width: 100%; text-align: center; opacity: 50%;">There are no searches.😕</p>`;
        }
        else{    
            let cards = '';
            data.restaurants.forEach(item => {
                let card = `<a style="text-decoration: none" href="./restaurants.html?restaurant_id=${item.restaurant_id}"><restaurant-card restaurant-id="${item.restaurant_id}"></restaurant-card></a>`;
                cards += card;
            });
            document.getElementById('content').innerHTML = cards;
        }
    })
    .catch((err) => console.log(err))


    fetch('/api/search_food_items',{method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'text': text})})
    .then( res => res.json())
    .then((data)=>{
        console.log(data);
        if(data.food_items.length == 0){
            document.getElementById('frame3').innerHTML += `<p style="width: 100%; text-align: center; opacity: 50%;">There are no searches.😕</p>`;
        }
        else{    
            let cards = '';
            data.food_items.forEach(item => {
                let quantities = cart.filter(({food_item_id}) => food_item_id == item.food_item_id)
                                     .map(({quantity}) => quantity);
                let count = quantities.length == 0 ? 0 : quantities[0];
                let card = `<food-card food-item-id="${item.food_item_id}" edit count="${count}"></food-card>`;
                cards += card;
            });
            document.getElementById('cards').innerHTML = cards;
        }
    })
    .catch((err) => console.log(err))
}

window.onload = async () => {
    let customer_data = await (await fetch('/api/customer_details')).json();
    search('', customer_data.cart);

    document.getElementById('lens').addEventListener('click', ()=>{
        let value = document.getElementById('search').value;
        search(value, customer_data.cart);
    })
}
