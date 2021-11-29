const { validationResult } = require('express-validator')

const ApiError = require('../exceptions/api-error')
const userService = require('../service/user-service')

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('Ошибка при валидации', errors.array())
                )
            }

            const { email, password } = req.body
            const userData = await userService.registration(email, password)

            // TODO вынести в константу
            const maxAge = 30 * 24 * 60 * 60 * 1000

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge,
                httpOnly: true
            })

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await userService.login(email, password)

            // TODO вынести в константу
            const maxAge = 30 * 24 * 60 * 60 * 1000

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge,
                httpOnly: true
            })

            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const token = await userService.logout(refreshToken)

            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (error) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            
        } catch (error) {
            next(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            res.json(['123', '312312'])
        } catch (error) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            res.json(['123', '312312'])
        } catch (error) {
            next(e)
        }
    }
}

module.exports = new UserController()