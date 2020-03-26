export interface IDRecord{
	guid: string;
}

export interface IFamily extends IDRecord{
	surname: string;
	members: IPerson[];
}

export interface IPerson extends IDRecord{
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

export interface IActivity{
	
}