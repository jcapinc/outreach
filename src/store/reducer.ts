
export interface LoginState {
	jwt: string | undefined;
	message: string | undefined;
	isLoading: boolean;
	error: string | undefined;
}

export interface AppState{
	login: LoginState;
}

export interface Action {
	type: string;
	response?: Response;
	message?: string;
}

const defaultState: AppState = {
	login: {
		jwt: localStorage.getItem("jwt") || undefined,
		message: undefined,
		error: undefined,
		isLoading: false
	}
};


export default function reducer(state: AppState = defaultState, action: Action): AppState{
	console.log(action);
	switch(action.type){
		default: return state;
		case "LOGIN_ATTEMPT_STARTED":
			return Object.assign({}, state, { login: {
				login: {
					jwt: undefined, 
					message: "Logging In...", 
					error: undefined,
					isLoading: true
				} as LoginState
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
				} as LoginState
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
	}
}