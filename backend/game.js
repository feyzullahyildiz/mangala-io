class NoValidError extends Error {
    constructor(a) { super(a) }
};
class Game {
    constructor(_roomId, _p1Id, _p2Id, _callback) {
        this.roomId = _roomId;
        this.p1Id = _p1Id;
        this.p2Id = _p2Id;
        this.callback = _callback;
        this.turnPlayerId = _p1Id;
        this.p1rocks = [4, 4, 4, 4, 4, 4, 0];
        this.p2rocks = [4, 4, 4, 4, 4, 4, 0];
        this.setActivePlayer(this.turnPlayerId)
        if (_p1Id === _p2Id) {
            throw new NoValidError('p1Id and p2Id same')
        }
    }
    play(playerid, number) {
        try {
            this.checkValidation(playerid, number);
            this.setActivePlayer(playerid);
            this.playground(number);
            this.heartbeat();
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
    playground(index) {
        const wellValue = this.activePlayerRocks[index];
        if (wellValue === 0) {
            throw new NoValidError('well value 0')
        }
        const total = wellValue + index;
        // console.log('total', total, wellValue, index)
        if (total <= 6) {
            // tek taş hareket ediyor ise
            if (wellValue === 1) {
                this.activePlayerRocks[index] = 0;
                this.activePlayerRocks[index + 1] += 1;
                if(index === 5) {
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
                if(tempIndex >= 7) {
                    // console.log('IF',total,  tempIndex - 7)
                    const passiveWellIndex = tempIndex - 7;
                    this.passivePlayerRocks[passiveWellIndex] += 1;
                    const tempValue = this.passivePlayerRocks[passiveWellIndex];
                    if(tempWellValue === 1 && tempValue % 2 === 0) {
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
            // console.log('ONCE')
            // console.log(this.p1rocks);
            // console.log(this.p2rocks);
            // console.log('SONRA')
            this.nextPlayer();
            return;
        }

    }
    nextPlayer() {
        const newPlayer = this.turnPlayerId === this.p1Id ? this.p2Id : this.p1Id;
        this.setActivePlayer(newPlayer)
    }
    heartbeat() {
        this.callback({
            [this.p1Id]: this.p1rocks,
            [this.p2Id]: this.p2rocks,
            turn: this.turnPlayerId,
        })
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