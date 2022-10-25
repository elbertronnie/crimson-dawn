window.onload = async ()=>{

    let pending_data = await (await fetch('/api/restaurant_orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ completed: false })
    })).json();

    console.log(pending_data);
    
    let orders = '<div class="text">PENDING</div>';
    pending_data.orders.forEach(ele => {
        let order = 
            `<div class="order ${ele.order_id}">
                <div class="date">
                    <div class="text">${new Date(ele.timestamp).toString().split(' GMT')[0]}</div>
                </div>
                <div class="food">
                    <div class="restName">
                        ${ele.customer.name} - ${ele.delivery_location}
                    </div>
                    <div class="card-container">
                        <food-card food-item-id="${ele.food_item.food_item_id}" count="${ele.quantity}"></food-card>
                        <button class="complete-button" data-order-id="${ele.order_id}">COMPLETED</button>
                    </div>
                </div>
            </div>`
        orders += order;
    });
    
    let completed_data = await (await fetch('/api/restaurant_orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ completed: true })
    })).json();

    orders += '<div class="text">COMPLETED</div>'
    completed_data.orders.forEach(ele => {
        let order = 
            `<div class="order ${ele.order_id}">
                <div class="date">
                    <div class="text">${new Date(ele.timestamp).toString().split(' GMT')[0]}</div>
                </div>
                <div class="food">
                    <div class="restName">
                        ${ele.customer.name} - ${ele.delivery_location}
                    </div>
                    <food-card food-item-id="${ele.food_item.food_item_id}" count="${ele.quantity}"></food-card>
                </div>
            </div>`
        orders += order;
    });

    console.log(orders);
    document.getElementById('orders').innerHTML = orders;
    
    document.getElementById('logout').addEventListener('click', ()=>{
        fetch('/logout', {method: 'POST'})
        .then(() => window.location.href = "/")
        .catch(err => console.log(err))
    });

    for(let el of document.getElementsByClassName('complete-button')){
        el.addEventListener('click', async ()=>{
            let result = await (await fetch('/api/restaurant_order_complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: Number(el.getAttribute('data-order-id'))})
            })).json();
            if(result.done){
                window.location.reload();
            }
        });
    }
}
