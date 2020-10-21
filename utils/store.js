const store = {};

class UserStore {
  constructor(userId) {
    this.userId = userId
    this.visited = new Set(),
    this.history = []
  }

  getVisited() {
    return this.visited
  }
  
  getHistory() {
    return this.history
  }
  
  visit(botReply, text) {
    this.history.push(botReply)
    this.visited.add(text.toLowerCase())
  }
  
  lastVisited() {
    // this returns "home" if you can't go back anymore
    if (this.history.length > 1) this.history.pop()
    return this.history[this.history.length - 1]
  }
  
  isVisited(entry) {
    return this.visited.has(entry.toLowerCase())
  }
}

const createUser = (userId) => {
  store[userId] = new UserStore(userId)
}

const getStore = () => {
  return store;
}

const getUserStore = (userId) => {
  return store[userId];
}

module.exports = {
  createUser,
  getStore,
  getUserStore
};
