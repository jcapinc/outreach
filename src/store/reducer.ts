
export interface LoginState {
	jwt: string | undefined;
	message: string | undefined;
	isLoading: boolean;
	error: undefined;
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
		jwt: undefined,
		message: undefined,
		error: undefined,
		isLoading: false
	}
}


export default function reducer(state: AppState = defaultState, action: Action){
	console.log(action);
	switch(action.type){
		default: return state;
		case "LOGIN_ATTEMPT_STARTED":
			return Object.assign({}, state, {
				Login: {
					jwt: undefined, 
					message: "Logging In...", 
					error: undefined,
					isLoading: true
				} as LoginState
			});
		case "LOGIN_ATTEMPT_SUCCESS": 
			if(action.response === undefined) return state;
			return Object.assign({}, state, {
				Login: {
					jwt: action.response.body?.getReader().read().then()
				} as LoginState
			})
	}
}