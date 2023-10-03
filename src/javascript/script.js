"use strict";


document.getElementById("root")
    .getElementsByTagName("button")[0]
    .addEventListener("click", () =>{

        let inputStr = document
            .getElementById("root")
            .getElementsByTagName("input")[0]
            .value;

        const mutableStrObj = { str: inputStr }
        const time = matchTime(mutableStrObj);
        const name = matchName(mutableStrObj);
        const startNum = matchStartNum(mutableStrObj);
        mutableStrObj.str = mutableStrObj.str.replace(/\s/g, "");
       /*
        console.log("time: " + time);
        console.log("name: " + name);
        console.log("startNum: " + startNum);
        console.log("string after remove: " + mutableStrObj.str);

        console.log(mutableStrObj.str.length)
*/
        if(!time || !name || !startNum || mutableStrObj.str.length > 0){
            console.log("fail");
            document.getElementById("root")
                .getElementsByTagName("input")[0]
                .classList
                .add("input:invalid");
        }

    });


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
