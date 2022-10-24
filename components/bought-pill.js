customElements.define('bought-pill',
    class extends HTMLElement {
        constructor() {
            super();
        }
        
        connectedCallback(){
            const shadowRoot = this.attachShadow({mode: 'open'});
            this.shadowRoot.innerHTML = `
    <style>
        .pill{
            /* Auto layout */

            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 4px 8px;
            gap: 2px;

            position: relative;
            height: calc(24px - 2*4px);

            border-radius: 32px;
        }

        .pill-icon{
            height: 16px;
            width: 16px;
        }

        .pill-text{
            /* 4.0 */

            height: 14px;

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
    </style>

    <div class="pill">
        <div class="pill-text" id="text">${this.buys}</div>
        <div class="pill-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4.0001L4 1.33344H12L14 4.0001M2 4.0001V13.3334C2 13.6871 2.14048 14.0262 2.39052 14.2762C2.64057 14.5263 2.97971 14.6668 3.33333 14.6668H12.6667C13.0203 14.6668 13.3594 14.5263 13.6095 14.2762C13.8595 14.0262 14 13.6871 14 13.3334V4.0001M2 4.0001H14M10.6667 6.66675C10.6667 7.37399 10.3858 8.05227 9.88566 8.55237C9.38556 9.05246 8.70729 9.33342 8.00004 9.33342C7.2928 9.33342 6.61452 9.05246 6.11442 8.55237C5.61433 8.05227 5.33337 7.37399 5.33337 6.66675" stroke="#6B4EFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
`;
            this.rendered = true;
        }
        
        static get observedAttributes() { 
            return ['buys']; 
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.rendered) return;
            
            if(name === 'buys' && oldValue !== newValue){
                this.shadowRoot.getElementById('text').textContent = newValue;
            }
        }
        
        get buys(){
            return this.getAttribute('buys');
        }
        
        set buys(value){
            this.setAttribute('buys', value);
        }
    }
);
