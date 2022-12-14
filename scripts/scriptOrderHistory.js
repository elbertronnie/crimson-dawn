window.onload = async ()=>{

    let pending_data = await (await fetch('/api/customer_orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ completed: false })
    })).json();
    
    let orders = '<div class="text">PENDING</div>';
    pending_data.orders.forEach(ele => {
        let order = 
            `<div class="order ${ele.order_id}">
                <div class="date">
                    <div class="text">${new Date(ele.timestamp).toString().split(' GMT')[0]}</div>
                </div>
                <div class="food">
                    <div class="restName">
                        ${ele.food_item.restaurant.name}
                    </div>
                    <a style="text-decoration: none;" href="./ratingFood.html?food_item_id=${ele.food_item.food_item_id}"><food-card food-item-id="${ele.food_item.food_item_id}" count="${ele.quantity}"></food-card></a>
                </div>
            </div>`
        orders += order;
    });
    
    let completed_data = await (await fetch('/api/customer_orders', {
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
                        ${ele.food_item.restaurant.name}
                    </div>
                    <a style="text-decoration: none;" href="./ratingFood.html?food_item_id=${ele.food_item.food_item_id}"><food-card food-item-id="${ele.food_item.food_item_id}" count="${ele.quantity}"></food-card></a>
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
}
