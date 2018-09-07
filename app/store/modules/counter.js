const fileSystemModule = require('tns-core-modules/file-system');
const folder = fileSystemModule.knownFolders.currentApp();

const state = {
  numFiles: 0,
  title: 'puppy or bagel?',
  choice1: 'puppy',
  choice2: 'bagel',
  humanScore: 0,
  botScore: 0,
};

const mutations = {
  clearCount(state) {
    state.numFiles = 0;
  },
  clearScore(state) {
    state.humanScore = 0;
    state.botScore = 0;
  },
  setHumanScore(state) {
    state.humanScore++;
  },
  setBotScore(state) {
    state.botScore++;
  },
  countFiles(state, files) {
    state.numFiles += files;
  },
  setGameParams(state, gameParams) {
    console.log(gameParams);
    state.title = gameParams.title;
    state.choice1 = gameParams.choice1;
    state.choice2 = gameParams.choice2;
  },
};

const actions = {
  clearCount: ({ commit }) => commit('clearCount'),

  clearScore: ({ commit }) => commit('clearScore'),

  countFiles: ({ commit }, imageFolder) => {
    console.log(imageFolder);
    folder
      .getFolder('/assets/images/' + imageFolder)
      .getEntities()
      .then(entities => {
        commit('countFiles', entities.length);
      });
  },

  setHumanScore: ({ commit }) => commit('setHumanScore'),

  setBotScore: ({ commit }) => commit('setBotScore'),

  setGameParams: ({ commit }, folderName) => {
    //convert folder name to title of game
    let gameName = folderName.split(/\s*\-\s*/g);
    let gameParams = [];
    gameParams.choice1 = gameName[0];
    gameParams.choice2 = gameName[1];
    gameParams.title = gameName[0] + ' or ' + gameName[1] + '?';
    commit('setGameParams', gameParams);
  },
};

export default {
  state,
  mutations,
  actions,
};
