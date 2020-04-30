//const sendgridAPIKey = "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"
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        from: 'sanketfarande2@gmail.com',
        to: email,
        subject: 'Thanks for joining in',
        text: `Hi ${name},
        Welcome to the Task Manager App.Hope so you would enjoy with it.
        For any queries feel free to contact . `
    })
}

const goodByeEmail = (email, name) => {
    sgMail.send({
        to: "sanketfarande210@gmail.com",
        from: "sanketfarande2@gmail.com",
        subject: "Good Bye!",
        text: `GoodBye ${name}. 
        Hope we served you well.Please feel free to provide your suggestions.`

    })
}
module.exports = {
    sendWelcomeEmail,
    goodByeEmail
}