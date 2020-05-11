const { appendLog } = require('./log/log')
class NoValidError extends Error {
    constructor(a) { super(a) }
};
class Game {
    // constructor(_roomId, _p1Id, _p2Id, _callback) {
    constructor(_roomId, _callback) {
        this.roomId = _roomId;
        this.callback = _callback;
        this.p1Id = null;
        this.p2Id = null;
        this.turnPlayerId = null;
        this.p1rocks = [4, 4, 4, 4, 4, 4, 0];
        this.p2rocks = [4, 4, 4, 4, 4, 4, 0];
        // this.setActivePlayer(this.turnPlayerId)
        this.isPlayStarted = false;
    }
    getNextPositionV2(index, count, array) {
        const total = (index + count) % 13 ;
        if(total < 6) {
            return {
                wellState: 'me',
                array,
                index: total
            }
        }
        if(total === 6) {
            return {
                wellState: 'store',
                array,
                index: total
            }
        }

        if(total > 6) {
            return {
                wellState: 'rival',
                array: this.p1rocks === array ? this.p2rocks : this.p1rocks,
                index: 6- (13  - total)
            }
        }
        // this.p1rocks;
        // 0, 1, 2, 3, 4, 5, 6
        // ORN index 0 count 5 => me:5
        // ORN index 1 count 5 => store:6
        // ORN index 5 count 1 => store:6       // 5 + 1 = 6 S

        /**
         * index 5 yani p1'in son kuyusu sonrasında depo var.
         * count 1 ise store 6
         * count 2 ise rival 0
         * count 3 ise rival 1
         * count 4 ise rival 2
         * count 5 ise rival 3
         * count 6 ise rival 4
         * count 7 ise rival 5
         * count 8 ise me 0
         */
        
        
        

        // ORN index 2 count 5 => rival:0       // 13 - 7 => 6
        
        // ORN index 5 count 5 => rival:2       // (13 - 10 => 3) ama 2 olmalı
        
        // ORN index 5 count 8 => me:0          // 13 - 13 => 0
        // ORN index 5 count 9 => me:1          // 13 - 14 => -1

    }
    setPlayer(id) {
        if (this.isPlayStarted) {
            throw new NoValidError('game already started')
        }
        if (this.p1Id === null) {
            this.p1Id = id;
            this.turnPlayerId = this.p1Id;
            return;
        } else if (this.p1Id === id) {
            throw new NoValidError('p1Id and p2Id should be different')
        } else if (this.p2Id === null) {
            this.p2Id = id;
            this.isPlayStarted = true;
            this.setActivePlayer(this.p1Id)
            return;
        }
        throw new NoValidError('unexpected error while setting a player')
    }
    play(playerid, index) {
        try {
            this.checkValidation(playerid, index);
            this.setActivePlayer(playerid);
            this.playground(index);
            this.log(playerid, index);
            return {
                [this.p1Id]: this.p1rocks,
                [this.p2Id]: this.p2rocks,
                turn: this.turnPlayerId,
                index
            }
        } catch (error) {
            // this.callback(error)
            // console.log(error.message);
            throw error;
        }
    }
    getState() {
        if (this.isPlayStarted) {
            return {
                data: {
                    [this.p1Id]: this.p1rocks,
                    [this.p2Id]: this.p2rocks,
                },
                turn: this.turnPlayerId,
                state: 'started'
            }
        }
        if (this.p1Id || this.p2Id) {
            return {
                state: 'waiting_for_user',
                data: {
                    [this.p1Id]: this.p1rocks,
                    [this.p2Id]: this.p2rocks,
                },
                turn: this.turnPlayerId,
            }
        }
        if (this.p1Id === null && this.p2Id === null) {
            return {
                state: 'empty'
            }
        }

    }
    log(playerid, wellNumber) {
        const val = `
        ${this.p1Id === playerid ? 'p1' : 'p2'} ${wellNumber} ${playerid}
             ${playerid === this.p2Id ? `${' '.repeat(15 - (wellNumber * 3)) + ' ↓'}` : ''}
        |${this.p2rocks[6].toString().padStart(2, '0')}| ${this.p2rocks.filter((_, i) => i < 6).reverse().map(v => `(${v})`).join('')} |  |
        |  | ${this.p1rocks.filter((_, i) => i < 6).map(v => `(${v})`).join('')} |${this.p1rocks[6].toString().padStart(2, '0')}|
             ${playerid === this.p1Id ? `${' '.repeat(wellNumber * 3) + ' ↑'}` : ''}
        `;
        appendLog(val);
    }
    playerLeaved(pId) {
        this.isPlayStarted = false;
        if (this.p1Id === pId) {
            this.p1Id = null;
        }
        if (this.p2Id === pId) {
            this.p2Id = null;
        }
        if (this.p1Id === null && this.p2Id === null) {

        }
    }
    playground(index) {
        const wellValue = this.activePlayerRocks[index];
        if (wellValue <= 0) {
            throw new NoValidError('well value not valid: ', wellValue);
        }

        let tempWellValue = wellValue;
        // let activeArray = this.activePlayerRocks;
        if (wellValue === 1) {
            const nextPositionData = this.getNextPositionV2(index, 1, this.activePlayerRocks);
            if (nextPositionData.wellState === 'store') {
                this.activePlayerRocks[index] = 0;
                this.activePlayerRocks[nextPositionData.index] += 1;
                return;
            } else if (nextPositionData.wellState === 'me') {
                this.activePlayerRocks[index] = 0;
                // tilki check
                if (this.activePlayerRocks[nextPositionData.index] === 0) {
                    const rivalCrossIndex = 5 - nextPositionData.index;
                    const rivalCrossValue = this.passivePlayerRocks[rivalCrossIndex];
                    if (rivalCrossValue !== 0) {
                        this.activePlayerRocks[6] += rivalCrossValue + 1;
                        this.passivePlayerRocks[rivalCrossIndex] = 0;
                        return this.nextPlayer();
                    }
                }
                this.activePlayerRocks[nextPositionData.index] += 1;
                return this.nextPlayer();
            } else {
                console.log('ELSE OLDU YAW')
            }
            return;
        }
        this.activePlayerRocks[index] = 1;
        tempWellValue--;
        // let oldArray = this.activePlayerRocks;
        // let oldIndex = index;
        // const selectedWellIndex = index;
        let nextIndexValue = 0;
        while (tempWellValue !== 0) {
            nextIndexValue++;
            const nextPositionData = this.getNextPositionV2(index, nextIndexValue, this.activePlayerRocks);
            // const oldArray = nextPositionData.array;
            // const oldIndex = nextPositionData.index;
            nextPositionData.array[nextPositionData.index] += 1;
            // array[index] += 1;
            if (tempWellValue === 1) {
                if (nextPositionData.wellState === 'me') {
                    if (nextPositionData.array[nextPositionData.index] === 1) {

                        const data = this.passivePlayerRocks[5 - nextPositionData.index]
                        if(data !== 0) {
                            nextPositionData.array[nextPositionData.index] = 0;
                            this.passivePlayerRocks[5 - nextPositionData.index] = 0;
                            this.activePlayerRocks[6] += data + 1;
                        }

                    }
                    // tilki check
                } else if (nextPositionData.wellState === 'rival') {
                    if (nextPositionData.array[nextPositionData.index] % 2 === 0) {
                        const data = nextPositionData.array[nextPositionData.index];
                        nextPositionData.array[nextPositionData.index] = 0;
                        this.activePlayerRocks[6] += data;
                    }
                    return this.nextPlayer();

                } else if (nextPositionData.wellState === 'store') {
                    return;
                }
            }
            tempWellValue--
        }
        return this.nextPlayer();

    }
    nextPlayer() {
        const newPlayer = this.turnPlayerId === this.p1Id ? this.p2Id : this.p1Id;
        this.setActivePlayer(newPlayer)
    }
    heartbeat() {
    }
    checkValidation(playerid, number) {
        if (number < 0 || number > 5) {
            throw new NoValidError('number is not in the range');
        }
        if (playerid !== this.turnPlayerId) {
            throw new NoValidError('the turn is not for the user')
        }
    }
    setActivePlayer(playerid) {
        if (playerid === this.p1Id) {
            this.activePlayerRocks = this.p1rocks;
            this.passivePlayerRocks = this.p2rocks;
            this.turnPlayerId = playerid;
            return;
        } else if (playerid === this.p2Id) {
            this.activePlayerRocks = this.p2rocks;
            this.passivePlayerRocks = this.p1rocks;
            this.turnPlayerId = playerid;
            return;
        }
        throw new NoValidError('getPlayerArray player not found')
    }

}
module.exports = Game