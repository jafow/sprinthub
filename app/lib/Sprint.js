'use strict';
const TrelloRequest = require('./Trello');
const fs = require('fs');
const db = require('./Db');

class Sprint {
  isTrelloTokenSet() {
    return db.isTrelloTokenSet();
  }

  fetchTrelloToken() {
    return db.returnTrelloToken();
  }

  activateTrello(token) {
    return db.setTrelloToken(token);
  }

  authenticateTrello() {
    let Trello = new TrelloRequest(null);
    const authenticationUrl = Trello.login();
    Trello = null;
    return authenticationUrl;
  }

  // Adding a new board doesn't cause "loadBoard" to fire and update the view
  // Problem is with promise.listquery being set in the wrong closure
  trackNewList(id, name) {
    let Trello = new TrelloRequest(this.fetchTrelloToken());
    const board = { id };
    const promise = {};

    if (!db.hasBoard(board.id)) {
      Trello.mapBoardName(board.id, boardInfo => {
        return new Promise(resolve => {
          board.boardName = boardInfo.name;
          promise.listquery = Trello.queryLists(board, name);
        });
      });
    } else {
      board.boardName = 'n/a';
      promise.listquery = Trello.queryLists(board, name);
    }

    return new Promise((resolve, reject) => {
      promise.listquery.then(message => {
        Trello = null;
        resolve(message);
      }).catch(e => {
        Trello = null;
        reject(e)
      });
    });
  }

  removeTrelloList(boardId, id) {
    const promise = db.removeTrelloList(boardId, id);
    return new Promise((resolve, reject) => {
      promise.then(message => {
        resolve(message);
      }).catch(e => reject(e));
    });
  }

  fetchCards(lists) {
    let Trello = new TrelloRequest(this.fetchTrelloToken());
    const promise = Trello.queryCards(lists);

    return new Promise((resolve, reject) => {
      promise.then(message => {
        Trello = null;
        resolve(message);
      }).catch(e => {
        Trello = null;
        reject(e)
      });
    });
  }

  returnTrackedBoards() {
    return new Promise((resolve, reject) => { 
      db.fetchBoards()
        .then((boards) => {
          resolve(boards);
        });
    });
  }

  exportRawData(dir, data) {
    let dataFile = fs.createWriteStream(`${dir}/trello_data.txt`);
    dataFile.write(`Trello Data\n`);
    data.map(story => {
      dataFile.write(`${story.name}\n`);
    });
    dataFile.write('\n----------------------------Stories---------------------------')
    data.map(story => {
      dataFile.write(`\n${story.name}\n`);
      story.checklists.map((checklist) => {
        dataFile.write(`\n${checklist.name}\n`);
        checklist.checkItems.map((item) => {
          dataFile.write(`${item.name}\n`);
        });
      });
    });
    dataFile.end();
  }
}

module.exports = new Sprint();