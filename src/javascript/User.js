"use strict";

class User {
    #number
    #time
    #name
    constructor(name, number, time) {
        this.#name = name;
        this.#number = number;
        this.#time = time;
    }

    getTime(){
        return this.#time;
    }

    getName(){
        return this.#name;
    }

    getName(){
        return this.#name;
    }

    setName(name){
        this.name = name;
    }

    setNumber(number){
        this.#number = number;
    }

    setTime(time){
        this.#time = time;
    }

}