
class DeltagerManager {
	
    #regElm;
    #statElm;
    #finndeltagerElm;

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
        
        this.#deltakere = new Map();
    }

    #finndeltager() {
        const resultatOkElm = this.#finndeltagerElm.getElementsByClassName("resultatok")[0];
        const ingenResultatElm = this.#finndeltagerElm.getElementsByClassName("resultatmangler")[0];
        const inputDiv = this.#finndeltagerElm.getElementsByClassName("input")[0]; 
        const inputElm = inputDiv.getElementsByTagName("input")[0];
        
        if(!inputElm.validity.valid) {
			ingenResultatElm.classList.remove("hidden");
			resultatOkElm.classList.remove("hidden");
			
			return;
		}
        
        let input = parseInt(inputElm.value);
        
        if(this.#deltakere.has(input)) {
			let deltaker = this.#deltakere.get(input);

			const outputFelt = resultatOkElm.getElementsByTagName("dd");
		
			outputFelt[0].innerHTML = deltaker.startnummer; 
			outputFelt[1].innerHTML = deltaker.navn; 
			outputFelt[2].innerHTML = deltaker.slutttid; 

			resultatOkElm.classList.remove("hidden");
			ingenResultatElm.classList.add("hidden");
		} else {
			ingenResultatElm.classList.remove("hidden");
			resultatOkElm.add("hidden");
		}      
    }

    #beregnstatistikk() {
		const resultatElm = this.#statElm.getElementsByClassName("resultat")[0];
		const nedregrenseElm = document.getElementById("nedregrense");
		const ovregrenseElm = document.getElementById("ovregrense");
		
		nedregrenseElm.setCustomValidity("");
		ovregrenseElm.setCustomValidity("");
		
		if(!nedregrenseElm.validity.valid) {
			nedregrenseElm.setCustomValidity("Angi et gyldig tidspunkt");
			nedregrenseElm.reportValidity();
			
			return;
		}
		if(!ovregrenseElm.validity.valid) {
			ovregrenseElm.setCustomValidity("Angi et gyldig tidspunkt");
			ovregrenseElm.reportValidity();
			
			return;
		}
		
		let nedregrenseStr = this.#formaterTid(nedregrenseElm.value)
		let ovregrenseStr = this.#formaterTid(ovregrenseElm.value)
		let nedregrense = this.#tidTilSekunder(nedregrenseStr);
		let ovregrense = this.#tidTilSekunder(ovregrenseStr);

		if(nedregrense > ovregrense) {
			nedregrenseElm.setCustomValidity("\"Fra\" verdi må være mindre en \"til\" verdi");
			nedregrenseElm.reportValidity();
			ovregrenseElm.setCustomValidity("\"Til\" verdi må være større en \"fra\" verdi");
			ovregrenseElm.reportValidity();
			resultatElm.classList.add("hidden");
			
			return;
		}
		
		let antall = 0;
		
		this.#deltakere.forEach(deltaker => {
			let deltakertid = this.#tidTilSekunder(deltaker.slutttid);
			
			if(deltakertid > nedregrense && deltakertid < ovregrense) {
				antall++;
			}
		});
		
		const outputFelt = resultatElm.getElementsByTagName("span");
		
		outputFelt[0].innerHTML = antall; 
		outputFelt[1].innerHTML = nedregrenseStr; 
		outputFelt[2].innerHTML = ovregrenseStr; 

		nedregrenseElm.setCustomValidity("");
		ovregrenseElm.setCustomValidity("");
		resultatElm.classList.remove("hidden");
    }
	
	#formaterTid(inputTid) {
		if(inputTid.length == 8) {
			return inputTid;
		}
		
		let split1 = inputTid.indexOf(":");
		let split2 = inputTid.lastIndexOf(":");
		
		let timerUformatert = inputTid.substring(0, split1);
		let minutterUformatert = inputTid.substring(split1 + 1, split1 + 3);;
		let sekunderUformatert = "";

		if(split1 != split2 || split2 == -1) {
			sekunderUformatert = inputTid.substring(split2 + 1, inputTid.length);
		}

		let timer = ("00" + timerUformatert).slice(-2);
		let minutter = ("00" + minutterUformatert).slice(-2);
		let sekunder = ("00" + sekunderUformatert).slice(-2);
		
		return ('' + timer + ':' + minutter + ':' + sekunder);
	}
    
    #tidTilSekunder(tid) {
		let timer = parseInt(tid.substring(0, 2));
		let minutter = parseInt(tid.substring(3, 5));
		let sekunder = parseInt(tid.substring(6, 8));
		
		return (timer * 60 * 60) + (minutter * 60) + sekunder;
	}

    #registrerdeltager() {
        const tidReg = /(?:\d{0,2}:){2}\d{0,2}/g;
        const startnummerReg = /\d{1,3}/g;
        const navnReg = /\p{L}{2,}(?:-\p{L}{2,})?/gu;
        
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
    }

    #testLovligeKarakterer(input) {
		const lovlig = /[0-9a-zA-Z]|:| /g;
		let ulovlige = input.replace(lovlig, "");
		
 		if (ulovlige.length > 0) {
			let tegn = ulovlige.split('').toString();
			
			throw new Error("Ulovlige tegn i input: " + tegn)
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
		if (results.length == 1) {
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
    
}
 
const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);