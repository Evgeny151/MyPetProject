const bcrypt = require('bcrypt');
const uuid = require('uuid');

const UserModel = require('../models/user-model');
const MailService = require('../service/mail-service')
const TokenService = require('../service/token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({ email })

        if (candidate) {
            throw ApiError.BadRequest(`Пользовательн с почтовым адресом ${email} уже существует`)
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const activationLinkHash = uuid.v4()
        const activationUrl = `${process.env.API_URL}/api/activate/${activationLinkHash}`

        const user = await UserModel.create({
            email,
            password: hashPassword,
            activationLink: activationLinkHash
        })

        await MailService.sendActivationMail(email, activationUrl)

        const userDto = new UserDto(user)

        const tokens = TokenService.generateToken({ ...userDto })
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink })

        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка активации')
        }

        user.isActivated = true
        await user.save()
    }
}

module.exports = new UserService()