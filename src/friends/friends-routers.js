const path = require('path')
const express = require('express')
const xss = require('xss')
const FriendsService = require('./friends-service')

const friendsRouter = express.Router()
const jsonParser = express.json()

const serializeFriend = friend => ({
    id: friend.id,
    first_name: xss(friend.first_name),
    last_name: xss(friend.last_name),
    pfirst_name: xss(friend.pfirst_name),
    plast_name: xss(friend.plast_name),
    age: xss(friend.age),
    birthday: xss(friend.birthday),
    allergies: xss(friend.allergies),
    notes: xss(friend.notes)
})

const serializeSibling = sibling => ({
    id: sibling.id,
    name: xss(sibling.name)
})

friendsRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const { first_name, last_name, pfirst_name, plast_name, age, birthday, allergies, notes, siblings } = req.body
        const newFriend = { first_name, last_name, pfirst_name, plast_name,age, birthday, allergies, notes }

        for (const [key, value] of Object.entries(first_name))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

        FriendsService.insertFriend(
            req.app.get('db'),
            newFriend,
            siblings
        )
            .then(friend => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${friend.id}`))
                    .json(serializeFriend(friend))
            })
            .catch(next)
    })


friendsRouter
    .route('/getSiblings/:friendId')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        FriendsService.getFriendSiblings(knexInstance, req.params.friendId)
            /*.then(siblings => siblings.map(sibling => {
                return sibling.sibling_id
            }))*/
            .then(siblings => {
                console.log('siblings', JSON.stringify(siblings, null, 2))
                res.json(siblings)
            })
            .catch(next)
    })

friendsRouter
    .route('/:friendId')
    .all((req, res, next) => {
        FriendsService.getById(
            req.app.get('db'),
            req.params.friendId
        )
            .then(friend => {
                if (!friend) {
                    return res.status(404).json({
                        error: { message: `Friend doesn't exist` }
                    })
                }
                res.friend = friend
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        console.log(res.friend)
        res.json(serializeFriend(res.friend))
    })
    .patch(jsonParser, (req, res, next) => {
        const { first_name } = req.body
        const friendToUpdate = { first_name, last_name, pfirst_name, plast_name, age, birthday, allergies, notes }

        const numberOfValues = Object.values(first_name).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'first_name'`
                }
            })
        }

        FriendsService.updateFriend(
            req.app.get('db'),
            req.params.friendId,
            friendToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

    .delete((req, res, next) => {
        FriendsService.deleteFriend(
            req.app.get('db'),
            req.params.friendId
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = friendsRouter