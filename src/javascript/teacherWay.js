
class DeltagerManager {

    #regElm;
    #statElm;
    #finndeltagerElm;
    // Deklarer resterende felt-variabler her
    #users = new Map();

    constructor(root) {
        this.#regElm = root.getElementsByClassName("registrering")[0];

        const regButton = this.#regElm.getElementsByTagName("button")[0];
        regButton.addEventListener("click", this.#registrerdeltager);

        this.#statElm = root.getElementsByClassName("statistikk")[0];
        const statButton = this.#statElm.getElementsByTagName("button")[0];
        statButton.addEventListener("click", () => { this.#beregnstatistikk() });

        this.#finndeltagerElm = root.getElementsByClassName("deltager")[0];
        const deltagerButton = this.#finndeltagerElm.getElementsByTagName("button")[0];
        deltagerButton.addEventListener("click", () => { this.#finndeltager() });

    }

    #finndeltager() {
        // Fyll inn kode
    }


    #beregnstatistikk() {
        // Fyll inn kode
    }

    #registrerdeltager() {
        const tidReg = /\d{1,2}:\d{1,2}:\d{1,2}/ug;
        const startnummerReg = /\d{1,3}/g;
        const navnReg = /\p{L}{2,}(?:-\p{L}{2,})?/gu;

        const inputDataElem = this.#regElm.getElementsByTagName("input")[0]; //use queuryselector instead


        //retrieve and change data
        const mutableStrObj = { str: inputDataElem.value }
        const time = this.#matchAndReplace(mutableStrObj, tidReg)[0];
        const name = this.#matchAndReplace(mutableStrObj, navnReg, 3);
        const startNum = parseInt(this.#matchAndReplace(mutableStrObj, startnummerReg)[0]);
        mutableStrObj.str = mutableStrObj.str.replace(/\s/g, "");

        //validity of input
        const validationCheck = [
            {check: !time, message: "missing time"},
            {check: !name, message: "missing name"},
            {check: !startNum, message: "missing starting number"},
            {check: name.length < 2, message: "There has to atleast be 2 names"},
            {check: this.#checkValidInputChars(inputDataElem.value), message: "input contains invalid chars"},
            {check: this.#users.has(startNum), message: "user with the same start number already exsists"}
        ];
        const errors = validationCheck
            .filter( a => a.check)
            .map( a => a.message)
            .join(", ");
        if(errors){
            inputDataElem.setCustomValidity(errors);
            return;
        } else if(mutableStrObj.str.length > 0) {
            console.log(mutableStrObj.str);
            inputDataElem.setCustomValidity("overflow of data in input");
            return
        }

        //add user to map
        const user = {id: startNum, name: name, time: time};
        this.#users.set(startNum, user)
        console.log(this.#users);
        inputDataElem.value = "";

        //find the fastest
        const fastestElem = this.#regElm.getElementsByTagName("div")[1];
        let fastestTime = Infinity;
        let fastestTimeFormatted = "00:00:00";

        this.#users.forEach( user => {
            if(this.#timeToSeconds(user.time) < fastestTime){
                fastestTime = this.#timeToSeconds(user.time);
                fastestTimeFormatted = user.time;
            }
        });

        fastestElem.getElementsByTagName("span")[0].value = "fuck you cunt";
        fastestElem.classList.remove("hidden");

        inputDataElem.setCustomValidity("");
    }


    #timeToSeconds(timeString) {
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


    #checkValidInputChars(str){
        const regex = /^[0-9a-zA-Z]+$/g;
        return str.match(regex) !== null;
    }

    #matchAndReplace(strObj, regex, numMatches = 1){
        try {
            const match = strObj.str.match(regex);
            if(match && match.length >= numMatches){
                const replacedMatches = match.slice(0, numMatches).join("");
                strObj.str = strObj.str.replace(replacedMatches, "");
                return match.slice(0, numMatches);
            } else if( match.length <= numMatches){
                strObj.str = strObj.str.replace(regex, "");
                return match.slice(0, match.length);
            } else {
                return null;
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}

const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);