"use strict";


document.getElementById("root")
    .getElementsByTagName("button")[0]
    .addEventListener("click", () =>{

        //input element
        const inputDataElem = document
            .getElementById("root")
            .getElementsByTagName("input")[0];

        //border green
        inputDataElem.setCustomValidity("");

        const mutableStrObj = { str: inputDataElem.value }

        const time = matchTime(mutableStrObj);
        const name = matchName(mutableStrObj);
        const startNum = matchStartNum(mutableStrObj);
        mutableStrObj.str = mutableStrObj.str.replace(/\s/g, "");

        //validity of input
        if(!time || !name || !startNum || mutableStrObj.str.length > 0){
            inputDataElem.setCustomValidity("invalid input");
            return;
        }

        let user = [{id: startNum, name: name, time: time}];

        //data saved to session or empty array
        const prev = JSON.parse(localStorage.getItem("data"));

        user = Array.isArray(prev)? user.concat(prev) : user.push(prev); //idk this is prolly dumb

        user.sort((a, b) => {parseInt(timeToSeconds(a.time)) - parseInt(timeToSeconds(b.timeoppgave ))});

        localStorage.setItem("data", JSON.stringify(user));
    });

function timeToSeconds(timeString) {
    const parts = timeString.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid time format');
    }

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        throw new Error('Invalid time format');
    }

    return hours * 3600 + minutes * 60 + seconds;
}

function matchTime(strObj){
    try {
        const numReg = /\d{1,2}:\d{1,2}:\d{1,2}/ug;
        const match = strObj.str.match(numReg);
        if(match){
            strObj.str = strObj.str.replace(numReg, "");
            return match[0];
        }
        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

function matchName(strObj){
    try{
    const nameMatch = /\p{L}{2,}(?:-\p{L}{2,})?/gu
        const match = strObj.str.match(nameMatch)
        if(match) {
            for (let i = 0; i < 3 ; i++){
                strObj.str = strObj.str.replace(match[i], "");
            }
            return match.slice(0,3);
        }
        return null;
    } catch (e) {
        console.log(e);
        return null;
    }
}

function matchStartNum(strObj) {
    try{
        const digits = /\b\d{1,3}\b/ug
        const match = strObj.str.match(digits);
        if(match){
            strObj.str = strObj.str.replace(digits, "");
            return match[0];
        }
        return null;
    }catch (e) {
        console.error(e);
       return null;
    }
}
