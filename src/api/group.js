import axios from "axios";
import { Base } from "../util/base";
import api from "./index";
import {
  SET_VAL,
  SET_USER_INFO,
  SET_USERID,
  SET_FETCHED_CARDS,
} from "../redux/masterReducer";
import { SET_GROUPCARDS } from "../redux/groupReducer";
import { store } from "../index";

// fetch all groups
const fetchGroups = async () => {
  try {
    let fetchedGroups = await axios.get(`${Base}/group/all`);
    if (fetchedGroups) return fetchedGroups.data.data.groups;
  } catch (err) {
    console.log(err);
    return;
  }
};

// fetch all members in a group
const fetchMembers = async () => {
  try {
    let fetchedMembers = await api.post("/group/members");
    store.dispatch(SET_VAL("studentList", fetchedMembers.data.data.users));
    return fetchedMembers.data.data.users;
  } catch (err) {
    console.log(err);
    return;
  }
};

// fetch public posts
const fetchPublicPosts = async () => {
  try {
    let fetchedPublicPosts = await api.get(`/card/fetchpublic`);
    if (fetchedPublicPosts) {
      store.dispatch(SET_GROUPCARDS(fetchedPublicPosts.data.data.cards));
      return fetchedPublicPosts.data.data.cards.reverse();
    }
  } catch (err) {
    return err;
  }
};

const removeMember = async (email) => {
  try {
    await api.post("/group/removeMember", { email });
    return;
  } catch (err) {
    return err;
  }
};

export { fetchGroups, fetchMembers, fetchPublicPosts, removeMember };
