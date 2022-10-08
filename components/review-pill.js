customElements.define('review-pill',
    class extends HTMLElement {
        constructor() {
            super();
        }
        
        connectedCallback(){
            const shadowRoot = this.attachShadow({mode: 'open'});
            this.shadowRoot.innerHTML = `
    <style>
        .pill{
            /* Review Pill */


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
        <div class="pill-text" id="text">${this.review}</div>
        <div class="pill-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.33334 2.66666H2.66668C2.31305 2.66666 1.97392 2.80714 1.72387 3.05719C1.47382 3.30724 1.33334 3.64637 1.33334 4V13.3333C1.33334 13.687 1.47382 14.0261 1.72387 14.2761C1.97392 14.5262 2.31305 14.6667 2.66668 14.6667H12C12.3536 14.6667 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3333 13.687 13.3333 13.3333V8.66666M12.3333 1.66666C12.5986 1.40145 12.9583 1.25245 13.3333 1.25245C13.7084 1.25245 14.0681 1.40145 14.3333 1.66666C14.5986 1.93188 14.7476 2.29159 14.7476 2.66666C14.7476 3.04174 14.5986 3.40145 14.3333 3.66666L8.00001 10L5.33334 10.6667L6.00001 8L12.3333 1.66666Z" stroke="#6B4EFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
`;
            this.rendered = true;
        }
        
        static get observedAttributes() { 
            return ['review']; 
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.rendered) return;
            
            if(name === 'review' && oldValue !== newValue){
                this.shadowRoot.getElementById('text').textContent = newValue;
            }
        }
        
        get review(){
            return this.getAttribute('review');
        }
        
        set review(value){
            this.setAttribute('review', value);
        }
    }
);
