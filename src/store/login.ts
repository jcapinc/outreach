
export interface LoginState{
	jwt: string | undefined;
}

export const defaultLoginState: LoginState = {
	jwt: undefined
}

export interface LoginAction{
	type: "LOGIN" | "LOGOUT" | string | undefined;
	jwt?:string;
}

export default function loginReducer(state: LoginState = defaultLoginState, action: LoginAction){
	switch(action.type){
		default: return state;
		case "LOGIN": return Object.assign({}, state, {jwt: action.jwt} as Partial<LoginState>);
		case "LOGOUT":return Object.assign({}, state, {jwt: undefined}  as Partial<LoginState>);
	}
}