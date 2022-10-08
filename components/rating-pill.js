customElements.define('rating-pill',
    class extends HTMLElement {
        constructor() {
            super();
        }
        
        connectedCallback(){
            const shadowRoot = this.attachShadow({mode: 'open'});
            this.shadowRoot.innerHTML = `
    <style>
        .pill{
            /* Rating Pill */


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
        <div class="pill-text" id="text">${this.rating}</div>
        <div class="pill-icon">
            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.00001 1.33333L10.06 5.50667L14.6667 6.18L11.3333 9.42667L12.12 14.0133L8.00001 11.8467L3.88001 14.0133L4.66668 9.42667L1.33334 6.18L5.94001 5.50667L8.00001 1.33333Z" fill="#6B4EFF" stroke="#6B4EFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
`;
            this.rendered = true;
        }
        
        static get observedAttributes() { 
            return ['rating']; 
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.rendered) return;
            
            if(name === 'rating' && oldValue !== newValue){
                this.shadowRoot.getElementById('text').textContent = newValue;
            }
        }
        
        get rating(){
            return this.getAttribute('rating');
        }
        
        set rating(value){
            this.setAttribute('rating', value);
        }
    }
);
