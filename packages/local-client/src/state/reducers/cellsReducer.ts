import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
	loading: boolean;
	error: string | null;
	order: string[];
	data: {
		[key: string]: Cell;
	};
}

const initialState: CellsState = {
	loading: false,
	error: null,
	order: [],
	data: {},
};

const reducer = (state: CellsState = initialState, action: Action) => {
	switch (action.type) {
		case ActionType.SAVE_CELLS_ERROR:
			let newSaveCellState = { ...state };
			newSaveCellState.error = action.payload;

			return newSaveCellState;
		case ActionType.FETCH_CELLS:
			let newFetchState = { ...state };
			newFetchState.loading = true;
			newFetchState.error = null;

			return newFetchState;
		case ActionType.FETCH_CELLS_COMPLETE:
			let newFetchCompleteState = { ...state };
			newFetchCompleteState.order = action.payload.map((cell) => cell.id);
			newFetchCompleteState.data = action.payload.reduce((acc, cell) => {
				acc[cell.id] = cell;
				return acc;
			}, {} as CellsState['data']);

			return newFetchCompleteState;
		case ActionType.FETCH_CELLS_ERROR:
			let newFetchErrorState = { ...state };
			newFetchErrorState.loading = false;
			newFetchErrorState.error = action.payload;

			return newFetchErrorState;
		case ActionType.UPDATE_CELL:
			const { id, content } = action.payload;
			return {
				...state,
				data: {
					...state.data,
					[id]: {
						...state.data[id],
						content,
					},
				},
			};
		case ActionType.DELETE_CELL:
			let newDeleteState = { ...state };
			delete newDeleteState.data[action.payload];
			newDeleteState.order = newDeleteState.order.filter((id) => id !== action.payload);

			return newDeleteState;
		case ActionType.MOVE_CELL:
			const { direction } = action.payload;
			const index = state.order.findIndex((id) => id === action.payload.id);
			const targetIndex = direction === 'up' ? index - 1 : index + 1;

			if (targetIndex < 0 || targetIndex > state.order.length - 1) {
				return state;
			}

			let newMoveState = { ...state };
			newMoveState.order[index] = newMoveState.order[targetIndex];
			newMoveState.order[targetIndex] = action.payload.id;

			return newMoveState;
		case ActionType.INSERT_CELL_AFTER:
			const cell: Cell = {
				content: '',
				type: action.payload.type,
				id: randomId(),
			};

			let newInsertState = { ...state };
			newInsertState.data[cell.id] = cell;

			const foundIndex = newInsertState.order.findIndex((id) => id === action.payload.id);

			if (foundIndex < 0) {
				newInsertState.order.unshift(cell.id);
			} else {
				newInsertState.order.splice(foundIndex + 1, 0, cell.id);
			}

			return newInsertState;
		default:
			return state;
	}
};

const randomId = () => {
	return Math.random().toString(36).substr(2, 5);
};

export default reducer;
