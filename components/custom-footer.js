customElements.define('custom-footer',
    class extends HTMLElement {
        constructor() {
            super();
        }
        
        connectedCallback(){
            const shadowRoot = this.attachShadow({mode: 'open'});
            this.shadowRoot.innerHTML = `
<style>
    .footer{
        /* Footer */


        /* Auto layout */

        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 32px 32px 64px;

        /* Sky/Light */

        background: #E3E5E6;
    }
    
    .left{
        /* Left */


        /* Auto layout */

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;
        gap: 32px;

        /* Inside auto layout */

        flex: none;
        order: 0;
        flex-grow: 1;
    }
    
    .right{
        /* Right */


        /* Auto layout */

        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-start;
        padding: 0px;
        gap: 36px;

        width: calc(240px - 2*0px);


        /* Inside auto layout */

        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 0;
    }
    
    .title{
        /* Zango */

        /* /Title1 */

        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 48px;
        line-height: 56px;
        /* identical to box height, or 117% */

        display: flex;
        align-items: center;
        text-align: center;

        /* Ink/Darker */

        color: #202325;


        /* Inside auto layout */

        flex: none;
        order: 0;
        flex-grow: 0;
    
    }
    
    .contact{
        /* Contact Us */

        /* /Title3 */

        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 32px;
        /* identical to box height, or 133% */

        display: flex;
        align-items: center;
        text-align: center;

        color: #000000;


        /* Inside auto layout */

        flex: none;
        order: 1;
        flex-grow: 0;
    }

    .link{
        /* Social Links */

        /* /Title3 */

        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 32px;
        /* identical to box height, or 133% */

        align-items: center;
        text-align: center;

        color: #000000;


        /* Inside auto layout */

        flex: none;
        order: 0;
        align-self: stretch;
        flex-grow: 0;
    }

    .icons{
        /* Icons */


        /* Auto layout */

        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0px 5px;
        gap: 18px;


        /* Inside auto layout */

        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 0;
    }
    
    .icon{
        /* icon */


        width: 32px;
        height: 32px;


        /* Inside auto layout */

        flex: none;
        flex-grow: 0;
    }
</style>

<div class="footer">
    <div class="left">
        <div class="title">Zango</div>
        <div class="contact">Contact Us</div>
    </div>
    <div class="right">
        <div class="link">Social Links</div>
        <div class="icons">
            <div class="icon">
                <svg width="17" height="30" viewBox="0 0 17 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 1.66666H12C10.2319 1.66666 8.5362 2.36904 7.28595 3.61928C6.03571 4.86952 5.33333 6.56521 5.33333 8.33332V12.3333H1.33333V17.6667H5.33333V28.3333H10.6667V17.6667H14.6667L16 12.3333H10.6667V8.33332C10.6667 7.9797 10.8071 7.64056 11.0572 7.39051C11.3072 7.14047 11.6464 6.99999 12 6.99999H16V1.66666Z" stroke="#090A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="icon">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.3333 7.66666H22.3467M8.33333 1.66666H21.6667C25.3486 1.66666 28.3333 4.65142 28.3333 8.33332V21.6667C28.3333 25.3486 25.3486 28.3333 21.6667 28.3333H8.33333C4.65144 28.3333 1.66667 25.3486 1.66667 21.6667V8.33332C1.66667 4.65142 4.65144 1.66666 8.33333 1.66666ZM20.3333 14.16C20.4979 15.2697 20.3083 16.4029 19.7917 17.3987C19.275 18.3944 18.4575 19.2019 17.4555 19.7062C16.4535 20.2106 15.3179 20.3861 14.2104 20.2079C13.1028 20.0297 12.0797 19.5068 11.2865 18.7135C10.4932 17.9203 9.97031 16.8972 9.79209 15.7896C9.61387 14.6821 9.78942 13.5465 10.2938 12.5445C10.7981 11.5425 11.6056 10.725 12.6013 10.2083C13.597 9.69165 14.7303 9.50211 15.84 9.66666C16.9719 9.8345 18.0198 10.3619 18.8289 11.1711C19.638 11.9802 20.1655 13.0281 20.3333 14.16Z" stroke="#090A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="icon">
                <svg width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.3333 9.66666C22.4551 9.66666 24.4899 10.5095 25.9902 12.0098C27.4905 13.5101 28.3333 15.5449 28.3333 17.6667V27H23V17.6667C23 16.9594 22.719 16.2811 22.219 15.781C21.7189 15.2809 21.0406 15 20.3333 15C19.6261 15 18.9478 15.2809 18.4477 15.781C17.9476 16.2811 17.6667 16.9594 17.6667 17.6667V27H12.3333V17.6667C12.3333 15.5449 13.1762 13.5101 14.6765 12.0098C16.1768 10.5095 18.2116 9.66666 20.3333 9.66666Z" stroke="#090A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 11H1.66667V27H7V11Z" stroke="#090A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.33333 6.99999C5.80609 6.99999 7 5.80608 7 4.33332C7 2.86056 5.80609 1.66666 4.33333 1.66666C2.86058 1.66666 1.66667 2.86056 1.66667 4.33332C1.66667 5.80608 2.86058 6.99999 4.33333 6.99999Z" stroke="#090A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="icon">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28.3333 1.66666L13.6667 16.3333M28.3333 1.66666L19 28.3333L13.6667 16.3333M28.3333 1.66666L1.66666 11L13.6667 16.3333" stroke="#090A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="icon">
                <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.6667 0.99998C29.3898 1.90062 27.9761 2.58946 26.48 3.03998C25.677 2.11666 24.6098 1.46224 23.4227 1.16521C22.2356 0.868194 20.986 0.942907 19.8428 1.37925C18.6995 1.81559 17.7179 2.59252 17.0306 3.60494C16.3434 4.61736 15.9836 5.81643 16 7.03998V8.37331C13.6568 8.43407 11.335 7.9144 9.24134 6.86057C7.14765 5.80675 5.34708 4.25149 3.99999 2.33331C3.99999 2.33331 -1.33334 14.3333 10.6667 19.6666C7.9207 21.5306 4.64954 22.4652 1.33333 22.3333C13.3333 29 28 22.3333 28 6.99998C27.9988 6.62858 27.9631 6.25811 27.8933 5.89331C29.2541 4.5513 30.2144 2.85693 30.6667 0.99998Z" stroke="#090A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>
    </div>
</div>
`;
            this.rendered = true;
        }
        
        static get observedAttributes() { 
            return []; 
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.rendered) return;
        }
    }
);
