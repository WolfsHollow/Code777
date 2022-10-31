import { COLORS } from "../data/constants";

export const getQuestionAnswer = (question: number, numPlayers: number, playerHands: Array<Array<string>>, currentPlayer: number) => {
    let [visibleHands, visibleCards] = getVisibleCards(numPlayers, playerHands, currentPlayer)

    // needs:
    switch (question) {
        case 0: {// Q0: #green, #yellow
            let count = [0, 0];
            let options = ['Green', 'Yellow'];
            visibleCards.forEach(card => {
                count = getCardCount(count, card, COLORS.GREEN, COLORS.YELLOW)
            })

            let answer = getHighestCount(options, count);

            return answer;
        }
        case 1: { // Q1: racks w/ sumRack >= 18
            let count = 0;
            visibleHands.forEach(hand => {
                let sum = hand[0][1] + hand[1][1] + hand[2][1];
                if (sum >= 18) {
                    count++;
                }
            })
            return count;
        }
        case 2: {  // Q2: racks w/ sumRack >= 12
            let count = 0;
            visibleHands.forEach(hand => {
                let sum = hand[0][1] + hand[1][1] + hand[2][1];
                if (sum >= 12) {
                    count++;
                }
            })
            return count;
        }
        case 3: { // Q3: racks w/ same number, different color
            let count = 0;

            visibleHands.forEach(hand => {
                let added = false;
                if (hand[0][1] === hand[1][1]) {
                    if (hand[0][0] !== hand[1][0]) {
                        count++;
                        added = true;
                    }
                }
                if (hand[0][1] === hand[2][1] && !added) {
                    if (hand[0][0] !== hand[2][0]) {
                        count++;
                        added = true;
                    }
                }
                if (hand[1][1] === hand[2][1] && !added) {
                    if (hand[1][0] !== hand[2][0]) {
                        count++;
                    }
                }
            })

            return count;
        }
        case 4: {// Q4: racks w/ 3 dif colors
            let count = 0;

            visibleHands.forEach(hand => {
                let colorSet = new Set();
                colorSet.add(hand[0][0]);
                colorSet.add(hand[1][0]);
                colorSet.add(hand[2][0]);
                if (colorSet.size === 3) {
                    count++;
                }
            })

            return count;
        }
        case 5: {// Q5: racks w/ only even or only odd
            let count = 0;

            visibleHands.forEach(hand => {
                if (hand[0][1] % 2 === 0 && hand[1][1] % 2 === 0 && hand[2][1] % 2 === 0) {
                    count++;
                }
                else if (hand[0][1] % 2 === 1 && hand[1][1] % 2 === 1 && hand[2][1] % 2 === 1) {
                    count++;
                }
            })

            return count;
        }
        case 6: {// Q6: racks w/ at least 2 numbers that are the exact same
            let count = 0;

            visibleHands.forEach(hand => {
                let added = false;
                if (hand[0][1] === hand[1][1]) {
                    if (hand[0][0] === hand[1][0]) {
                        count++;
                        added = true;
                    }
                }
                if (hand[0][1] === hand[2][1] && !added) {
                    if (hand[0][0] === hand[2][0]) {
                        count++;
                        added = true;
                    }
                }
                if (hand[1][1] === hand[2][1] && !added) {
                    if (hand[1][0] === hand[2][0]) {
                        count++;
                    }
                }
            })

            return count;
        }
        case 7: { // Q7: racks w/ 3 consecutive numbers
            let count = 0;

            visibleHands.forEach(hand => {
                let handList = [hand[0][1], hand[1][1], hand[2][1]]
                handList.sort((a, b) => a - b)
                if (handList[0] + 1 === handList[1] && handList[0] + 2 === handList[2]) {
                    count++;
                }
            })

            return count;
        }
        case 8: { // Q8: num of colors
            let colorSet = new Set()
            visibleCards.forEach(card => {
                colorSet.add(card[0])
            })
            return colorSet.size;
        }
        case 9: { // Q9: num of colors that you can see at least 3 times
            let count = 0;
            const colorCounts = {};
            visibleCards.forEach(card => {
                colorCounts[card[0]] = (colorCounts[card[0]] || 0) + 1;
                if (colorCounts[card[0]] === 3) {
                    count++;
                }
            });
            return count;
        }
        case 10: { // Q10: how many numbers do you not see at all
            let numbers = [1, 2, 3, 4, 5, 6, 7]
            let numberSet = new Set()
            visibleCards.forEach(card => {
                numberSet.add(card[1])
            })

            let numNotSeen = numbers.filter(number => !numberSet.has(number));

            return numNotSeen.length;
        }
        case 11: { // Q11: how many of the following numbers can you see in total: Gre1, blk5, pnk7
            let count = 0;

            visibleCards.forEach(card => {
                if (card[0] === COLORS.GREEN && card[1] === 1) {
                    count++;
                }
                else if (card[0] === COLORS.BLACK && card[1] === 5) {
                    count++;
                }
                else if (card[0] === COLORS.PINK && card[1] === 7) {
                    count++;
                }
            })

            return count;
        }
        case 12: { // Q12: see more 3s or more pnk6s

            let count = [0, 0];
            let options = ['Threes', 'Pink 6s']
            visibleCards.forEach(card => {
                if (card[1] === 3) {
                    count[0]++;
                }
                else if (card[0] === COLORS.PINK && card[1] === 6) {
                    count[1]++;
                }
            })

            let answer = getHighestCount(options, count);
            return answer;
        }
        case 13: { // Q13: see more gre6 or yel7
            let count = [0, 0];
            let options = ['Green 6s', 'Yellow 7s']
            visibleCards.forEach(card => {
                if (card[0] === COLORS.GREEN && card[1] === 6) {
                    count[0]++;
                }
                else if (card[0] === COLORS.YELLOW && card[1] === 7) {
                    count[1]++;
                }
            })

            let answer = getHighestCount(options, count);
            return answer;
        }
        case 14: { // Q14: see more yel2 or yel7
            let count = [0, 0];
            let options = ['Yellow 2s', 'Yellow 7s']
            visibleCards.forEach(card => {
                if (card[0] === COLORS.YELLOW && card[1] === 2) {
                    count[0]++;
                }
                else if (card[0] === COLORS.YELLOW && card[1] === 7) {
                    count[1]++;
                }
            })

            let answer = getHighestCount(options, count);
            return answer;
        }
        case 15: { // Q15: see more pnk6 gre6
            let count = [0, 0];
            let options = ['Pink 6s', 'Green 6s']
            visibleCards.forEach(card => {
                if (card[0] === COLORS.PINK && card[1] === 6) {
                    count[0]++;
                }
                else if (card[0] === COLORS.GREEN && card[1] === 6) {
                    count[1]++;
                }
            })

            let answer = getHighestCount(options, count);
            return answer;
        }
        case 16: { // Q16: see more blu7 or 7s of dif color
            let count = [0, 0];
            let options = ['Blue 7s', 'Different Colored 7s']
            visibleCards.forEach(card => {
                if (card[1] === 7) {
                    if (card[0] === COLORS.BLUE) {
                        count[0]++;
                    }
                    else count[1]++;
                }
            })

            let answer = getHighestCount(options, count);
            return answer;
        }
        case 17: { // Q17: brown or blue
            let count = [0, 0];
            let options = ['Brown', "Blue"];
            visibleCards.forEach(card => {
                count = getCardCount(count, card, COLORS.BROWN, COLORS.BLUE)
            })

            let answer = getHighestCount(options, count)

            return answer;
        }
        case 18: { // Q18: red or pink
            let count = [0, 0];
            let options = ['Red', "Pink"];
            visibleCards.forEach(card => {
                count = getCardCount(count, card, COLORS.RED, COLORS.PINK)
            })

            let answer = getHighestCount(options, count)

            return answer;
        }
        case 19: { // Q19: green or blue
            let count = [0, 0];
            let options = ['Green', "Blue"];
            visibleCards.forEach(card => {
                count = getCardCount(count, card, COLORS.GREEN, COLORS.BLUE)
            })

            let answer = getHighestCount(options, count)

            return answer;
        }
        case 20: { // Q20: yellow or pink
            let count = [0, 0];
            let options = ['Yellow', "Pink"];
            visibleCards.forEach(card => {
                count = getCardCount(count, card, COLORS.YELLOW, COLORS.PINK)
            })

            let answer = getHighestCount(options, count)

            return answer;
        }

        case 21: { // Q21: black or brown
            let count = [0, 0];
            let options = ['Black', "Brown"];
            visibleCards.forEach(card => {
                count = getCardCount(count, card, COLORS.BLACK, COLORS.BROWN)
            })

            let answer = getHighestCount(options, count)

            return answer;
        }
        case 22: { // Q22: black or red
            let count = [0, 0];
            let options = ['Black', "Red"];
            visibleCards.forEach(card => {
                count = getCardCount(count, card, COLORS.BLACK, COLORS.RED)
            })

            let answer = getHighestCount(options, count)

            return answer;
        }
        default:
            console.error('not a question number');
            return 0;
    }
}

const getVisibleCards = (numPlayers: number, playerHands: Array<Array<string>>, currentPlayer: number) => {
    let players = [0, 1, 2, 3];
    let visibleCards = [];
    let visibleHands = [];

    players = players.filter(item => item !== currentPlayer && item < numPlayers)

    players.forEach(player => {
        visibleCards = [...visibleCards, playerHands[player]]
        visibleHands = [...visibleHands, ...playerHands[player]]
    })

    return [visibleCards, visibleHands]
}

const getCardCount = (count: Array<number>, card: [string, number], value: number | string, value2?: number | string, value3?: number | string) => {
    if (card[0] === value) {
        count[0] += 1;
    }
    if (typeof value2 !== 'undefined') {
        if (card[0] === value2) {
            count[1] += 1;
        }
    }
    if (typeof value3 !== 'undefined') {
        if (card[0] === value3) {
            count[2] += 1;
        }
    }
    return count
}

const getHighestCount = (options: Array<string>, count: Array<number>) => {
    let count0 = count[0];
    let count1 = count[1];

    if (count0 === count1) {
        return "Same Count"
    }
    return count0 > count1 ? options[0] : options[1]
}