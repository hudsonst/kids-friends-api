const KidsService = {
    getAllKids(knex) {
      return  knex('kids')
            .then(kids => {
                const kidsWithFriends = kids.map(kid => {
                    return knex('kids_friends')
                        .join('friends', 'friends.id', 'kids_friends.friend_id')
                        .where('kid_id', kid.id)
                        .then(friends => {
                            const friendsArr = friends.map(friend => {return friend.friend_id})
                            kid.friends = friendsArr
                            return kid
                        })
                })
                return Promise.all(kidsWithFriends)
            }
            ) 
    },

    getAllKidFriends(knex) {
        return knex.select('*').from('kids_friends')
    },

    getKidFriends(knex, kid_id) {
        return knex('kids_friends')
            .join('kids', 'kids.id', 'kids_friends.kid_id')
            .select('kids_friends.friend_id')
            .where('kids.id', kid_id)
    },

    insertKid(knex, newKid) {
        return knex
            .insert(newKid)
            .into('kids')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex.from('kids').select('*').where('id', id).first()
        .then(kid => {
                return knex('kids_friends')
                .join('friends', 'friends.id', 'kids_friends.friend_id')
                .where('kid_id', kid.id)
                .then(friends => {
                    const friendsArr = friends.map(friend => { return friend.friend_id })
                    kid.friends = friendsArr
                    return kid
                })
            })
    },

    deleteKid(knex, id) {
        return knex('kids')
            .where({ id })
            .delete()
    },

    updateKid(knex, id, newKidFields) {
        return knex('kids')
            .where({ id })
            .update(newKidFields)
    },
}

module.exports = KidsService;