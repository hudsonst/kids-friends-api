const FriendsService = {
    getAllFriends(knex) {
        return knex('friends')
            .then(friends => {
                const friendsWithSiblings = friends.map(friend => {
                    return knex('friends_siblings')
                        .join('siblings', 'siblings.id', 'friends_siblings.sibling_id')
                        .where('friend_id', friend.id)
                        .then(siblings => {
                            const siblingsArr = siblings.map(sibling => { return sibling.sibling_id })
                            friend.siblings = siblingsArr
                            return friend
                        })
                })
                return Promise.all(friendsWithSiblings)
            }
            )
    },


    getFriendSiblings(knex, friend_id) {
        return knex('friends_siblings')
            .join('siblings', 'siblings.id', 'friends_siblings.sibling_id')
            .where('friend_id', friend_id)
            .then(siblings => {
                return siblings.map(sibling => sibling.name )
            })
    },

    insertFriend(knex, newFriend) {
        console.log(newFriend)
        const siblings = newFriend.siblings.map(sibling => {return { name: sibling }})
        delete newFriend.siblings
        return knex
            .insert(newFriend)
            .into('friends')
            .returning('id')
            .then(function (friend_id) {
               // console.log(siblings)
                siblings.map(sibling => {
                  //  console.log('sibling: ' + JSON.stringify(sibling, null, 2))
                    return knex
                        .insert(sibling)
                        .into('siblings')
                        .returning('id')
                        })
                        .then(function (sibling_id) {
                            
                            const f_nid = Number(friend_id) 
                            const s_nid = Number(sibling_id)
                            const updatedEntry = { sibling_id: s_nid, friend_id: f_nid }
                            console.log(`Updated Entry: ${s_nid} ${f_nid}`)

                            return knex('friends_siblings')
                                .insert(updatedEntry)
                                .catch((err) => {
                                    console.log(err)
                                })
                        })
                
                newFriend.id = Number(friend_id)
                newFriend.siblings = siblings.map(sibling => sibling.name)
                return newFriend
            })
    },

    getById(knex, id) {
        return knex('friends').select('*').where('id', id).first()
            .then(friend => {
                return knex('friends_siblings')
                    .join('siblings', 'siblings.id', 'friends_siblings.sibling_id')
                    .where('friend_id', friend.id)
                    .then(siblings => {
                        friend.siblings = siblings.map(sibling => { return sibling.name })
                        return friend
                    })
            })
    },



    deleteFriend(knex, id) {
        return knex('friends')
            .where({ id })
            .delete()
    },

    updateFriend(knex, id, newFriendFields) {
        return knex('friends')
            .where({ id })
            .update(newFriendFields)
    },
}

module.exports = FriendsService;