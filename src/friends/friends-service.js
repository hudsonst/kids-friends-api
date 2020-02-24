const FriendsService = {
    getAllFriends(knex) {
        return knex('friends')
            .then(friends => {
                const friendsWithSiblings = friends.map(friend => {
                    return knex('siblings')
                        .where('friend_id', friend.id)
                        .then(siblings => {
                            friend.siblings = siblings
                            return friend
                        })
                })
                return Promise.all(friendsWithSiblings)
            }
            )
    },


    insertSiblings(knex, newSibling, friend_id) {
        const sibentry = { name: newSibling.name, friend_id: friend_id }
        return knex
            .insert(sibentry)
            .into('siblings')
            .returning('*')
            .catch((err) => {
                console.log(err)
            })
    },


    insertFriend(knex, newFriend) {
        const kidId = newFriend.kidId
        let siblings = []
        if (newFriend.siblings) {
            siblings = newFriend.siblings.map(sibling => { return { name: sibling } })
        }
        delete newFriend.siblings
        delete newFriend.kidId
        return knex
            .insert(newFriend)
            .into('friends')
            .returning('id')
            .then(function (friend_id) {
                //make friend id into an integer
                const f_nid = Number(friend_id)
                return knex.insert({ kid_id: kidId, friend_id: f_nid })
                    .into('kids_friends')
                    .returning(f_nid)
            })
            .then(function (f_nid) {
                //get integer out of returned array
                if (siblings) {
                    f_nid = f_nid[0]
                    siblings.map(sibling => {
                        newSibling = { name: sibling.name, friend_id: f_nid }
                        return knex
                            .insert(newSibling)
                            .into('siblings')
                            .catch((err) => {
                                console.log(err)
                            })
                    })
                }

                newFriend.id = f_nid
                if (siblings) { newFriend.siblings = siblings }
                return newFriend
            })
    },

    getById(knex, id) {
        return knex('friends').select('*').where('id', id).first()
            .then(friend => {
                return knex('siblings')
                    .where('friend_id', id)
                    .then(siblings => {
                        friend.siblings = siblings
                        return friend
                    })
            })
    },



    deleteFriend(knex, id) {
        return knex('friends')
            .where({ id })
            .delete()
    },

    deleteSibling(knex, id) {
        return knex('siblings')
            .where({ id })
            .delete()
    },

    updateFriend(knex, id, newFriendFields, siblings) {
        return knex('friends')
            .update(newFriendFields)
            .where({ id })
            .then(function () {
                siblings.forEach(sibling => {
                    if (sibling.id) {
                        const s_id = sibling.id
                        delete sibling.id
                        return knex('siblings')
                            .update(sibling)
                            .where('siblings.id', s_id)
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                })

            })
    }


}

module.exports = FriendsService;