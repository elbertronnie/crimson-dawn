window.onload = ()=>{

    fetch('/api/tags', {method: 'POST'})
    .then(res => res.json())
    .then(data =>{
        console.log(data);
        let block = '';
        data.tags.forEach(ele=>{
            let unit = 
            `<div class="checkbox">
                <input type="radio" name="${ele.tag_name} id="${ele.tag_id}" class="check" disabled>
                <div class="tag">${ele.tag_name}</div>
            </div>`
            block += unit;
        })
        document.getElementById('add-tag').innerHTML = block;
    })
    .then(()=>{
        fetch('/api/restaurant_details')
        .then(res => res.json())
        .then(data =>{
            console.log(data);
            document.getElementById('name').value = data.name;
            document.getElementById('email').value = data.email;
            document.getElementById('address').value = data.address;
            document.getElementById('rest-name').innerHTML = data.name;
            document.getElementById('rest-address').innerHTML = data.address;
            document.getElementById('rest-img').style.backgroundImage.url = data.restaurant_image_url;
            data.tags.forEach((tag) => {
                document.getElementById('rest-tags').innerHTML += tag.tag_name;
            });

            document.querySelectorAll('.check').forEach(ele => {
                if(data.tags.includes(ele)){
                    ele.checked = true;
                }
            })
            return data.restaurant_id;
        })
        .then((rest_id) => {
            fetch('/api/restaurant', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'restaurant_id': rest_id})})
            .then(res => res.json())
            .then(data => {
                console.log(data);
                document.getElementById('rest-rating').rating = data.rating;
                let cards = '';
                data.food_items.forEach((item)=>{
                    let card = 
                            `<div class="food-card">
                            <a href="./foodItem.html?food_item_id=${item.food_item_id}"><food-card food-item-id="${item.food_item_id}"></food-card></a>
                                <button class="del" name="${item.food_item_id}">X</button>
                            </div>`;
                    cards += card;
                });
                console.log(cards);
                document.getElementById('food-cards').innerHTML = cards;
            })
            .catch(err => console.log(err))

            return rest_id;
        })
        .then((rest_id)=>{
            console.log('for del');
            document.querySelectorAll('.del').forEach(ele => {
                console.log(ele);
                ele.addEventListener('click', (event)=>{
                    fetch('/api/delete_food_item', {method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'food_item_id': Number(event.target.name)})})
                    .then(res => console.log(res.json()))
                    .catch(err => console.log(err))
                })
            })
        })
        .catch(err => console.log(err))
    })
    .catch(err=> console.log(err))
    
    document.getElementById('add-more-tag').addEventListener('click',()=>{
        let value = document.getElementById('more-tags').value;
        console.log(value);
        fetch('/api/add_tag',{method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({'name': value})})
        .then(res => {
            console.log(res.json);
            document.getElementById('add-tag').innerHTML += 
            `<div class="checkbox">
                <input type="radio" name="${value}" id="${res.json().tag_id}" class="check">
                <div class="tag">${value}</div>
            </div>`;
        })
        .catch(err => console.log(err))
    })

    document.getElementById('edit1').addEventListener('click', ()=>{
        document.getElementById('name').disabled = false;
        document.getElementById('address').disabled = false;
        document.getElementById('email').disabled = false;
        document.getElementById('save1').disabled = false;
        document.getElementById('more-tags').disabled = false;
        document.querySelectorAll('check').forEach(ele => {
            ele.disabled = false;
        })
        document.getElementById('edit1').disabled = true;
    })

    document.getElementById('save1').addEventListener('click', ()=>{
        document.getElementById('name').disabled = true;
        let name = document.getElementById('name').value;
        document.getElementById('address').disabled = true;
        let address = document.getElementById('address').value;
        document.getElementById('email').disabled = true;
        let email = document.getElementById('email').value;

        document.getElementById('save1').disabled = true;
        document.getElementById('more-tags').disabled = true;
        document.querySelectorAll('.check').forEach(ele => {
            ele.disabled = true;
        })
        document.getElementById('edit1').disabled = false;

        let tags = [];
        document.querySelectorAll('.check').forEach(ele => {
            if(ele.checked == true){
                tags.push({'tag_id': ele.id});
            }
        })

        let data = {
            'name': name,
            'email': email,
            'address': address,
            'tags': tags
        }

        console.log(data);

        fetch('/api/edit_restaurant',{method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
    })
}