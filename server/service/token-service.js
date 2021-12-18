require('dotenv').config()
const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')

class TokenService {
    generateTokens(payload) {
        console.log('TokenService payload', payload);
        const accessToken = jwt.sign(payload, `${process.env.JWT_ACCESS_TOKEN}`, {
            expiresIn: '20s'
        })

        const refreshToken = jwt.sign(payload, `${process.env.JWT_REFRESH_TOKEN}`, {
            expiresIn: '30d'
        })

        console.log('TokenService accessToken', accessToken);
        console.log('TokenService refreshToken', refreshToken);
 
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        console.log('process -', process.env.JWT_ACCESS_SECRET);
        try {
            const userData = jwt.verify(token, `${process.env.JWT_ACCESS_TOKEN}`)
            console.log('validateAccessToken userData', userData);
            return userData
        } catch (error) {
            console.log('validateAccessToken error', error);
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, `${process.env.JWT_REFRESH_TOKEN}`)
            return userData
        } catch (error) {
            return null
        }
    }


    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({ user: userId })

        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await tokenModel.create({ user: userId, refreshToken })

        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({ refreshToken })
        return tokenData
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({ refreshToken })
        return tokenData
    }
}

module.exports = new TokenService()