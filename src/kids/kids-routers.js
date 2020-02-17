const path = require('path')
const express = require('express')
const xss = require('xss')
const KidsService = require('./kids-service')

const kidsRouter = express.Router()
const jsonParser = express.json()

const serializeKid = kid => ({
    id: kid.id,
    first_name: xss(kid.first_name),
    last_name: xss(kid.last_name),
    age: xss(kid.age),
    birthday: xss(kid.birthday),
    allergies: xss(kid.allergies),
    notes: xss(kid.notes)
})

kidsRouter
    .route('/Home')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')

        KidsService.getAllKids(knexInstance)
            .then(kids => {
                console.log('kids', JSON.stringify(kids, null, 2))
                res.json(kids.map(serializeKid))
            }
            )
            .catch(next)

    })

kidsRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const { first_name, last_name, age, birthday, allergies, notes } = req.body
        const newKid = { first_name, last_name, age, birthday, allergies, notes }

        for (const [key, value] of Object.entries(first_name))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

        KidsService.insertKid(
            req.app.get('db'),
            newKid
        )
            .then(kid => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${kid.id}`))
                    .json(serializeKid(kid))
            })
            .catch(next)
    })

kidsRouter
    .route('/getFriends')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        KidsService.getAllKidFriends(knexInstance)
            .then(friends => {
                res.json(friends)
            })
            .catch(next)
    })

kidsRouter
    .route('/getFriends/:kidId')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        KidsService.getKidFriends(knexInstance, req.params.kidId)
            .then(friends => friends.map(friend => {
                return friend.friend_id
            }))
            .then(friends => {
                res.json(friends)
            })
            .catch(next)
    })

kidsRouter
    .route('/:kidId')
    .all((req, res, next) => {
        KidsService.getById(
            req.app.get('db'),
            req.params.kidId
        )
            .then(kid => {
                if (!kid) {
                    return res.status(404).json({
                        error: { message: `Kid doesn't exist` }
                    })
                }
                return res.kid = kid
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        console.log(res.kid)
        res.json(serializeKid(res.kid))
    })
    .patch(jsonParser, (req, res, next) => {
        const { first_name } = req.body
        const kidToUpdate = { first_name, last_name, age, birthday, allergies, notes }

        const numberOfValues = Object.values(first_name).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'first_name'`
                }
            })
        }

        KidsService.updateKid(
            req.app.get('db'),
            req.params.kidId,
            kidToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

    .delete((req, res, next) => {
        KidsService.deleteKid(
            req.app.get('db'),
            req.params.kidId
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = kidsRouter