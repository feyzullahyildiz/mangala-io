console.clear();
console.log(new Date())
const expect = require('chai').expect;
const Game = require('../game')
const initWellArray = () => [4, 4, 4, 4, 4, 4, 0];
const getValidNewGame = () => {
    // return new Game('r1', 'p1', 'p2', () => { })
    const game = new Game('r1', () => { });
    game.setPlayer('p1')
    game.setPlayer('p2')
    return game;
}
let game = getValidNewGame();
beforeEach(() => {
    game = getValidNewGame();
})
describe('Testing Game', function () {
    it('should test getNextPositionV2', async () => {
        expect(1).to.eq(1);
        expect(game.getNextPositionV2(0, 1, game.p1rocks)).to.deep.equal({
            wellState: 'me',
            array: game.p1rocks,
            index: 1
        });
        expect(game.getNextPositionV2(0, 4, game.p1rocks)).to.deep.equal({
            wellState: 'me',
            array: game.p1rocks,
            index: 4
        });
        expect(game.getNextPositionV2(0, 5, game.p1rocks)).to.deep.equal({
            wellState: 'me',
            array: game.p1rocks,
            index: 5
        });
        expect(game.getNextPositionV2(5, 8, game.p1rocks)).to.deep.equal({
            wellState: 'me',
            array: game.p1rocks,
            index: 0
        });
        expect(game.getNextPositionV2(5, 9, game.p1rocks)).to.deep.equal({
            wellState: 'me',
            array: game.p1rocks,
            index: 1
        });
        // expect(game.getNextPositionV2(5, 2, game.p1rocks)).to.deep.equal({
        //     wellState: 'rival',
        //     array: game.p2rocks,
        //     index: 0
        // });
        // expect(game.getNextPositionV2(5, 5, game.p1rocks)).to.deep.equal({
        //     wellState: 'rival',
        //     array: game.p1rocks,
        //     index: 2
        // });
        expect(game.getNextPositionV2(5, 1, game.p1rocks)).to.deep.equal({
            wellState: 'store',
            array: game.p1rocks,
            index: 6
        });
        expect(game.getNextPositionV2(5, 2, game.p1rocks)).to.deep.equal({
            wellState: 'rival',
            array: game.p2rocks,
            index: 0
        });
        expect(game.getNextPositionV2(5, 3, game.p1rocks)).to.deep.equal({
            wellState: 'rival',
            array: game.p2rocks,
            index: 1
        });
        expect(game.getNextPositionV2(5, 4, game.p1rocks)).to.deep.equal({
            wellState: 'rival',
            array: game.p2rocks,
            index: 2
        });
        expect(game.getNextPositionV2(5, 5, game.p1rocks)).to.deep.equal({
            wellState: 'rival',
            array: game.p2rocks,
            index: 3
        });
        expect(game.getNextPositionV2(5, 6, game.p1rocks)).to.deep.equal({
            wellState: 'rival',
            array: game.p2rocks,
            index: 4
        });
        expect(game.getNextPositionV2(5, 7, game.p1rocks)).to.deep.equal({
            wellState: 'rival',
            array: game.p2rocks,
            index: 5
        });
        expect(game.getNextPositionV2(5, 8, game.p1rocks)).to.deep.equal({
            wellState: 'me',
            array: game.p1rocks,
            index: 0
        });
    })
    it('should defined', async () => {

    })
    // it('should pass getNextPosition ', async () => {
    //     expect(game.getNextPosition(0, game.activePlayerRocks)).deep.equal({
    //         index: 1,
    //         array: game.activePlayerRocks,
    //         wellState: 'me'
    //     });
    //     expect(game.getNextPosition(1, game.activePlayerRocks)).deep.equal({
    //         index: 2,
    //         array: game.activePlayerRocks,
    //         wellState: 'me'
    //     });
    //     expect(game.getNextPosition(4, game.activePlayerRocks)).deep.equal({
    //         index: 5,
    //         array: game.activePlayerRocks,
    //         wellState: 'me'
    //     });
    //     expect(game.getNextPosition(5, game.activePlayerRocks)).deep.equal({
    //         index: 6,
    //         array: game.activePlayerRocks,
    //         wellState: 'store'
    //     });
    //     expect(game.getNextPosition(6, game.activePlayerRocks)).deep.equal({
    //         index: 0,
    //         array: game.passivePlayerRocks,
    //         wellState: 'rival'
    //     });
    //     expect(game.getNextPosition(0, game.passivePlayerRocks)).deep.equal({
    //         index: 1,
    //         array: game.passivePlayerRocks,
    //         wellState: 'rival'
    //     });
    //     expect(game.getNextPosition(3, game.passivePlayerRocks)).deep.equal({
    //         index: 4,
    //         array: game.passivePlayerRocks,
    //         wellState: 'rival'
    //     });
    //     expect(game.getNextPosition(5, game.passivePlayerRocks)).deep.equal({
    //         index: 0,
    //         array: game.activePlayerRocks,
    //         wellState: 'me'
    //     });
    // })
    it('should basic start', async () => {
        expect(game.p1rocks).deep.equal(initWellArray());
        game.play('p1', 1);
        expect(game.p1rocks).deep.equal([4, 1, 5, 5, 5, 4, 0]);
        expect(game.activePlayerRocks).deep.equal(initWellArray());
        expect(game.turnPlayerId === 'p2');

        // check turn of user
        expect(() => game.play('p1', 1)).to.throw();
    })
    it('should basic start', async () => {
        game.play('p1', 0);
        expect(game.p1rocks).deep.equal([1, 5, 5, 5, 4, 4, 0]);
        expect(game.turnPlayerId).equal('p2')
    })
    it('should p1 joker', async () => {
        game.play('p1', 3);
        expect(game.p1rocks).deep.equal([4, 4, 4, 1, 5, 5, 1]);
        expect(game.p1rocks).equal(game.activePlayerRocks)

        expect(game.turnPlayerId).equal('p1');
        expect(game.p1rocks).equal(game.activePlayerRocks)
        expect(game.p2rocks).not.equal(game.activePlayerRocks)

        expect(() => game.play('p2', 0)).to.throw()
        game.play('p1', 3);
        expect(game.p1rocks).deep.equal([4, 4, 4, 0, 6, 5, 1]);
        expect(() => game.play('p1', 0)).to.throw()

    });
    it('should pass p2', async () => {
        game.play('p1', 3);
        game.play('p1', 5);
        expect(game.p1rocks).deep.equal([4, 4, 4, 1, 5, 1, 2]);
        expect(game.p2rocks).deep.equal([5, 5, 5, 4, 4, 4, 0]);
        expect(game.turnPlayerId).equal(game.p2Id)
        expect(() => game.play('p1', 0)).to.throw();
    })
    it('should pass p1 makes p2 wells even', async () => {
        game.play('p1', 3);
        game.play('p1', 5);
        expect(game.p1rocks).deep.equal([4, 4, 4, 1, 5, 1, 2]);
        expect(game.p2rocks).deep.equal([5, 5, 5, 4, 4, 4, 0]);
        // expect(game.turnPlayerId).equal(game.p2Id)
        game.play('p2', 5);
        // expect(game.turnPlayerId).equal(game.p1Id)
        expect(game.p1rocks).deep.equal([5, 5, 4, 1, 5, 1, 2]);
        expect(game.p2rocks).deep.equal([5, 5, 5, 4, 4, 1, 1]);
        // expect(game.p1rocks).deep.equal([4, 4, 4, 1, 5, 1, 2]);
        game.play('p1', 5)
        expect(game.p1rocks).deep.equal([5, 5, 4, 1, 5, 0, 3]);
        // console.log('ONCE')
        game.play('p1', 4)
        // console.log('SONRA')
        expect(game.p1rocks).deep.equal([5, 5, 4, 1, 1, 1, 10]);
        // expect(game.p2rocks).deep.equal([6, 6, 5, 4, 4, 1, 1]);
        expect(game.p2rocks).deep.equal([6, 0, 5, 4, 4, 1, 1]);
        expect(game.turnPlayerId).equal(game.p2Id)

    })
    it('should pass p1 makes p2 TILKI', async () => {
        game.play('p1', 3);
        game.play('p1', 5);
        game.play('p2', 5);
        game.play('p1', 5)
        game.play('p1', 4)
        expect(game.p2rocks).deep.equal([6, 0, 5, 4, 4, 1, 1]);
        expect(game.p1rocks).deep.equal([5, 5, 4, 1, 1, 1, 10]);
        expect(game.turnPlayerId).equal(game.p2Id)

        game.play('p2', 5);
        expect(game.p2rocks).deep.equal([6, 0, 5, 4, 4, 0, 2]);
        expect(game.p1rocks).deep.equal([5, 5, 4, 1, 1, 1, 10]);
        expect(game.turnPlayerId).equal(game.p2Id)

        game.play('p2', 3);
        expect(game.p2rocks).deep.equal([6, 0, 5, 1, 5, 1, 3]);
        expect(game.p1rocks).deep.equal([5, 5, 4, 1, 1, 1, 10]);
        expect(game.turnPlayerId).equal(game.p2Id)

        game.play('p2', 5);
        expect(game.p2rocks).deep.equal([6, 0, 5, 1, 5, 0, 4]);
        expect(game.p1rocks).deep.equal([5, 5, 4, 1, 1, 1, 10]);
        expect(game.turnPlayerId).equal(game.p2Id)

        game.play('p2', 2);
        expect(game.p2rocks).deep.equal([6, 0, 1, 2, 6, 1, 5]);
        expect(game.p1rocks).deep.equal([5, 5, 4, 1, 1, 1, 10]);
        expect(game.turnPlayerId).equal(game.p2Id)

        game.play('p2', 5);
        expect(game.p2rocks).deep.equal([6, 0, 1, 2, 6, 0, 6]);
        expect(game.p1rocks).deep.equal([5, 5, 4, 1, 1, 1, 10]);
        expect(game.turnPlayerId).equal(game.p2Id)

        game.play('p2', 0);
        expect(game.p2rocks).deep.equal([1, 1, 2, 3, 7, 0, 12]);
        expect(game.p1rocks).deep.equal([0, 5, 4, 1, 1, 1, 10]);
        expect(game.turnPlayerId).equal(game.p1Id)



    })

    it('a scenerio that is not tilki', async () => {
        game.play('p1', 3)
        game.play('p1', 5)

        game.play('p2', 3)
        game.play('p2', 5)

        game.play('p1', 5)
        game.play('p1', 2)
        game.play('p1', 5)
        game.play('p1', 4)

        game.play('p2', 5)
        game.play('p2', 0)

        game.play('p1', 5)
        game.play('p1', 4)

        game.play('p2', 2)

        game.play('p1', 1)

        expect(game.p2rocks).deep.equal([0, 7, 0, 3, 6, 0, 9])
        expect(game.p1rocks).deep.equal([0, 1, 2, 3, 1, 1, 15])
        expect(game.turnPlayerId).equal('p2')

        game.play('p2', 3);
        expect(game.p2rocks).deep.equal([0, 7, 0, 1, 7, 1, 9])
        expect(game.p1rocks).deep.equal([0, 1, 2, 3, 1, 1, 15])


    })

    it('should reverse tilki', async () => {
        game.play('p1', 2)

        game.play('p2', 2)

        game.play('p1', 3)

        game.play('p2', 3)

        game.play('p1', 1)

        game.play('p2', 3)

        game.play('p1', 4)

        game.play('p2', 2)

        game.play('p1', 2)

        game.play('p2', 2)

        game.play('p1', 3)

        game.play('p2', 3)

        game.play('p1', 4)

        game.play('p2', 1)

        game.play('p1', 0)

        game.play('p2', 2)

        game.play('p1', 0)

        game.play('p2', 1)

        expect(game.p2rocks).deep.equal([6, 0, 0, 3, 9, 8, 4])
        expect(game.p1rocks).deep.equal([0, 3, 2, 0, 2, 9, 2])
        game.play('p1', 5)
        expect(game.p2rocks).deep.equal([7, 1, 1, 4, 10, 0, 4])
        expect(game.p1rocks).deep.equal([0, 3, 2, 0, 2, 1, 13])

    })
    it('ters tilki check 2', () => {
        game.p1rocks = [0, 2, 2, 3, 10, 9, 4];
        game.p2rocks = [4, 4, 1, 1, 1, 1, 6];
        game.setActivePlayer('p2');
        game.play('p2', 4)
        game.play('p1', 5)
        expect(game.p1rocks).deep.eq([0, 2, 2, 3, 10, 1, 9]);
        expect(game.p2rocks).deep.eq([5, 5, 2, 2, 1, 0, 6]);
    })

})