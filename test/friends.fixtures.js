function makeFriendsArray() {
    return [

        {
            id: 1,
            first_name: "Steve",
            last_name: "Rider",
            age: "8",
            pfirst_name: "Patty",
            plast_name: "Rider",
            birthday: "12-23",
            allergies: "None",
            notes: "Too cool for school",
        },
        {
            id: 2,
            first_name: "Kayla",
            last_name: "Rider",
            age: "8",
            pfirst_name: "Patty",
            plast_name: "Rider",
            birthday: "12-23",
            allergies: "None",
            notes: "Likes to sleep in"
        },
        {
            id: 3,
            first_name: "Darren",
            last_name: "Hawk",
            age: "9",
            pfirst_name: "Ramona",
            plast_name: "Obama-Hawk",
            birthday: "2-3",
            allergies: "None",
            notes: "Roblox Buddy"
        },
        {
            id: 4,
            first_name: "Pema",
            last_name: "Cling",
            age: "10",
            pfirst_name: "Robert",
            plast_name: "Jordan",
            birthday: "5-23",
            allergies: "None",
            notes: "Likes purple"
        },
    ]

}

function makeSiblingsArray() {
    return [
        {id: 1, name: "Leia Rider" },
        {id: 2, name: "Paul Rider"}
    ]
}

function makeKidsFriendsArray() {
    return [
        { kid_id: 1, friend_id: 1 },
        { kid_id: 1, friend_id: 2 },
        { kid_id: 2, friend_id: 2 },
        { kid_id: 2, friend_id: 3 },
        { kid_id: 2, friend_id: 4 },
        { kid_id: 3, friend_id: 1 },
        { kid_id: 3, friend_id: 2 }
    ]
}

function makeFriendsSiblingsArray() {
    return [
        { sibling_id: 1, friend_id: 1 },
        { sibling_id: 2, friend_id: 1 },
        { sibling_id: 1, friend_id: 2 },
        { sibling_id: 2, friend_id: 2 }
    ]
}

module.exports = {
    makeFriendsArray,
    makeKidsFriendsArray,
    makeSiblingsArray,
    makeFriendsSiblingsArray
}