const knex = require('knex')
const app = require('../src/app')
const FriendsService = require('../src/friends/friends-service')
const { makeKidsLoadArray} = require('./kids.fixtures')
const { makeFriendsArray, makeSiblingsArray, makeFriendsArrayWithSiblings } = require('./friends.fixtures')

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

    before('clean the table', () => db.raw('TRUNCATE kids_friends, siblings, kids, friends RESTART IDENTITY CASCADE'))
    
    afterEach('cleanup', () => db.raw('TRUNCATE kids_friends, siblings, kids, friends RESTART IDENTITY CASCADE'))

    describe(`Test friends endpoints`, () => {
        const kidsLoadArray = makeKidsLoadArray();
        const friendsArray = makeFriendsArray();
        const friendsReturnArray = makeFriendsArrayWithSiblings();
        const siblingsArray = makeSiblingsArray();

        beforeEach('insert kids and friends', () => {
               
            return db
                .into('kids')
                .insert(kidsLoadArray)
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
        })

        beforeEach('set next friends Id', () => db.raw('SELECT setval(\'public.friends_id_seq\', (SELECT MAX(id) FROM friends));'))

        beforeEach('set next siblings Id', () => db.raw('SELECT setval(\'public.siblings_id_seq\', (SELECT MAX(id) FROM siblings));'))
   
        it(`gets all friends`, () => {
            return supertest(app)
                .get(`/api/friends`)
                .expect(200, friendsReturnArray)
        })

        it(`gets one friend in particular - endpoint`, () => {
            return supertest(app)
                .get('/api/friends/1')
                .expect(200, friendsReturnArray[0])
        })

        it(`creates a friend, responding with 201 and the new friend`, () => {
            const newFriend = {
                kidId: 1,
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
            const newSibling = [{ name: "Pippin Doe"}]
            const returnedSibling = [{ id: 1, name: "Pippin Doe", friend_id: 5}]
            return supertest(app)
                .post('/api/friends')
                .send(newFriend)
                .expect(201)
                .expect(res => {
                    expect(res.body.first_name).to.eql(newFriend.first_name)
                    expect(res.body.last_name).to.eql(newFriend.last_name)
                    expect(res.body.age).to.eql(newFriend.age)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/friends/${res.body.id}`)
                    expect(res.body.siblings).to.eql(newSibling)
                })
                .then(postRes => {
                    supertest(app)
                        .get(`/api/friends/${postRes.body.id}`)
                        .expect(res => {  
                         expect(res.body.siblings).to.eql(returnedSibling)                
                    } )
        })})

        it(`creates a sibling, responding with 200 and the new sibling`, () => {
            const newSibling = {
                name: "Pippin Doe"
            }
            const friend_id = 3
            const returnedSibling = [{ id: 5, name: "Pippin Doe", friend_id: 3}]
            return supertest(app)
                .post(`/api/friends/siblings/${friend_id}`)
                .send(newSibling)
                .expect(200)
                .expect(res => {
                    expect(res.body[0]).to.have.property('id')
                })
                .then(postRes => {
                    supertest(app)
                        .get(`/api/friends/${friend_id}`)
                        .expect(res => {  
                         expect(res.body.siblings).to.eql(returnedSibling)                
                    } )
        })})

        it('responds with 204 and removes the friend', () => {
            const idToRemove = 2
            const expectedFriends =  friendsReturnArray.filter(friend => friend.id !== idToRemove)
            return supertest(app)
                .delete(`/api/friends/${idToRemove}`)
                .expect(204)
                .then(res =>
                    supertest(app)
                        .get(`/api/friends`)
                        .expect(expectedFriends)
                )
        })

        it('responds with 204 and removes the sibling', () => {
            const friendId = 1
            const siblingIdToRemove = 1
            const expectedSiblings =  siblingsArray.filter(sibling => sibling.id !== siblingIdToRemove && sibling.friend_id === friendId )
            return supertest(app)
                .delete(`/api/friends/siblings/${siblingIdToRemove}`)
                .expect(204)
                .then(res =>
                    supertest(app)
                        .get(`/api/friends/${friendId}`)
                        .expect(res => {  
                         expect(res.body.siblings).to.eql(expectedSiblings) 
                        })
                )
        })

    })

})