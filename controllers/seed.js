/* 
    since we can't create labs per-se, and lab is a schema,,
    this seed.js file's only purpose is for generating base stuff for the lab
*/
const mongoose = require('mongoose');
const Lab = require('../model/labRegistry');

function setDates(){
    let dates = [];

    for(let i = 0; i < 7; i++){
        dates.push(new Date(`2025-07-${10 + i}`));
    }

    return dates;
}

async function generateLabs(){
    const labs = [];

    for(let i = 0; i < 5; i++){ // 5 labs only
        labs.push({
            lab_id: i + 1,
            lab_name: "Laboratory " + i.toString() + String.fromCharCode('A'.charCodeAt(0) + i),
            lab_description: `Description for Lab ${i}`,
            lab_sched: setDates(), // spaced dates
            lab_url: `http://localhost:3000/laboratory/${i+1}`,
            seats: Array.from({ length: 35 }, (_, j) => ({
                seat_num: j + 1
            }))
        })
    }

    

    try {
        await Lab.insertMany(labs);
        console.log('success');
    } catch (err) {
        console.error('error: ', err);
    }
}

module.exports = generateLabs;