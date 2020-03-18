import * as models from '../../ModelTypes';

export interface AppState {
	login: ILoginState
	stateError?: string;
	currentState: models.IUserAppState;
	initialState: models.IUserAppState;
}

export interface ILoginState {
	jwt: string | undefined;
	message: string | undefined;
	isLoading: boolean;
	error: string | undefined;
}

export interface Action {
	type: string;
	response?: Response;
	message?: string;
	payload?: unknown;
}

const defaultUserAppState:models.IUserAppState = {
	requests: []
}

const defaultState: AppState = {
	login: {
		jwt: localStorage.getItem("jwt") || undefined,
		message: undefined,
		error: undefined,
		isLoading: false
	},
	currentState: defaultUserAppState,
	initialState: defaultUserAppState
};


export default function reducer(state: AppState = defaultState, action: Action): AppState{
	console.log(action);
	switch(action.type){
		default: return state;
		//#region Login
		case "LOGIN_ATTEMPT_STARTED":
			return Object.assign({}, state, { login: {
				login: {
					jwt: undefined, 
					message: "Logging In...", 
					error: undefined,
					isLoading: true
				} as ILoginState
			}});
		case "LOGIN_ATTEMPT_SUCCESS": 
			if(action.response === undefined) return state;
			setTimeout(() => window.location.reload(), 100);
			localStorage.setItem('jwt',action.message || "");
			return Object.assign({}, state, { login: {
				login: {
					jwt: action.message,
					error: undefined,
					isLoading: false,
					message: undefined
				} as ILoginState
			}});
		case "LOGIN_ATTEMPT_FAIL":
		case "LOGIN_ATTEMPT_FAILED":
			return Object.assign({}, state, { login: {
				jwt: undefined,
				message: undefined,
				isLoading: false,
				error: action.message
			}});
		case "LOGOUT":
			localStorage.removeItem('jwt');
			setTimeout(() => window.location.reload(), 100);
			return Object.assign({}, state, { login: {
				jwt: undefined,
				message: undefined,
				isLoading: false,
				error: undefined
			}});
		//#endregion
		//#region Add Form
		case "SEND_STATE_INIT": 
			delete state.stateError;
			return {...state};
		case "SEND_STATE_FAILURE":
			return {...state, stateError: action.message};
		case "SEND_STATE_SUCCESS":
			return {...state, 
				initialState: {...action.payload as models.IUserAppState}, 
				currentState: {...action.payload as models.IUserAppState}
			};
		//#endregion
	}
}