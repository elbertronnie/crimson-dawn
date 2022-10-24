window.onload = function(){
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const save = document.getElementById('save');
    const edit = document.getElementById('edit');

    fetch('/api/customer_details').then((res)=>{
        return res.json();
    })
    .then((data)=>{
        name.value = data.name,
        email.value = data.email,
        address.value = data.address;
    })
    .catch((err) => console.log(err))

    edit.addEventListener('click', ()=>{
        name.disabled = false;
        email.disabled = false;
        address.disabled = false;
        save.disabled = false;
        edit.disabled = true;
    })

    save.addEventListener('click',(event)=>{
        name.disabled = true;
        email.disabled = true;
        address.disabled = true;
        save.disabled = true;
        edit.disabled = false;
        
        let data = {
            'name': name.value,
            'email': email.value,
            'address': address.value
        }

        fetch('/api/edit_customer', {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
        .then((res)=>{
            console.log(res.json());
        })
        .catch((err)=>{
            console.log(err);
        })
    })
}
