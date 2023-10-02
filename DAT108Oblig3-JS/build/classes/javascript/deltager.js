
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
    }


    #beregnstatistikk() {
        // Fyll inn kode        
    }

    #registrerdeltager() {
        const tidReg = /(?:\d{0,2}:){2}\d{0,2}/g;
        const startnummerReg = /\d{1,3}/g;
        const navnReg = /\p{L}{2,}(?:-\p{L}{2,})?/gu;
        
         // Fyll inn kode
        var input = this.#regElm.getElementsByTagName("input")[0].value;
        
        var startnummer = input.match(startnummerReg)[0];
        var navn = this.#formaterNavn(input.match(navnReg));
        var slutttid = input.match(tidReg)[0];
        
        var deltaker = {
			startnummer,
			navn,
			slutttid,
		};

		this.#deltakere.set(startnummer, deltaker);
		
      	console.log(deltaker);
    }
    
    // Fyll inn evt. hjelpemetoder
    
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
	
	#validerInput(deltaker) {
		
	}
    
}

const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);