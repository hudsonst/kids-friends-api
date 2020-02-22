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


    getFriendSiblings(knex, friend_id) {
        return knex('siblings')
            .where('friend_id', friend_id)
            .catch((err) => {
                console.log(err)
            })
    },

    insertFriend(knex, newFriend, kidId) {
        const siblings = newFriend.siblings.map(sibling => { return { name: sibling } })
        delete newFriend.siblings
        return knex
            .insert(newFriend)
            .into('friends')
            .returning('id')
            .then(function (friend_id) {
                //make friend id into an integer
                const f_nid = Number(friend_id)
                console.log(f_nid)
                return knex.insert({ kid_id: kidId, friend_id: f_nid })
                    .into('kids_friends')
                    .returning(f_nid)
            })
            .then(function (f_nid) {
                //get integer out of returned array
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

                newFriend.id = f_nid
                newFriend.siblings = siblings
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

    updateFriend(knex, id, newFriendFields, siblings) {
        return knex('friends')
            .update(newFriendFields)
            .where({ id })
            .then(function () {
               // siblings=JSON.parse(siblings)
                siblings.forEach(sibling => {
                    if (sibling.id) {
                    const s_id = sibling.id
                    delete sibling.id
                    console.log(sibling)
                    return knex('siblings')
                        .update(sibling)
                        .where('siblings.id', s_id)
                        .catch((err) => {
                            console.log(err)
                        })
                    } else {
                        //New sibling!
                    newSibling = { name: sibling, friend_id: id }
                    return knex
                        .insert(newSibling)
                        .into('siblings')
                        .catch((err) => {
                            console.log(err)
                        })
                    }
                })

            })
    }


}

module.exports = FriendsService;