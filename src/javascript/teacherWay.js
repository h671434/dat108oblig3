
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
            const output = root.getElementsByTagName("dl")[0];
            output.classList.remove("hidden");
        }

    }


    #beregnstatistikk() {
        // Fyll inn kode
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

        const outputElem = document.querySelector("div.hidden");
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

        console.log(s.match(validInput));

        return validityCheck
            .filter(a => a.check)
            .map(a => a.message)
            .join(", ");
    }


}

const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);