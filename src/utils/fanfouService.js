import Fanfou from "fanfou-sdk-browser";
import { consumerKey, consumerSecret } from "../config/index";

const apiDomain = "cors.fanfou.com";
const oauthDomain = "cors.fanfou.com";
const hooks = {
  baseString: baseStr => {
    return baseStr
      .replace(
        "%2F%2Fcors.fanfou.com%2Foauth",
        "http%3A%2F%2Ffanfou.com%2Foauth"
      )
      .replace("%2F%2Fcors.fanfou.com", "http%3A%2F%2Fapi.fanfou.com");
  }
};
const opt = { consumerKey, consumerSecret, apiDomain, oauthDomain, hooks };

const getClient = () => {
  let account = {};
  try {
    account = JSON.parse(localStorage.getItem("account"));
  } catch (error) {
    console.error(error);
  }
  const { oauthToken, oauthTokenSecret } = account.token;
  if (oauthToken && oauthTokenSecret) {
    const client = new Fanfou({
      ...opt,
      oauthToken,
      oauthTokenSecret
    });
    return client;
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
  console.log(homeTimeline);
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
    console.log(JSON.stringify(error));
    return null;
  }
  console.log(userTimeline);
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
  console.log(mentions);
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
  console.log(favorites);
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
  console.log(status);
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
  console.log(photos);
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
  console.log(conversations);
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
  console.log(user);
  return user;
};

export {
  xauth,
  getHomeTimeline,
  getMentions,
  getFavorites,
  destoryFavorite,
  getPhotos,
  getConversationList,
  getUserInfo,
  getUserTimeline
};
