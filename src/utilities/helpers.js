import { DECK } from "../data/constants";

export const getRandomNumber = (size) => {
    return Math.floor(Math.random() * size);
}

export const shuffle = () => {
    for (let i = DECK.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [DECK[i], DECK[j]] = [DECK[j], DECK[i]];
    }
    console.log(DECK)
    return DECK;
}