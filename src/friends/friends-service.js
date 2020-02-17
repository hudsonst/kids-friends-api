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
                return siblings.map(sibling => { return sibling.name })
            })
    },

    insertFriend(knex, newFriend, siblings) {
             return knex.insert(newFriend, siblings)
                .into('friends', 'siblings')
                .returning('*')
                .then(rows => {
                    return rows[0];
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