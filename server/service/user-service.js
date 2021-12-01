const bcrypt = require('bcrypt');
const uuid = require('uuid');

const UserModel = require('../models/user-model');
const MailService = require('../service/mail-service')
const TokenService = require('../service/token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

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

        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

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

    async login(email, password) {
        const user = await UserModel.findOne({ email })

        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найдет')
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
        }

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findId(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }

    }
}

module.exports = new UserService()