
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
        const inputElm = this.#finndeltakerElm.getElementsByTagName("input")[0]; 
        
        var input = inputElm.value;
        
        var deltaker = this.#deltakere.get(input);
        
        
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
        
        var input = inputElm.value;
        
        var deltaker = {
			startnummer: this.#getStartnummer(input),
			navn: this.#getNavn(input),
			slutttid: this.#getSlutttid(input),
		};

		this.#deltakere.set(startnummer, deltaker);
		
      	console.log(deltaker);
    }
    
       // Fyll inn evt. hjelpemetoder
    
    #getStartnummer(input) {
		return input.match(startnummerReg)[0]
	}
    
    #getNavn(input) {
		return this.#formaterNavn(input.match(navnReg));
	}    
    
    #formaterNavn(navnMatcher) {
		const forsteBokstavReg = /(^|-)(\p{L})/gu;
		
		var formatertNavn = '';
		
		navnMatcher.forEach(navn => {
			let lowercased = navn.toLowerCase();
			let uppercased = lowercased.replace(forsteBokstavReg, x => x.toUpperCase())
			
			formatertNavn = formatertNavn.concat(uppercased, ' ');
		});

		return formatertNavn;
	}
	
	#getSlutttid(input) {
		return input.match(tidReg)[0];
	}
    
}

const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);