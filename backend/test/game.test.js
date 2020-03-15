console.clear();
console.log(new Date())
const expect = require('chai').expect;
const Game = require('../game')
const initWellArray = () => [4, 4, 4, 4, 4, 4, 0];
const getValidNewGame = () => {
    return new Game('r1', 'p1', 'p2', () => { })
}
let game = getValidNewGame();
beforeEach(() => {
    game = getValidNewGame();
})
describe('Testing Game', function () {
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
        console.log('ONCE')
        game.play('p1', 4)
        console.log('SONRA')
        expect(game.p1rocks).deep.equal([5, 5, 4, 1, 1, 1, 10]);
        // expect(game.p2rocks).deep.equal([6, 6, 5, 4, 4, 1, 1]);
        expect(game.p2rocks).deep.equal([6, 0, 5, 4, 4, 1, 1]);
        

        // expect(() => game.play('p1', 0)).to.throw();
    })
})