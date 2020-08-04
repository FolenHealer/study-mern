const {Router} = require('express')
const config = require('config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post('/register',
    [
        check('email', 'NOT CORRECT EMAIL').isEmail(),
        check('password', 'MIN LENGTH OF PASSWORD 6 SYMBOLS')
            .isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'NOT A CORRECT DATE FOR REGISTER'
                })
            }

            const {email, password} = req.body
            const candidate = await User.findOne({email})
            if (candidate) {
                return res.status(400).json({message: 'THIS FOLEN ALREADY HERE'})
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({email, password: hashedPassword})

            await user.save()

            res.status(201).json({message: 'FOLEN IS CREATED'})

        } catch (e) {
            res.status(500).json({message: 'SOMETHING NOT OKAY'})
        }
    })
router.post('/login',
    [
        check('email', 'ENTER A CORRECT EMAIL').normalizeEmail().isEmail(),
        check('password', 'ENTER A PASSWORD').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'NOT A CORRECT DATE FOR LOGIN'
                })
            }
            const {email, password} = req.body

            const user = await User.findOne({email})

            if (!user) {
                return res.status(400).json({message: 'THIS USER IS NOT EXISTS'})
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({message: 'WRONG PASS'})
            }
            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )
            res.json({token, userId: user.id})
        } catch (e) {
            res.status(500).json({message: 'SOMETHING NOT OKAY'})
        }
    })

module.exports = router