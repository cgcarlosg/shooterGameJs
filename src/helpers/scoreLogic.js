let nameInput;

const apiInfo = {
  url: 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  gameID: 'Vl4d7IVkemORRVg2fUda',
};

function subscribe() {
  const nameInp = document.createElement('p');
  nameInp.textContent = 'Insert your name';
  nameInp.classList.add('inputt');
  document.querySelector('#game').appendChild(nameInp);
}

const getPlayerName = () => {
  const playerName = nameInput.value;
  if (playerName) {
    return playerName;
  }
  subscribe();
  setTimeout(() => {
    const er = document.querySelector('.inputt');
    er.remove();
  }, 2000);
  return false;
};

export const deleteNameInput = () => {
  nameInput.parentElement.removeChild(nameInput);
};

export const postScore = async (playerName, score) => {
  try {
    await fetch(`${apiInfo.url}games/:${apiInfo.gameID}/scores/`, {
      method: 'POST',
      headers: apiInfo.headers,
      body: JSON.stringify({ user: playerName, score }),
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const handleScore = async (scene, gameScore) => {
  const playerName = getPlayerName();
  if (playerName) {
    const result = await postScore(playerName, gameScore);
    if (result) {
      scene.scene.start('Score');
      deleteNameInput();
    }
  } else {
    handleScore();
  }
};

export const restartGame = (scene) => {
  scene.scene.start('MainScene');
  deleteNameInput();
};

export const createNameInput = () => {
  nameInput = document.createElement('input');
  nameInput.placeholder = 'Your name here';
  nameInput.type = 'text';
  nameInput.classList.add('input');
  document.querySelector('#game').appendChild(nameInput);
};

export const getGameScores = async () => {
  try {
    const rawResult = await fetch(`${apiInfo.url}games/:${apiInfo.gameID}/scores/`);
    const scoreBoard = await rawResult.json();
    return scoreBoard;
  } catch (error) {
    return 'Something went wrong.';
  }
};