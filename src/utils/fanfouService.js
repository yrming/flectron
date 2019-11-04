const Fanfou = require("fanfou-sdk");
import Store from "electron-store";
import router from "../router";
import { consumerKey, consumerSecret } from "../config/index";

const store = new Store();
const opt = { consumerKey, consumerSecret };

const setAccount = account => {
  store.set("account", account);
};

const getAccount = () => {
  return store.get("account");
};

const getClient = () => {
  let account = {};
  try {
    account = store.get("account");
    const { oauthToken, oauthTokenSecret } = account.token;
    if (oauthToken && oauthTokenSecret) {
      const client = new Fanfou({
        ...opt,
        oauthToken,
        oauthTokenSecret
      });
      return client;
    }
  } catch (error) {
    console.error(error);
    router.replace({
      path: "/"
    });
  }
};

/**
 * xauth
 *
 * @param {*} username
 * @param {*} password
 * @returns
 */
const xauth = async (username, password) => {
  const client = new Fanfou({
    ...opt,
    username: username,
    password: password
  });
  try {
    const token = await client.xauth();
    const { oauthToken, oauthTokenSecret } = token;
    if (oauthToken && oauthTokenSecret) {
      const client2 = new Fanfou({
        ...opt,
        oauthToken,
        oauthTokenSecret
      });
      const profile = await client2.get("/account/verify_credentials", {});
      return { token, profile };
    }
  } catch (error) {
    return null;
  }
};

/**
 * Home Timeline
 *
 * @param {*} [opt={}]
 * @returns
 */
const getHomeTimeline = async (opt = {}) => {
  const client = getClient();
  let homeTimeline = [];
  try {
    homeTimeline = await client.get("/statuses/home_timeline", {
      ...opt,
      format: "html",
      count: 30
    });
  } catch (error) {
    return null;
  }
  return homeTimeline;
};

/**
 * User Timeline
 *
 * @param {*} [opt={}]
 * @returns
 */
const getUserTimeline = async (opt = {}) => {
  const client = getClient();
  let userTimeline = [];
  try {
    userTimeline = await client.get("/statuses/user_timeline", {
      ...opt,
      format: "html",
      count: 30
    });
  } catch (error) {
    return null;
  }
  return userTimeline;
};

/**
 * Mentions
 *
 * @param {*} [opt={}]
 * @returns
 */
const getMentions = async (opt = {}) => {
  const client = getClient();
  let mentions = [];
  try {
    mentions = await client.get("/statuses/mentions", {
      ...opt,
      format: "html",
      count: 30
    });
  } catch (error) {
    return null;
  }
  return mentions;
};

/**
 * Favorites
 *
 * @param {*} [opt={}]
 * @returns
 */
const getFavorites = async (opt = {}) => {
  const client = getClient();
  let favorites = [];
  try {
    favorites = await client.get("/favorites", {
      ...opt,
      format: "html",
      count: 30
    });
  } catch (error) {
    return null;
  }
  return favorites;
};

/**
 * Destory Favorite
 *
 * @param {*} [opt={}]
 * @returns
 */
const destoryFavorite = async (opt = {}) => {
  const client = getClient();
  let status = [];
  try {
    status = await client.post("/favorites/destroy", {
      ...opt,
      format: "html"
    });
  } catch (error) {
    return null;
  }
  return status;
};

/**
 * Photos
 *
 * @param {*} [opt={}]
 * @returns
 */
const getPhotos = async (opt = {}) => {
  const client = getClient();
  let photos = [];
  try {
    photos = await client.get("/photos/user_timeline", {
      ...opt,
      format: "html",
      count: 30
    });
  } catch (error) {
    return null;
  }
  return photos;
};

/**
 * Conversation List
 *
 * @param {*} [opt={}]
 * @returns
 */
const getConversationList = async (opt = {}) => {
  const client = getClient();
  let conversations = [];
  try {
    conversations = await client.get("/direct_messages/conversation_list", {
      ...opt,
      format: "html",
      count: 30
    });
  } catch (error) {
    return null;
  }
  return conversations;
};

/**
 * Conversation
 *
 * @param {*} [opt={}]
 * @returns
 */
const getConversation = async (opt = {}) => {
  const client = getClient();
  let conversations = [];
  try {
    conversations = await client.get("/direct_messages/conversation", {
      ...opt,
      count: 30
    });
  } catch (error) {
    return null;
  }
  return conversations;
};

/**
 * User
 *
 * @param {*} [opt={}]
 * @returns
 */
const getUserInfo = async (opt = {}) => {
  const client = getClient();
  let user = [];
  try {
    user = await client.get("/users/show", {
      ...opt,
      format: "html"
    });
  } catch (error) {
    return null;
  }
  return user;
};

/**
 * Friends
 *
 * @param {*} [opt={}]
 * @returns
 */
const getUserFriends = async (opt = {}) => {
  const client = getClient();
  let friends = [];
  try {
    friends = await client.get("/users/friends", {
      ...opt,
      format: "html",
      count: 30
    });
  } catch (error) {
    return null;
  }
  return friends;
};

/**
 * Followers
 *
 * @param {*} [opt={}]
 * @returns
 */
const getUserFollowers = async (opt = {}) => {
  const client = getClient();
  let followers = [];
  try {
    followers = await client.get("/users/followers", {
      ...opt,
      format: "html",
      count: 30
    });
  } catch (error) {
    return null;
  }
  return followers;
};

/**
 * Send status
 *
 * @param {*} [opt={}]
 * @returns
 */
const postStatus = async (opt = {}) => {
  const client = getClient();
  let status = {};
  try {
    if (opt.photo) {
      status = await client.post("/photos/upload", {
        ...opt
      });
    } else {
      status = await client.post("/statuses/update", {
        ...opt
      });
    }
  } catch (error) {
    return null;
  }
  return status;
};

/**
 * Delete status
 *
 * @param {*} [opt={}]
 * @returns
 */
const deleteStatus = async (opt = {}) => {
  const client = getClient();
  let status = {};
  try {
    status = await client.post("/statuses/destroy", {
      ...opt
    });
  } catch (error) {
    return null;
  }
  return status;
};

/**
 * Create favorite
 *
 * @param {*} [id]
 * @returns
 */
const createFavorite = async id => {
  const client = getClient();
  let status = {};
  try {
    status = await client.post(`/favorites/create/${id}`);
  } catch (error) {
    return null;
  }
  return status;
};

/**
 * Destroy favorite
 *
 * @param {*} [id]
 * @returns
 */
const destroyFavorite = async id => {
  const client = getClient();
  let status = {};
  try {
    status = await client.post(`/favorites/destroy/${id}`);
  } catch (error) {
    return null;
  }
  return status;
};

/**
 * Send direct messages
 *
 * @param {*} [opt={}]
 * @returns
 */
const sendDirectMsg = async (opt = {}) => {
  const client = getClient();
  let msg = {};
  try {
    msg = await client.post("/direct_messages/new", {
      ...opt
    });
  } catch (error) {
    return null;
  }
  return msg;
};

/**
 * Create firendship
 *
 * @param {*} [opt={}]
 * @returns
 */
const createFirendship = async (opt = {}) => {
  const client = getClient();
  let user = {};
  try {
    user = await client.post("/friendships/create", {
      ...opt
    });
  } catch (error) {
    return null;
  }
  return user;
};

/**
 * Destory firendship
 *
 * @param {*} [opt={}]
 * @returns
 */
const destoryFirendship = async (opt = {}) => {
  const client = getClient();
  let user = {};
  try {
    user = await client.post("/friendships/destroy", {
      ...opt
    });
  } catch (error) {
    return null;
  }
  return user;
};

export {
  setAccount,
  getAccount,
  xauth,
  getHomeTimeline,
  getMentions,
  getFavorites,
  destoryFavorite,
  getPhotos,
  getConversationList,
  getConversation,
  getUserInfo,
  getUserTimeline,
  getUserFriends,
  getUserFollowers,
  postStatus,
  deleteStatus,
  createFavorite,
  destroyFavorite,
  sendDirectMsg,
  createFirendship,
  destoryFirendship
};
