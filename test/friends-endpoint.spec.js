const knex = require('knex')
const app = require('../src/app')
const FriendsService = require('../src/friends/friends-service')
const { makeKidsArray} = require('./kids.fixtures')
const { makeFriendsArray, makeSiblingsArray, makeFriendsSiblingsArray } = require('./friends.fixtures')

describe(`Friends Endpoints`, function () {
    let db

    before('make knex instance', () => {

        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)

    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE kids_friends, friends_siblings, siblings, kids, friends RESTART IDENTITY CASCADE'))
    
    afterEach('cleanup', () => db.raw('TRUNCATE kids_friends, friends_siblings, siblings, kids, friends RESTART IDENTITY CASCADE'))

    describe(`Test friends endpoints`, () => {
        const kidsArray = makeKidsArray();;
        const friendsArray = makeFriendsArray();
        const siblingsArray = makeSiblingsArray();
        const friendsSiblingsArray = makeFriendsSiblingsArray();

        beforeEach('insert kids and friends', () => {
               
            return db
                .into('kids')
                .insert(kidsArray)
                .then(() => {
                    return db
                        .into('friends')
                        .insert(friendsArray)
                })
                .then(() => {
                    return db
                        .into('siblings')
                        .insert(siblingsArray)
                })
                .then(() => {
                    return db
                        .into('friends_siblings')
                        .insert(friendsSiblingsArray)
                })
        })

        beforeEach('set Id', () => db.raw('SELECT setval(\'public.friends_id_seq\', (SELECT MAX(id) FROM friends)+1);'))


        it(`gets one friend in particular - endpoint`, () => {
            return supertest(app)
                .get('/api/friends/1')
                .expect(200, friendsArray[0])
        })

        it(`gets one friend's siblings - endpoint`, () => {
            const friendSiblings = ["Leia Rider", "Paul Rider"]
            const friendId = 1
            return supertest(app)
                .get(`/api/friends/getSiblings/${friendId}`)
                .expect(200, friendSiblings)
        })

        it.only(`creates a friend, responding with 201 and the new friend`, () => {
            before('next ID val', () => db.raw('SELECT setval(\'public.kids_id_seq\', (SELECT MAX(id) FROM kids)+1);'))
            const newFriend = {
                first_name: "Aviya",
                last_name: "Doe",
                pfirst_name: "Bill",
                plast_name: "Doe",
                age: "8",
                birthday: "11/2",
                allergies: "None",
                notes: "Likes Neon green",
                siblings: ["Pippin Doe"]
            }
            return supertest(app)
                .post('/api/friends')
                .send(newFriend)
                .expect(201)
                .expect(res => {
                    expect(res.body.first_name).to.eql(newFriend.first_name)
                    expect(res.body.last_name).to.eql(newFriend.last_name)
                    expect(res.body.age).to.eql(newFriend.age)
                    expect(res.body.siblings).to.eql(newFriend.siblings)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/friends/${res.body.id}`)
                })
                .then(postRes =>
                    supertest(app)
                        .get(`/api/friends/${postRes.body.id}`)
                        .expect(postRes.body)
                )
        })
        it('responds with 204 and removes the friend', () => {
            const idToRemove = 2
            const expectedFriends = friendsArray.filter(friend => friend.id !== idToRemove)
            return supertest(app)
                .delete(`/api/friends/${idToRemove}`)
                .expect(204)
                .then(res =>
                    supertest(app)
                        .get(`/api/friends`)
                        .expect(expectedFriends)
                )
        })

    })

})