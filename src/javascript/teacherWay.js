
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
        // Fyll inn kode
    }


    #beregnstatistikk() {
        // Fyll inn kode
    }

    #registrerdeltager() {
        const rules = {
            time: /(\d{0,2}):(\d{0,2}):(\d{0,2})/ug,
            person: /\p{L}{2,}(?:-\p{L}{2,})?/gu,
            startnum: /(?<!:)\b\d{1,3}\b(?!:)/g
        };

        const inputDataElem = this.#regElm.getElementsByTagName("input")[0]; //use queuryselector instead

        const stringInput = inputDataElem.value;

        const tryer = this.#getAttendantInformation(stringInput, rules);
        console.log(tryer);
    }

    #getAttendantInformation(s, rules){
        const assarr = Object
            .entries(rules)
            .map( ([key, value]) => { return [key, s.match(value)] } );

        const res = Object.fromEntries(assarr);

        return res;
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