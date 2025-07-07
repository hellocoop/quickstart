class Footer extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = `
        <head>
          <meta charset="utf-8"/>
        </head>
        <style>
          #wc-footer{
            height: 3rem;
            color: white;
            font-family: sans-serif;
            font-size: 0.86rem;
            background-color: #303030;
          }
  
          #links,  #from-hello{
            opacity: 0.72;
          }
  
          #social-links li{
            opacity: 0.72;
          }
  
          #social-links li:hover{
            opacity: 0.92;
          }
  
          #links, #social-links{
            height: 1.6rem;
          }
  
          #links, #social-links, #from-hello {
            width: 40%
          }
  
          #from-hello {
            width: 20%
          }
  
          #from-hello{
            text-align: center;
          }
  
          #links, #social-links {
            gap: 0 1rem;
          }        
  
          #links {
            justify-content: flex-start;
          }
  
          #social-links {
            justify-content: flex-end;
          }        
  
          #social-links li{
            margin-top: 0.18rem;
          }
  
          {
            display: flex;
            align-items: center;
            justify-content: center;
          }
  
          #wc-footer-content-container{
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 64rem;
            padding: 0 1rem;
            margin: auto;
          }
  
          #wc-footer ul{
            list-style: none;
            display: flex;
            align-items: center;
            padding: 0;
            margin: 0;
            line-height: normal;
          }
  
          #wc-footer svg {
            height: 1rem;
          }
  
          #mail-icon{
            height: 1.28rem !important;
          }
  
          #wc-footer a{
            text-decoration: none;
            color: white;
          }
  
          #wc-footer a:hover{
            text-decoration: underline;
          }
        </style>
  
        <style media="screen and (max-width: 968px)">
          #links, #social-links{
            text-align: center;
          }
  
          #wc-footer{
            padding: 0.6rem 0;
            height: 5rem;
          }
  
          #links, #social-links, #from-hello{
            width: 100%;
          }
  
          #links{
            justify-content: center;
          }
  
          #wc-footer-content-container{
            flex-direction: column;
          }
  
          #social-links{
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 3px !important;
          }
  
          #social-links li{
            margin-top: 0;
          }
        </style>
  
        <style media="screen and (max-width: 400px)">
            #wc-footer{
              font-size: 0.76rem;
            }
  
            #wc-footer svg {
              height: 0.86rem;
            }
  
            #mail-icon {
              height: 1.08rem !important;
            }
  
            #links, #social-links {
              gap: 0 0.6rem;
            }        
        </style>
  
        <style media="screen and (max-width: 320px)">
            #links, #social-links{
              width: 100%;
              justify-content: center;
            }
  
            #social-links{
              margin-top: -0.42rem !important;
            }
        </style>
  
        <footer id="wc-footer">
          <div id="wc-footer-content-container">
            <ul id="links">
              <li><a href="https://www.hello.coop/terms-of-service.html" target="_blank">Terms of Service</a></li>
              <li><a href="https://www.hello.coop/privacy-policy.html" target="_blank">Privacy Policy</a></li>
              <li><a href="https://www.hello.coop/trademark-disclaimer.html" target="_blank">Trademark Disclaimer</a></li>
            </ul>
  
            <div id="from-hello">
                <a href="https://www.hello.coop" target="_blank">
                    <span>Hello Identity Co-op</span>
                </a>
            </div>
  
            <ul id="social-links">
              <li>
                <a href="mailto:contact@hello.coop?subject=Hellō Inquiry" aria-label="Send an email">
                  <img src="https://cdn.hello.coop/images/mail-icon.svg" alt="Mail" width="16" height="16" />
                </a>
              </li>
              <li>
                <a href="https://www.twitter.com/HelloCoop" target="_blank" aria-label="Go to Twitter page" rel="me">
                  <img src="https://cdn.hello.coop/images/twitter-icon.svg" alt="Twitter" height="16" width="16"/>
                  </a>
                  </li>
                  <li>
                <a href="https://www.threads.net/@hello_coop" target="_blank" rel="me">
                    <img src="https://cdn.hello.coop/images/threads-icon.svg" alt="Threads" height="16" width="16"/>
                </a>
              </li>
              <li>
                <a href="https://join.slack.com/t/hello-community/shared_invite/zt-1eccnd2np-qJoOWBkHGnpxvBpCTtaH9g" target="_blank" aria-label="Join Slack Community">
                  <img src="https://cdn.hello.coop/images/slack-icon.svg" alt="Slack" height="16" width="16"/>
                </a>
              </li>
              <li>
                <a href="https://www.github.com/HelloCoop" target="_blank" aria-label="Go to GitHub page" rel="me">
                  <img src="https://cdn.hello.coop/images/github-icon.svg" alt="GitHub" height="16" width="16"/>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@HelloCoop" target="_blank" aria-label="Go to YouTube page" rel="me">
                  <img src="https://cdn.hello.coop/images/youtube-icon.svg" alt="YouTube" height="16" width="16"/>
                </a>
              </li>
            </ul>
          </div>
        </footer>
      `;
	}

	get nosociallinks() {
		return this.getAttribute('nosociallinks');
	}

	static get observedAttributes() {
		return ['nosociallinks'];
	}

	connectedCallback() {
		if (window.location.host === 'www.hello.coop') {
			const fromHelloRef = this.shadow.getElementById('from-hello');
			fromHelloRef.style.display = 'none';
			if (window.innerWidth < 968) {
				const footerRef = this.shadow.getElementById('wc-footer');
				footerRef.style.height = '4rem';
			}
		}
	}

	attributeChangedCallback(name) {
		if (name === 'nosociallinks') {
			const footerRef = this.shadow.getElementById('wc-footer');
			footerRef.style.height = '3rem';
			footerRef.style.padding = '0';
			const footerContainerRef = this.shadow.getElementById('wc-footer-content-container');
			footerContainerRef.style.justifyContent = 'center';
			const socialLinksRef = this.shadow.getElementById('social-links');
			socialLinksRef.style.display = 'none';
			const fromHello = this.shadow.getElementById('from-hello');
			fromHello.style.display = 'none';
			const linksRef = this.shadow.getElementById('links');
			linksRef.style.width = '100%';
			linksRef.style.justifyContent = 'center';
		}
	}
}

customElements.define('wc-footer', Footer);
