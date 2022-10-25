// left the list rating and review portion

window.onload = ()=>{
    let items_list = document.getElementById('itemsList');
    let address = document.getElementById('address');
    let total = document.getElementById('totalCharge');
    let proceed = document.getElementById('proceed');

    let charge=0;
    let cards = '';
    
    fetch('api/customer_details').then((res)=>{
        return res.json();
    })
    .then((data)=>{
        
        address.innerHTML = data.address;

        let list = data.cart;
        list.forEach((item)=>{
            let type = (item.veg == true) ? "veg" : "non-veg";
            let card = `<div class="item">
                            <div class="food">
                            <food-card image="../images/Pizza.png" id="${item.food_item_id}" title="${item.food_name}" type=${type} price="₹${item.price}" rating="${0}" review="${0}" serving="${item.serving}" count="${item.quantity}"></food-card>
                        </div>
                        <div class="cost">₹${item.price * item.quantity}</div>
                    </div>`;
            cards += card;
            charge += item.quantity*item.price;
        });
        items_list.innerHTML = cards;
        total.innerHTML = `₹${charge}`;
    });

    proceed.addEventListener('click',(event)=>{
        console.log(event);
        alert('Your order has been placed!');
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

