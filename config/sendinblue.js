const sdk = require('sib-api-v3-sdk')
const client = sdk.ApiClient.instance
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY
const api = new sdk.AccountApi()

const APIInstance = new sdk.TransactionalEmailsApi();
const EmailInstance = new sdk.SendSmtpEmail();

/**
 * @param {Object} data
 * @param {Function} callback
 */
const send = (data, callback = undefined) => {
    if (!['html', 'plain'].includes(data.type)) throw Error('Invalid email type')
    EmailInstance.subject = data.subject
    EmailInstance.sender = data.sender
    EmailInstance.to = data.to

    if (data.type === 'plain')
        EmailInstance.textContent = data.content
    if (data.type === 'html')
        EmailInstance.htmlContent = data.content

    APIInstance.sendTransacEmail(EmailInstance).then(
        function (result) {
            if(callback) callback(null, result);
        },
        function (error) {
            if(callback) callback(error, null);
        }
    );
}

// api.getAccount().then(function (data) {
//     console.log('Sendinblue client configured successfully')
// }, function (error) {
//     throw new Error(error.toString())
// })

module.exports = {
    send
}
