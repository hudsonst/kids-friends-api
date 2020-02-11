const knex = require('knex')
const app = require('../src/app')
const KidsService = require('../src/kids/kids-service')
const { makeKidsArray } = require('./kids.fixtures')
const { makeFriendsArray, makeKidsFriendsArray } = require('./friends.fixtures')

describe(`Kids Endpoints`, function () {
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

    describe(`getAllKids()`, () => {
        const kidsArray = makeKidsArray();
        const friendsArray = makeFriendsArray();
        const kidsFriendsArray = makeKidsFriendsArray();

        beforeEach('insert kids', () => {
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
                        .into('kids_friends')
                        .insert(kidsFriendsArray)
                })
        })

        it.only(`resolves all kids from 'kids' table - endpoint`, () => {
            return supertest(app)
                .get('/api/kids/Home')
                .expect(200, kidsArray)
        }
        )


    it(`gets all one Kid's friends - service`, () => {
        const kidsFriends = [{ "friend_id": 1 }, { "friend_id": 2 }]
        return KidsService.getKidFriends(db, 1)
            .then(actual => {
                expect(actual).to.eql(kidsFriends)
            }
            )
    })

    it(`gets all friends - endpoint`, () => {
        return supertest(app)
        .get('/api/kids/getFriends')
        .expect(200, kidsFriendsArray)
    })

    it(`gets one kid in particular - endpoint`, () => {
        return supertest(app)
        .get('/api/kids/1')
        .expect(200, kidsArray[0])
    })

    it(`gets one kid's friends- endpoint`, () => {
        const kidFriends = [1,2]
        const kidId = 1
        return supertest(app)
        .get(`/api/kids/getFriends/${kidId}`)
        .expect(200, kidFriends)
    })
/*})

describe(`POST /api/kids`, () => {
    const testKids = makeKidsArray();
    beforeEach('insert malicious kid', () => {
      return db
        .into('kids')
        .insert(testKids)
    })*/

    it(`creates an kid, responding with 201 and the new kid`, () => {
      const newKid =  {
        first_name: "Aviya",
        last_name: "Doe",
        age: "8",
        birthday: "11/20",
        allergies: "None",
        notes: "Likes Neon green"
    }
      return supertest(app)
        .post('/api/kids')
        .send(newKid)
        .expect(201)
        .expect(res => {
          expect(res.body.first_name).to.eql(newKid.first_name)
          expect(res.body.last_name).to.eql(newKid.last_name)
          expect(res.body.age).to.eql(newKid.age)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/kids/${res.body.id}`)
        })
        .then(postRes =>
          supertest(app)
            .get(`/api/kids/${postRes.body.id}`)
            .expect(postRes.body)
        )
    })
    it('responds with 204 and removes the kid', () => {
        const idToRemove = 2
        const expectedKids = kidsArray.filter(kid => kid.id !== idToRemove)
        return supertest(app)
          .delete(`/api/kids/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/kids/Home`)
              .expect(expectedKids)
          )
      })

  })

})