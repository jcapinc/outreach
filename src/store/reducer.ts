import * as models from '../../ModelTypes';

export interface ILoginState {
	jwt: string | undefined;
	message: string | undefined;
	isLoading: boolean;
	error: string | undefined;
}

export interface IAddPrayerState {
	form: Partial<IAddPrayerFormValues>;
	sheepSearch: IAddPrayerSheepSearch;
}

export interface IAddPrayerFormValues extends models.IPrayerRequest {
	topic: string;
	body: string;
}

export interface IAddPrayerSheepSearch{
	found: models.ISheepRelations[];
	search: string;
	shepherdWorking: boolean;
	error: string | undefined;
}

export interface IGetFlockFuzzyResponse{
	data: {
		getFlockFuzzy: models.ISheep[];
	}
}

export interface AppState{
	login: ILoginState;
	addprayer: IAddPrayerState;
}

export interface Action {
	type: string;
	response?: Response;
	message?: string;
	payload?: unknown;
}

const defaultState: AppState = {
	login: {
		jwt: localStorage.getItem("jwt") || undefined,
		message: undefined,
		error: undefined,
		isLoading: false
	}, 
	addprayer: {
		form: {},
		sheepSearch: {
			found:[],
			search: "",
			shepherdWorking: false,
			error: undefined
		}
	}
};

function setSheepSearch(newSearch: Partial<IAddPrayerSheepSearch>, state: AppState): AppState {
	const sheepSearch = Object.assign({}, state.addprayer.sheepSearch, newSearch);
	const addprayer = Object.assign({}, state.addprayer, {sheepSearch});
	return Object.assign({}, state, {addprayer});
}

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
		case "ADD_PRAYER_SEARCH_INIT":
			return setSheepSearch({shepherdWorking: true, search: action.message, error: undefined}, state);
		case "ADD_PRAYER_SEARCH_COMPLETED":
			const results = action.payload as IGetFlockFuzzyResponse;
			return setSheepSearch({found: results.data.getFlockFuzzy, shepherdWorking: false}, state);
		case "ADD_PRAYER_SEARCH_ERROR":
			return setSheepSearch({found:[], shepherdWorking: false, error: action.message}, state);
		case "ADD_PRAYER_SEARCH_CLEAR":
			return setSheepSearch({found:[],shepherdWorking: false, error: undefined,search:""}, state)
		case "ADD_PRAYER_FORM_UPDATE":
			return {...state, addprayer: {...state.addprayer, form: { ...state.addprayer.form, 
				...(action.payload as Partial<IAddPrayerFormValues>)
			}}};
		//#endregion
	}
}