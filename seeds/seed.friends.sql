INSERT INTO friends (first_name, last_name, age, pfirst_name, plast_name, birthday, allergies, notes)
    VALUES
    ('Steve', 'Rider', 8, 'Patty', 'Rider', '12-23', 'None', 'Too cool for school'),
    ('Kayla', 'Rider', 8, 'Patty', 'Rider', '3-4','', 'Likes to sleep in'),
    ('Darren', 'Hawk', 10, 'Ramona', 'Obama-Hawk', '2-3', 'None', 'Roblox Buddy'),
    ('Pema', 'Cling', 10, 'Robert', 'Jordan', '5-23', 'None', 'Likes Purple');

INSERT INTO kids_friends (kid_id, friend_id) 
    VALUES
    (1,1),
    (1,2),
    (2,2),
    (2,3),
    (2,4),
    (3,1),
    (3,2);

INSERT INTO siblings (name, friend_id)
    VALUES
    ('Leia Rider', 1),
    ('Paul Rider', 1),
    ('Leia Rider', 2),
    ('Paul Rider', 2);