/* 
    since we can't create labs per-se, and lab is a schema,,
    this seed.js file's only purpose is for generating base stuff for the lab
*/
const mongoose = require('mongoose');
const User = require('../model/userRegistry'); // Adjusted path
const Lab = require('../model/labRegistry');   // Adjusted path

async function setDates() {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        dates.push(new Date(`2025-07-${10 + i}`));
    }
    return dates;
}

async function generateLabs() {
    const labNames = [];
    for (let i = 0; i < 5; i++) {
        labNames.push("Laboratory " + (i + 1) + String.fromCharCode('A'.charCodeAt(0) + i));
    }

    try {
        const existingLabs = await Lab.find({ lab_name: { $in: labNames } });
        if (existingLabs.length > 0) {
            console.log('⚠️ Labs already exist. Skipping insertion.');
            return;
        }

        const labs = [];
        for (let i = 0; i < 5; i++) {
            labs.push({
                lab_id: i + 1,
                lab_name: labNames[i],
                lab_description: `Description for Lab ${i + 1}`,
                lab_sched: await setDates(),
                lab_url: `http://localhost:3000/laboratory/${i + 1}`,
                seats: Array.from({ length: 35 }, (_, j) => ({
                    seat_num: j + 1
                }))
            });
        }

        await Lab.insertMany(labs);
        console.log(`${labs.length} labs inserted successfully.`);
    } catch (err) {
        console.error('Error inserting labs:', err);
    }
}

async function insertSampleUsers() {
    const sampleUsers = [
        {
            first_name: 'John',
            last_name: 'Doe',
            role: 'STUDENT',
            email: 'john.doe@dlsu.edu.ph',
            password: 'password123',
            description: 'BS Computer Science student.',
        },
        {
            first_name: 'Jane',
            last_name: 'Smith',
            role: 'TECHNICIAN',
            email: 'jane.smith@dlsu.edu.ph',
            password: 'password123',
            description: 'Lab technician at CS department.'
        },
        {
            first_name: 'Admin',
            last_name: 'User',
            role: 'STUDENT',
            email: 'admin.user@dlsu.edu.ph',
            password: 'password123'
        }
    ];

    let insertedCount = 0;

    for (const userData of sampleUsers) {
        const existingUser = await User.findOne({ email: userData.email }).exec();
        if (!existingUser) {
            await User.create(userData);
            insertedCount++;
            console.log(`✅ Inserted user: ${userData.email}`);
        } else {
            console.log(`🟨 User already exists: ${userData.email}`);
        }
    }

    console.log(`${insertedCount} new user(s) inserted.`);
}

async function runSeeder() {
    try {
        await generateLabs();
        await insertSampleUsers();
    } catch (err) {
        console.error('Seeder failed:', err);
    }
}

module.exports = runSeeder;