customElements.define('custom-navbar',
    class extends HTMLElement {
        constructor() {
            super();
        }
        
        login(){
            return `<div class="login">Login</div>`;
        }
        
        user(){
            return `<div class="user">
                        <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.6666 25V22.3333C22.6666 20.9188 22.1047 19.5623 21.1045 18.5621C20.1044 17.5619 18.7478 17 17.3333 17H6.66665C5.25216 17 3.8956 17.5619 2.89541 18.5621C1.89522 19.5623 1.33331 20.9188 1.33331 22.3333V25" stroke="#6B4EFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 11.6667C14.9455 11.6667 17.3333 9.27885 17.3333 6.33333C17.3333 3.38781 14.9455 1 12 1C9.05446 1 6.66665 3.38781 6.66665 6.33333C6.66665 9.27885 9.05446 11.6667 12 11.6667Z" stroke="#6B4EFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>`;
        }

        render(){
            this.shadowRoot.innerHTML = `
<style>
input[type='text']{
    height: 32px;
    background: #FFFFFF;
    border: 1px solid #6B4EFF;
    border-radius: 8px;
    width: 100%;
}

    :host{
        width: 100%;
    }

    .navbar{
        /* Login=False */


        /* Auto layout */
        
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 8px 16px;

        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(4px);
        /* Note: backdrop-filter has minimal browser support */

        position: fixed;
        box-sizing: border-box;
        width: 100%;
        z-index: 1;
    }

    .left{
        /* Left */


        /* Auto layout */

        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0px;
        gap: 10px;

        /* Inside auto layout */

        flex: none;
        order: 0;
        flex-grow: 0;
    }

    .title{
        /* Zango */

        /* /Title2 */

        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 32px;
        line-height: 36px;
        /* identical to box height, or 112% */


        color: #000000;


        /* Inside auto layout */

        flex: none;
        order: 0;
        flex-grow: 0;
    }
    
    .center{
        /* Center */


        /* Auto layout */

        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0px;
        gap: 10px;

        /* Inside auto layout */

        flex: none;
        order: 1;
        flex-grow: 1;
    }

    .location-frame{
        /* Location */


        /* Auto layout */

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0px;
        gap: 4px;

        /* Inside auto layout */

        flex: none;
        order: 0;
    }

    .location{

        /* Large/Normal/Medium */

        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        /* identical to box height, or 133% */


        color: #000000;


        /* Inside auto layout */

        flex: none;
        order: 1;
        flex-grow: 0;
    }
    
    .right{
        /* Right */


        /* Auto layout */

        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0px;
        gap: 10px;

        /* Inside auto layout */

        flex: none;
        order: 2;
        flex-grow: 0;
    }

    .login{
        /* Login */

        /* Regular/None/Regular */

        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 16px;
        /* identical to box height, or 100% */


        /* Primary/Base */

        color: #6B4EFF;


        /* Inside auto layout */

        flex: none;
        order: 0;
        flex-grow: 0;
    }

    .user{
        
    }
</style>

<div class="navbar">
    <div class="left"><div class="title">Zango</div></div>
    <div class="center">
        <div class="location-frame">
            <div class="map-pin">
                <svg width="27" height="32" viewBox="0 0 27 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.5 13.3333C25.5 22.6667 13.5 30.6667 13.5 30.6667C13.5 30.6667 1.5 22.6667 1.5 13.3333C1.5 10.1507 2.76428 7.09849 5.01472 4.84805C7.26516 2.59762 10.3174 1.33334 13.5 1.33334C16.6826 1.33334 19.7348 2.59762 21.9853 4.84805C24.2357 7.09849 25.5 10.1507 25.5 13.3333Z" stroke="#6B4EFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13.5 17.3333C15.7091 17.3333 17.5 15.5425 17.5 13.3333C17.5 11.1242 15.7091 9.33334 13.5 9.33334C11.2909 9.33334 9.5 11.1242 9.5 13.3333C9.5 15.5425 11.2909 17.3333 13.5 17.3333Z" stroke="#6B4EFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="location">${this.location}</div>
        </div>
    </div>
    <div class="right">${this.username !== null ? this.user() : this.login()}</div>
</div>
`;
        }
        
        connectedCallback(){
            const shadowRoot = this.attachShadow({mode: 'open'});
            this.render();
            this.rendered = true;

            setTimeout(async () => {
                let { customer_id, restaurant_id } = await (await fetch('/api/get_id')).json();
                if(customer_id){
                    let { address } = await (await fetch('/api/customer_details')).json()
                    this.username = customer_id;
                    this.location = address;
                }
                if(restaurant_id){
                    this.username = restaurant_id;
                }
            }, 0);
        }
        
        static get observedAttributes() { 
            return ['username', 'location']; 
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.rendered) return;
            
            if(name === "username" && oldValue !== newValue){
                this.render();
            }
            
            if(name === "location" && oldValue !== newValue){
                this.render();
            }
        }
        
        get username(){
            return this.getAttribute("username");
        }
        
        set username(value){
            this.setAttribute("username", value);
        }
        
        get location(){
            return this.getAttribute("location");
        }
        
        set location(value){
            this.setAttribute("location", value);
        }
    }
);
