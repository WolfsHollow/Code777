export const COLORS = {
    BLUE: "blu",
    BLACK: "blk",
    BROWN: "bro",
    GREEN: "grn",
    PINK: "pnk",
    RED: "red",
    YELLOW: "yel",
}


export const TYPE = {
    JOIN: "join",
    LEAVE: "leave",
    MESSAGE: "message",
    SUBSCRIBE: "subscribe",
    LOBBY_INFO: "lobbyInfo",
    GUESS: "guess",
    NEXT_QUESTION: "nextQuestion",
    INITIALIZE_GAME: "initializeGame",
}

export const NUMBERS = [
    [COLORS.GREEN, 1, "2/7/3/9"],
    [COLORS.YELLOW, 2, "3/6/4/8"], [COLORS.YELLOW, 2, "3/8/4/10"],
    [COLORS.BLACK, 3, "4/5/5/7"], [COLORS.BLACK, 3, "4/7/5/9"], [COLORS.BLACK, 3, "4/9/5/11"],
    [COLORS.BROWN, 4, "5/4/6/6"], [COLORS.BROWN, 4, "5/6/6/8"], [COLORS.BROWN, 4, "5/8/6/10"], [COLORS.BROWN, 4, "5/10/6/12"],
    [COLORS.RED, 5, "6/3/7/5"], [COLORS.RED, 5, "6/5/7/7"], [COLORS.RED, 5, "6/7/7/9"], [COLORS.RED, 5, "6/9/7/11"], [COLORS.BLACK, 5, "6/11/7/13"],
    [COLORS.PINK, 6, "7/2/8/4"], [COLORS.PINK, 6, "7/4/8/6"], [COLORS.PINK, 6, "7/6/8/8"], [COLORS.GREEN, 6, "7/8/8/10"], [COLORS.GREEN, 6, "7/10/8/12"], [COLORS.GREEN, 6, "7/12/8/14"],
    [COLORS.PINK, 7, "8/1/9/3"], [COLORS.YELLOW, 7, "8/3/9/5"], [COLORS.YELLOW, 7, "8/5/9/7"], [COLORS.BLUE, 7, "8/7/9/9"], [COLORS.BLUE, 7, "8/9/9/11"], [COLORS.BLUE, 7, "8/11/9/13"], [COLORS.BLUE, 7, "8/13/9/15"]
]

export const DECK: [string, number][] = [
    [COLORS.GREEN, 1],
    [COLORS.YELLOW, 2], [COLORS.YELLOW, 2],
    [COLORS.BLACK, 3], [COLORS.BLACK, 3], [COLORS.BLACK, 3],
    [COLORS.BROWN, 4], [COLORS.BROWN, 4], [COLORS.BROWN, 4], [COLORS.BROWN, 4],
    [COLORS.RED, 5], [COLORS.RED, 5], [COLORS.RED, 5], [COLORS.RED, 5], [COLORS.BLACK, 5],
    [COLORS.PINK, 6], [COLORS.PINK, 6], [COLORS.PINK, 6], [COLORS.GREEN, 6], [COLORS.GREEN, 6], [COLORS.GREEN, 6],
    [COLORS.PINK, 7], [COLORS.YELLOW, 7], [COLORS.YELLOW, 7], [COLORS.BLUE, 7], [COLORS.BLUE, 7], [COLORS.BLUE, 7], [COLORS.BLUE, 7]
]

export const PLAYER = {
    ONE: "PLAYER_ONE",
    TWO: "PLAYER_TWO",
    THREE: "PLAYER_THREE",
    FOUR: "PLAYER_FOUR"
}

export const QUESTION_BANK = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
