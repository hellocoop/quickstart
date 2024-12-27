window.onload = () => {
    // https://www.syfy.com/sites/syfy/files/2024/07/screenshot_2024-07-14_at_10.45.27_am.jpg
    fetch('https://hooks.slack.com/services/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', {
        method: 'POST',
        headers: {
            // CORS blocked when this is set
            // https://stackoverflow.com/questions/45752537/slack-incoming-webhook-request-header-field-content-type-is-not-allowed-by-acce/45752919#45752919
            // 'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: window.location.href + '\n' + 
                'Referrer: ' + (document.referrer || 'N/A')
        })
    })
    .catch(err => console.error(err)) 
}

const backBtn = document.querySelector('#back-btn')
backBtn.addEventListener('click', goBack)
const goBack = () => history.back();