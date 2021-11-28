const userService = require('../service/user-service')

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await userService.registration(email, password)

            const maxAge = 30 * 24 * 60 * 60 * 1000

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge,
                httpOnly: true
            })

            return res.json(userData)
        } catch (e) {
            console.log('Registration error', e)
        }
    }

    async login(req, res, next) {
        try {
            
        } catch (error) {
            
        }
    }

    async logout(req, res, next) {
        try {
            
        } catch (error) {
            
        }
    }

    async refresh(req, res, next) {
        try {
            
        } catch (error) {
            
        }
    }

    async getUsers(req, res, next) {
        try {
            res.json(['123', '312312'])
        } catch (error) {
            
        }
    }

    async activate(req, res, next) {
        try {
            res.json(['123', '312312'])
        } catch (error) {
            
        }
    }
}

module.exports = new UserController()