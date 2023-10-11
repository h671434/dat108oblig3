"use strict";

class DeltagerManager {

    #regElm;
    #statElm;
    #finndeltagerElm;
    // Deklarer resterende felt-variabler her
    #users = new Map();

    constructor(root) {
        this.#regElm = root.getElementsByClassName("registrering")[0];

        const regButton = this.#regElm.getElementsByTagName("button")[0];
        regButton.addEventListener("click", () => {this.#registrerdeltager()});

        this.#statElm = root.getElementsByClassName("statistikk")[0];
        const statButton = this.#statElm.getElementsByTagName("button")[0];
        statButton.addEventListener("click", () => { this.#beregnstatistikk() });

        this.#finndeltagerElm = root.getElementsByClassName("deltager")[0];
        const deltagerButton = this.#finndeltagerElm.getElementsByTagName("button")[0];
        deltagerButton.addEventListener("click", () => { this.#finndeltager() });

    }

    #finndeltager() {
        const root = document.querySelector("html body div#root fieldset.deltager");
        root.getElementsByTagName("p")[0].classList.add("hidden");
        root.getElementsByTagName("dl")[0].classList.add("hidden");


        const inputElem = root.getElementsByTagName("input")[0];
        const inputValue = inputElem.value;
        const startnum = inputValue.match(/\d{1,3}/g)[0];
        const user = this.#users.get(startnum);

        if(!startnum || !user){
            inputElem.setCustomValidity("invalid input");
            root.getElementsByTagName("p")[0].classList.remove("hidden");
        }else {
            inputElem.setCustomValidity("");
            const output = document.getElementsByTagName("dl")[0];
            output.classList.remove("hidden");
            const outputTable = output.querySelector("dd");
            outputTable[0].textContent = user.startnum;
            outputTable[1].textContent = user.person;
            outputTable[2].textContent = user.time;
        }

    }


    #beregnstatistikk() {
        //due to issues with the locale the format of the input tag has been changed to text type.
        //when using input time I cannot force a 24 hour format!
        const root = document.querySelector("html body div#root fieldset.statistikk");
        const fromElem = root.getElementsByTagName("input")[0];
        const toElem = root.getElementsByTagName("input")[1];

        const timeReg = /(\d{0,2}):(\d{0,2}):(\d{0,2})/ug;

        const fromTime = fromElem.value.match(timeReg)[0];
        const toTime = toElem.value.match(timeReg)[0];

        const errors = this.#validateStat(fromTime, toTime);

        if(errors){
            fromElem.setCustomValidity(errors);
            toElem.setCustomValidity(errors);
        }else{
            const fromTimeSec = this.#timeToSec(fromTime);
            const toTimeSec = this.#timeToSec(toTime);
            let nRacers = 0;
            this.#users.forEach(user => {
                let userTimeSec = this.#timeToSec(user.time);
                if (userTimeSec < toTimeSec && userTimeSec > fromTimeSec){
                    nRacers++;
                }
            });

            const hidden = root.getElementsByTagName("p")[0];
            hidden.classList.remove("hidden");
            hidden.getElementsByTagName("span")[0].textContent = nRacers.toString();
            hidden.getElementsByTagName("span")[1].textContent = fromTime;
            hidden.getElementsByTagName("span")[2].textContent = toTime;

        }

    }

    #validateStat(s1, s2){
        const errors =[
            {check: !s1, message: "from time not entered"},
            {check: !s2, message: "to time not entered"},
            {check: this.#timeToSec(s2) - this.#timeToSec(s1) <= 0, message: "from time must be less than to time"},
        ];

        return errors
            .filter(a => a.check)
            .map(a => a.message)
            .join(", ");

    }

    #registrerdeltager() {
        const rules = {
            time: {
                regex: /(\d{0,2}):(\d{0,2}):(\d{0,2})/ug,
                parse: x => x.split(':').map(y => y.padStart(2, '0')).join(":"),
                //limit: 1
            },
            person: {
                regex: /\p{L}{2,}(?:-\p{L}{2,})?/gu,
                parse: x => x,
                //limit: 3
            },
            startnum: {
                regex: /(?<!\d|:)\b\d{1,3}\b(?!:|\d)/g,
                parse: x => parseInt(x),
                //limit: 1
            }
        };

        const root = document.getElementsByClassName("registrering")[0];
        const inputDataElem = document.querySelector(".registrering > div:nth-child(2) > input:nth-child(1)");
        let stringInput = inputDataElem.value;
        const user = this.#getAttendantInformation(stringInput, rules);

        //catch errors in input
        const errors = this.#validate(user, stringInput);
        if(errors){
            inputDataElem.setCustomValidity(errors);
            return;
        }

        //return frame to green
        inputDataElem.setCustomValidity("");
        this.#users.set(user.startnum, user);

        const fastestUser = Array.from(this.#users.values()).reduce((fastest, user) =>
            this.#timeToSec(user.time) < this.#timeToSec(fastest.time) ? user : fastest
        );

        const outputElem = root.getElementsByTagName("div")[1];
        outputElem.classList.remove("hidden");
        outputElem.getElementsByTagName("span")[0].textContent = "" + fastestUser.time;
    }

    #timeToSec(s){
        return s.split(':').reduce((acc, val, index) => acc + parseInt(val) * (index === 0 ? 3600 : index === 1 ? 60 : 1), 0);
    }

    #getAttendantInformation(s, rules){
        const assoc = Object.entries(rules)
            .map(([key, { parse, regex }]) => { //limit as third param in destruct
                const matches = [...s.matchAll(regex)]
                    //.slice(0, limit);
                return [key, matches.map(([match]) => parse(match)).join(' ')];
            });
        return Object.fromEntries(assoc);
    }

    #validate(user, s){
        const validInput = /[^0-9a-zA-Z:\s-]/g;

        const validityCheck = [
            {check: !user.time, message: "missing time"},
            {check: user.time.split(" ").length > 1, message: "only one time can be entered"},
            {check: !user.person, message: "missing name"},
            {check: !user.startnum, message: "missing starting number"},
            {check: user.startnum.split(" ").length > 1, message: "only one start number can be entered"},
            {check: user.person.split(" ").length < 2, message: "There has to atleast be 2 names"},
            {check: user.person.split(" ").length > 3, message: "There's a maximum of 3 names"},
            {check: s.match(validInput), message: "input contains invalid chars"},
            {check: this.#users.has(user.startnum), message: "user with the same start number already exsists"}
        ];


        return validityCheck
            .filter(a => a.check)
            .map(a => a.message)
            .join(", ");
    }


}

const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);