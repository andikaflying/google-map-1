import { all, put, call, takeEvery } from "redux-saga/effects";
import * as actionType from "../actions/actionTypes";

export default function* addPlaceSaga() {
  yield takeEvery(actionType.ADD_PLACE, addPlace);
}

function* addPlace(action) {
  console.log(action);
  try {
    const response = yield call(getPlaceInformation, action.payload);
    console.log("Response ", response);
    yield put({ type: actionType.GET_PLACE_INFORMATION, payload: response });
  } catch (err) {
    console.log(err);
  }
}

async function getPlaceInformation(data) {
  return new Promise((resolve) => {
    const place = data.place;
    console.log("Place", place);
    let placeInfo = {};

    placeInfo = {
      ...placeInfo,
      viewport: place.geometry.viewport,
      location: place.geometry.location,
      name: place.name,
      address: place.formatted_address,
    };
    console.log("getPlaceInformation. placeInfo : ", placeInfo);
    resolve(placeInfo);
  });
}
