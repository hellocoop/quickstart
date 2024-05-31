class Footer extends HTMLElement {
    constructor() {
      super()
      this.shadow = this.attachShadow({ mode: "open" })
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
                  <svg id="mail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <title>Email</title>
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://verified.coop/@HelloCoop" target="_blank" rel="me">
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Mastodon</title><path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z" fill="currentColor"/></svg>
                </a>
              </li>
              <li>
                <a href="https://www.twitter.com/HelloCoop" target="_blank" aria-label="Go to Twitter page" rel="me">
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" fill="currentColor"/></svg>
                </a>
              </li>
              <li>
                <a href="https://www.threads.net/@hello_coop" target="_blank" rel="me">
                    <svg role="img" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <title>Threads</title>
                        <path d="M17.743 11.123a8.547 8.547 0 0 0-.315-.142c-.185-3.414-2.05-5.368-5.182-5.388h-.042c-1.874 0-3.431.8-4.39 2.255l1.722 1.181c.716-1.087 1.84-1.319 2.669-1.319h.028c1.031.007 1.81.307 2.313.892.367.425.612 1.014.733 1.756a13.176 13.176 0 0 0-2.96-.143c-2.977.172-4.892 1.908-4.763 4.321.065 1.224.675 2.277 1.717 2.965.88.582 2.015.866 3.195.802 1.557-.086 2.778-.68 3.63-1.766.648-.825 1.057-1.894 1.238-3.241.742.448 1.292 1.037 1.596 1.745.517 1.205.547 3.184-1.068 4.797-1.415 1.414-3.116 2.025-5.686 2.044-2.851-.02-5.008-.935-6.41-2.717-1.313-1.67-1.991-4.08-2.016-7.165.025-3.085.703-5.496 2.016-7.165 1.402-1.782 3.558-2.696 6.41-2.717 2.871.02 5.065.94 6.521 2.73.714.879 1.252 1.983 1.607 3.27l2.018-.538c-.43-1.585-1.107-2.95-2.027-4.083C18.43 1.2 15.7.024 12.185 0h-.014C8.66.024 5.963 1.205 4.15 3.51c-1.614 2.05-2.446 4.905-2.474 8.482v.016c.028 3.578.86 6.431 2.473 8.482 1.813 2.305 4.512 3.486 8.022 3.51h.014c3.12-.022 5.319-.839 7.13-2.649 2.371-2.368 2.3-5.336 1.518-7.158-.56-1.307-1.629-2.368-3.09-3.07zm-5.387 5.065c-1.305.074-2.66-.512-2.728-1.766-.05-.93.662-1.969 2.808-2.092.246-.015.487-.021.724-.021.78 0 1.508.075 2.171.22-.247 3.088-1.697 3.59-2.975 3.66z"/>
                    </svg>
                </a>
              </li>
              <li>
                <a href="https://join.slack.com/t/hello-community/shared_invite/zt-1eccnd2np-qJoOWBkHGnpxvBpCTtaH9g" target="_blank" aria-label="Join Slack Community">
                  <svg role="img" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><title>Slack</title><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>
                </a>
              </li>
              <li>
                <a href="https://www.github.com/HelloCoop" target="_blank" aria-label="Go to GitHub page" rel="me">
                  <svg role="img" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@HelloCoop" target="_blank" aria-label="Go to YouTube page" rel="me">
                  <svg role="img" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </li>
            </ul>
          </div>
        </footer>
      `
    }
  
    get nosociallinks() {
      return this.getAttribute("nosociallinks")
    }
  
    static get observedAttributes() {
      return ["nosociallinks"]
    }
  
    connectedCallback() {
      if (window.location.host === "www.hello.coop") {
        const fromHelloRef = this.shadow.getElementById("from-hello")
        fromHelloRef.style.display = "none"
        if (window.innerWidth < 968) {
          const footerRef = this.shadow.getElementById("wc-footer")
          footerRef.style.height = "4rem"
        }
      }
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "nosociallinks") {
        const footerRef = this.shadow.getElementById("wc-footer")
        footerRef.style.height = "3rem"
        footerRef.style.padding = "0"
        const footerContainerRef = this.shadow.getElementById(
          "wc-footer-content-container"
        )
        footerContainerRef.style.justifyContent = "center"
        const socialLinksRef = this.shadow.getElementById("social-links")
        socialLinksRef.style.display = "none"
        const fromHello = this.shadow.getElementById("from-hello")
        fromHello.style.display = "none"
        const linksRef = this.shadow.getElementById("links")
        linksRef.style.width = "100%"
        linksRef.style.justifyContent = "center"
      }
    }
  }
  
  customElements.define("wc-footer", Footer)