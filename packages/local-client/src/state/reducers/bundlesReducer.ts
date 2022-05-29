import { ActionType } from '../action-types';
import { Action } from '../actions';

interface BundlesState {
    [key: string]:
        | {
              loading: boolean;
              code: string;
              err: string;
          }
        | undefined;
}

const initialState: BundlesState = {};

const reducer = (state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
        case ActionType.BUNDLE_START:
            let newStartState = { ...state };
            newStartState[action.payload.cellId] = {
                loading: true,
                code: '',
                err: '',
            };
            return newStartState;
        case ActionType.BUNDLE_COMPLETE:
            let newCompleteState = { ...state };
            newCompleteState[action.payload.cellId] = {
                loading: false,
                code: action.payload.bundle.code,
                err: action.payload.bundle.err,
            };
            return newCompleteState;
        default:
            return state;
    }
};

export default reducer;
