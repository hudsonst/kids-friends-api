const KidsService = {
    getAllKids(knex) {
        return knex.select('*').from('kids')
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
         knex.raw('SELECT setval(\'public.kids_id_seq\', (SELECT MAX(id) FROM kids)+1);')
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