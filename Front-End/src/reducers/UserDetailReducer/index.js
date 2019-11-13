import {GET_USER_DETAIL, USER_LOADING} from '../../actions/types';

const initialState = {
  logs: [],
  loading: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USER_DETAIL:
      return {
        ...state,
        logs: action.payload,
        loading: false,
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
