import * as actionType from "../actions/actionTypes";

const initialState = {
  placeInformation: null,
};
export default function (state = initialState, action) {
  console.log("Action Add Place ", action);
  switch (action.type) {
    case actionType.GET_PLACE_INFORMATION: {
      return {
        ...state,
        placeInformation: action.payload,
      };
    }
    default: {
      return { ...state };
    }
  }
}
