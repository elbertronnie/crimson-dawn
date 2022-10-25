window.onload = ()=>{

    fetch('/api/customer_orders', {method: 'POST'})
    .then(res => {return res.json();})
    .then(data => {
        console.log(orders);
        let orders = '';
        data.orders.forEach(ele => {
            let type = (ele.food_item.veg == true) ? "veg" : "non-veg";
            let order = 
            `<div class="order ${ele.order_id}">
                <div class="date">
                    <div class="text">${ele.timestamp}</div>
                </div>
                <div class="food">
                    <div class="restName">
                        ${ele.food_item.restaurant.name}
                    </div>
                    <a href="./ratingFood.html?food_item_id=${ele.food_item.food_item_id}"><food-card food-item-id="${ele.food_item.food_item_id}"></food-card></a>
                </div>
            </div>`
            orders += order;
        });
        console.log(orders);
        document.getElementById('orders').innerHTML = orders;
    })
    .catch(err => console.log(err));

    

    document.getElementById('logout').addEventListener('click', ()=>{
        fetch('/logout', {method: 'POST'})
        .then(res => console.log(res.json()))
        .catch(err => console.log(err))
    });
}