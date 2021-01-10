const { default: expectCt } = require('helmet/dist/middlewares/expect-ct');
const { TestScheduler } = require('jest');
const sum=require('./sum');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1,2)).toBe(3);
})