import {
  GETALLPRODUCTREVIEWSSUCCESS,
  RFAILD,
  RLOADING
} from "../actionTypes/reviewtypes";

const initialState = {
  loading: true,
  reviews: [],
  error: null
};

export const reviewreducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case RLOADING:
      return { ...state, loading: true };
    case GETALLPRODUCTREVIEWSSUCCESS:
      return { ...state, reviews: payload, loading: false };
    case RFAILD:
      return { ...state, error: payload, loading: true };

    default:
      return state;
  }
};
