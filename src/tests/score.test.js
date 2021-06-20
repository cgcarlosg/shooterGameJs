import '@babel/polyfill';
import * as ScoreLogic from '../helpers/scoreLogic';

global.fetch = require('jest-fetch-mock');

describe('Posting Score to Api ', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('true for successful API call', async () => {
    fetch.mockResponseOnce(JSON.stringify('Api test call'));
    const result = await ScoreLogic.postScore('Carlos', 1200);
    expect(result).toBe(true);
  });

  test('true for successful API call', async () => {
    fetch.mockResponseOnce(JSON.stringify('Api test call'));
    const result = await ScoreLogic.postScore('Carlos', 1200);
    expect(result).not.toBe(false);
  });

  test('false if API call fails', async () => {
    fetch.mockRejectOnce(new Error('error message'));
    const result = await ScoreLogic.postScore('Carlos', 1200);
    expect(result).toBe(false);
  });

  test('false if API call fails', async () => {
    fetch.mockRejectOnce(new Error('error message'));
    const result = await ScoreLogic.postScore('Carlos', 1200);
    expect(result).not.toBe(true);
  });

  test('Posts to API with correct params', async () => {
    fetch.mockResponseOnce(JSON.stringify('Api test call'));
    await ScoreLogic.postScore('Carlos', 1200);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify({ user: 'Carlos', score: 1200 }));
  });
});

describe('Getting Scores from API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('Returns an array of objects if API call is successful', async () => {
    fetch.mockResponseOnce(JSON.stringify([{ user: 'Carlos', score: 1200 }]));
    const scoreBoard = await ScoreLogic.getGameScores('Carlos', 1200);

    expect(scoreBoard).toEqual([{ user: 'Carlos', score: 1200 }]);
  });

  test('should math the score that been given', async () => {
    fetch.mockResponseOnce(JSON.stringify([{ user: 'Carlos', score: 1200 }]));
    const scoreBoard = await ScoreLogic.getGameScores('Carlos', 1200);
    const data = scoreBoard;
    expect(data[0].score).toBeGreaterThan(5);
  });

  test('Returns error message if API call fails', async () => {
    fetch.mockRejectOnce(new Error('fake error message'));
    const scoreBoard = await ScoreLogic.getGameScores('Carlos', 1200);
    expect(scoreBoard).toBe('Sorry, something went wrong.');
  });

  test('Score should not be greater than give score', async () => {
    fetch.mockResponseOnce(JSON.stringify([{ user: 'Carlos', score: 10 }]));
    const scoreBoard = await ScoreLogic.getGameScores('Carlos', 1200);
    expect(scoreBoard[0].score).not.toBeGreaterThan(1200);
  });
});