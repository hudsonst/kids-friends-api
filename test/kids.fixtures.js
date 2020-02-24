function makeKidsLoadArray() {
    return [
        {
            id: 1,
            first_name: "Sammy",
            last_name: "Doe",
            age: 8,
            birthday: "12-23",
            allergies: "None",
            notes: "Likes Annies Mac and Cheese"
        },
        {
            id: 2,
            first_name: "Joe",
            last_name: "Doe",
            age: 13,
            birthday: "3-3",
            allergies: "Wheat",
            notes: "Into Dinosaurs"
        },
        {
            id: 3,
            first_name: "Stacy",
            last_name: "Doe",
            age: 10,
            birthday: "1-3",
            allergies: "None",
            notes: "Hates Annies Mac and Cheese"
        }
    ]
}
function makeKidsReturnArray() {
    return [
        {
            id: 1,
            first_name: "Sammy",
            last_name: "Doe",
            age: 8,
            birthday: "12-23",
            allergies: "None",
            notes: "Likes Annies Mac and Cheese",
            friends: [ 1, 2 ],
        },
        {
            id: 2,
            first_name: "Joe",
            last_name: "Doe",
            age: 13,
            birthday: "3-3",
            allergies: "Wheat",
            notes: "Into Dinosaurs",
            friends: [ 2, 3, 4 ],
        },
        {
            id: 3,
            first_name: "Stacy",
            last_name: "Doe",
            age: 10,
            birthday: "1-3",
            allergies: "None",
            notes: "Hates Annies Mac and Cheese",
            friends: [ 1, 2 ],
        }
    ]
}

module.exports = {
    makeKidsLoadArray,
    makeKidsReturnArray
}