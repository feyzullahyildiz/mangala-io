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
    getNextPosition(num, array) {
        if (num < 0) {
            throw new NoValidError('num is not in the range: ', num);
        }
        if (array === this.activePlayerRocks) {
            if (num <= 4) {
                return { index: num + 1, array, wellState: 'me' }
            } else if (num === 5) {
                return { index: 6, array, wellState: 'store' }
            } else if (num === 6) {
                return { index: 0, array: this.passivePlayerRocks, wellState: 'rival' }
            }
            throw new NoValidError('num is not in the range: ', num);

        } else if (array === this.passivePlayerRocks) {
            if (num <= 4) {
                return { index: num + 1, array: this.passivePlayerRocks, wellState: 'rival' }
            } else if (num === 5) {
                return { index: 0, array, wellState: 'me' }
            }
        }
        throw new NoValidError('num is not in the range: ', num);
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
    play(playerid, number) {
        try {
            this.checkValidation(playerid, number);
            this.setActivePlayer(playerid);
            this.playground(number);
            this.log(playerid, number);
            return {
                [this.p1Id]: this.p1rocks,
                [this.p2Id]: this.p2rocks,
                turn: this.turnPlayerId,
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
            }
        }
        if (this.p1Id === null && this.p2Id === null) {
            return {
                state: 'empty'
            }
        }

    }
    log(playerid, number) {
        
    }
    playerLeaved(pId) {
        this.isPlayStarted = false;
        if (this.p1Id === pId) {
            console.log('playerLeaved this.p1Id: ', pId);
            this.p1Id = null;
        }
        if (this.p2Id === pId) {
            console.log('playerLeaved this.p2Id: ', pId);
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
        let activeArray = this.activePlayerRocks;
        if (wellValue === 1) {
            const nextPositionData = this.getNextPosition(index, activeArray);
            if (nextPositionData.wellState === 'store') {
                this.activePlayerRocks[index] = 0;
                this.activePlayerRocks[nextPositionData.index] += 1;
                return;
            } else if (nextPositionData.wellState === 'me') {
                this.activePlayerRocks[index] = 0;
                if (this.activePlayerRocks[nextPositionData.index] === 0) {
                    const rivalCrossIndex = 5 - nextPositionData.index;
                    const rivalCrossValue = this.passivePlayerRocks[rivalCrossIndex];

                    this.activePlayerRocks[6] += rivalCrossValue + 1;
                    this.passivePlayerRocks[rivalCrossIndex] = 0;
                    return this.nextPlayer();
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
        let oldArray = this.activePlayerRocks;
        let oldIndex = index;
        while (tempWellValue !== 0) {
            const nextPositionData = this.getNextPosition(oldIndex, oldArray);
            oldArray = nextPositionData.array;
            oldIndex = nextPositionData.index;
            nextPositionData.array[nextPositionData.index] += 1;
            // array[index] += 1;
            if (tempWellValue === 1) {
                if (nextPositionData.wellState === 'me') {
                    if (nextPositionData.array[nextPositionData.index] === 1) {

                        nextPositionData.array[nextPositionData.index] = 0;
                        const data = this.passivePlayerRocks[5 - nextPositionData.index]
                        this.passivePlayerRocks[5 - nextPositionData.index] = 0;
                        this.activePlayerRocks[6] += data + 1;
                        
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
        const total = wellValue + index;
        // console.log('total', total, wellValue, index)
        if (total <= 6) {
            // tek taş hareket ediyor ise
            if (wellValue === 1) {
                this.activePlayerRocks[index] = 0;
                this.activePlayerRocks[index + 1] += 1;
                if (index === 5) {
                    return;
                }
            } else {
                let tempWellValue = wellValue;
                let tempIndex = index;
                this.activePlayerRocks[tempIndex] = 0;
                while (tempWellValue !== 0) {
                    this.activePlayerRocks[tempIndex] += 1;
                    tempIndex++;
                    tempWellValue--;
                }
            }
            this.nextPlayer();
            return
        } else if (total === 7) {
            let tempWellValue = wellValue;
            let tempIndex = index;
            this.activePlayerRocks[tempIndex] = 0;
            while (tempWellValue !== 0) {
                this.activePlayerRocks[tempIndex] += 1;
                tempIndex++;
                tempWellValue--;
            }

        } else if (total > 7) {
            let tempIndex = index;
            let tempWellValue = wellValue;
            // console.log(this.activePlayerRocks)
            this.activePlayerRocks[tempIndex] = 0;
            while (tempWellValue !== 0) {
                if (tempIndex >= 7) {
                    // console.log('IF',total,  tempIndex - 7)
                    const passiveWellIndex = tempIndex - 7;
                    this.passivePlayerRocks[passiveWellIndex] += 1;
                    const tempValue = this.passivePlayerRocks[passiveWellIndex];
                    if (tempWellValue === 1 && tempValue % 2 === 0) {
                        // console.log('HOPPALA', this.passivePlayerRocks[passiveWellIndex]);
                        this.passivePlayerRocks[passiveWellIndex] = 0;
                        this.activePlayerRocks[6] += tempValue;
                    }
                } else {
                    // console.log('ELSE')
                    this.activePlayerRocks[tempIndex] += 1;
                }
                tempWellValue--;
                tempIndex++;

            }
            this.nextPlayer();
            return;
        }

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