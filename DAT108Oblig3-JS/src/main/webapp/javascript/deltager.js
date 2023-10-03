
class DeltagerManager {
	
    #regElm;
    #statElm;
    #finndeltagerElm;
    // Deklarer resterende felt-variabler her
    #deltakere;

    constructor(root) {
        this.#regElm = root.getElementsByClassName("registrering")[0];

        const regButton = this.#regElm.getElementsByTagName("button")[0];
        regButton.addEventListener("click", () => { this.#registrerdeltager() });

        this.#statElm = root.getElementsByClassName("statistikk")[0];
        const statButton = this.#statElm.getElementsByTagName("button")[0];
        statButton.addEventListener("click", () => { this.#beregnstatistikk() });

        this.#finndeltagerElm = root.getElementsByClassName("deltager")[0];
        const deltagerButton = this.#finndeltagerElm.getElementsByTagName("button")[0];
        deltagerButton.addEventListener("click", () => { this.#finndeltager() });
        
        // Fyll evt. inn mer kode
        this.#deltakere = new Map();
    }

    #finndeltager() {
        // Fyll inn kode  
        const resokElm = this.#finndeltagerElm.getElementsByClassName("hidden resultatok")[0];
        const ingenResElm = this.#finndeltagerElm.getElementsByClassName("hidden resultatmangler")[0];
        const inputClassElm = this.#finndeltagerElm.getElementsByClassName("input")[0]; 
        const inputElm = inputClassElm.getElementsByTagName("input")[0];
        
        let input = inputElm.value;
        
       	let deltaker = this.#deltakere.get(input);
        
        
    }


    #beregnstatistikk() {
        // Fyll inn kode        
    }

    #registrerdeltager() {
        const tidReg = /(?:\d{0,2}:){2}\d{0,2}/g;
        const startnummerReg = /\d{1,3}/g;
        const navnReg = /\p{L}{2,}(?:-\p{L}{2,})?/gu;
        
         // Fyll inn kode
        const inputElm = this.#regElm.getElementsByTagName("input")[0]; 
		
		let input = inputElm.value;
     	   
        try {
			this.#testLovligeKarakterer(input);
	
			var startnummer = this.#getStartnummer(input, startnummerReg, tidReg);
			var navn = this.#getNavn(input, navnReg);
			var slutttid = this.#getSlutttid(input, tidReg, startnummerReg);
		} catch(error) {
			inputElm.setCustomValidity(error.message);
			inputElm.reportValidity();
			
			return;
		}
        
        let deltaker = {
			startnummer,
			navn,
			slutttid,
		};

		this.#deltakere.set(startnummer, deltaker);
		
		inputElm.setCustomValidity("");
		
      	console.log(deltaker);
    }
    
       // Fyll inn evt. hjelpemetoder
    
    #testLovligeKarakterer(input) {
		const lovlig = /^[0-9a-zA-Z]+$/g;
		
 		if (!lovlig.test(input)) {
			let ulovlige = input.replaceAll(lovlig, "");
			
			throw new Error("Ulovlige tegn i input: " + ulovlige)
     	}
	}
    
    #getStartnummer(input, startnummerReg, tidReg) {
		let inputUtenSlutttid = input.replace(tidReg, "");
		let results = inputUtenSlutttid.match(startnummerReg);
		
		if (results == null) {
			throw new Error("Angi et gyldig startnummer for deltaker");
		}
		if (results.length > 1) {
			throw new Error("Angi kun et enkelt startnummer");
		}
		
		let nummer = parseInt(results[0]);
		
		if (this.#deltakere.has(nummer)) {
			throw new Error("Startnummer " + nummer + " er allerede i bruk");
		}
		
		return nummer;
	}
    
    #getNavn(input, navnReg) {
		let results = input.match(navnReg);
		
		if (results == null) {
			throw new Error("Angi et gyldig navn for deltaker");
		}
		if (results.length = 1) {
			throw new Error("Deltaker må ha både fornavn og etternavn");
		}
		
		return this.#formaterNavn(results);
	}    
    
    #formaterNavn(navnMatcher) {
		const forsteBokstavReg = /(^|-)(\p{L})/gu;
		
		let formatertNavn = '';
		
		navnMatcher.forEach(navn => {
			let lowercased = navn.toLowerCase();
			let uppercased = lowercased.replace(forsteBokstavReg, x => x.toUpperCase())
			
			formatertNavn = formatertNavn.concat(uppercased, ' ');
		});

		return formatertNavn;
	}
	
	#getSlutttid(input, tidReg) {
		let results = input.match(tidReg);
		
		if (results == null) {
			throw new Error("Angi et gyldig tid for deltaker");
		}
		if (results.length > 1) {
			throw new Error("Angi kun en enkel slutttid");
		}
		if(!this.#erGyldigTid(results[0])) {
			throw new Error("Slutttid må være større enn 0 sekunder");
		}
	
		return this.#formaterTid(results[0]);
	}
	
	#erGyldigTid(inputTid) {
		const nummerReg = /\d{1,2}/g;
		let nummer = inputTid.match(nummerReg);
		
		if (nummer == null) {
			return false;
		}
		
		let gyldig = false
		
		nummer.forEach(x => {
			if(parseInt(x) > 0) {
				gyldig = true;
			}
		})
		
		return gyldig;
	}
	
	#formaterTid(inputTid) {
		if(inputTid.length == 8) {
			return inputTid;
		}
		
		let split1 = inputTid.indexOf(":");
		let split2 = inputTid.lastIndexOf(":");
		
		let timer = inputTid.substring(0, split1 - 1);
		let minutter = inputTid.substring(split1 + 1, split2 - 1);
		let sekunder = inputTid.substring(split2 + 1, inputTid.length - 1);
		
		timer = ("00" + timer).slice(-2);
		minutter = ("00" + timer).slice(-2);
		sekunder = ("00" + timer).slice(-2);
		
		return ('' + timer + ':' + minutter + ':' + sekunder);
	}
    
}
 
const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);