import { ADD_PLACE } from "./actionTypes";

export const addPlace = (data) => {
  return {
    type: ADD_PLACE,
    payload: data,
  };
};
