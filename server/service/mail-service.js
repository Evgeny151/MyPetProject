const nodemailer = require('nodemailer')

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: process.env.SMTP_HOST,
            port: process.env.SMP_PORT,
            secure: false,
            auth: {
                type: 'OAuth2',
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.CLEINT_REFRESH_TOKEN,
                accessToken: process.env.CLIENT_ACCESS_TOKEN
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Активация аккаунта на ${process.env.API_URL}`,
            text: '',
            html:
                `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        }, (error, info) => {
            console.log('sendMail info', info);
            if (error) {
                console.log('sendActivationMail error', error)
            } else {
                console.log('Письмо успешно отправлено')
            }
        })
    }
}

module.exports = new MailService()