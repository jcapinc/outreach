export interface IDRecord{
	guid: string;
}

export interface TouchRecord{
	creator: string;
	created: string;
	updated: string;
	updatedBy:string;
}

export interface IFamily extends IDRecord, TouchRecord{
	surname: string;
	members: IPerson[];
}

export interface IPerson extends IDRecord, TouchRecord{
	firstname: string;
	lastname: string;
	familyPrimary: boolean;
	phones: IContact<IPhone>[];
	emails: IContact<IEmail>[];
	addresses: IContact<IAddress>[];
	activity: IActivity[];
}

export interface IContact<T> extends T{
	type: "Home" | "Office" | "Cell";
	primary: boolean;
}

export interface IPhone{
	number: string;
}

export interface IEmail{
	address: string;
}

export type IState = string;

export interface IAddress{
	line1: string;
	line2: string | undefined;
	apptNo: string | undefined;
	city: string;
	state: IState;
	zip: string;
}

export interface IActivity extends TouchRecord{
	body: string;
	creater: string;
	created: string;
	updated: string;
}

export interface IUserAppState{
	families: IFamily[];
}

export interface IUserRecord {
	username: string;
	guid: string;
	firstname?: string;
	lastname?:string;
}