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
	gender: IGender;
	familyPrimary: boolean;
	role: IMemberFamilyRole;
	dob: string;
	phones: IPhone[];
	emails: IEmail[];
	addresses: IAddress[];
	activity: IActivity[];
}

export type IContactType = "Home" | "Office" | "Cell";

export interface IContact extends IDRecord{
	type: ContactType;
	primary: boolean;
}


export interface IPhone extends IContact{
	number: string;
}

export interface IEmail extends IContact{
	address: string;
}

export type IState = string;

export interface IAddress extends IContact{
	line1: string;
	line2: string | undefined;
	apptNo: string | undefined;
	city: string;
	state: IState;
	zip: string;
}

export interface IActivity extends TouchRecord{
	body: string;
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

export type IMemberFamilyRole = "Mother" | "Father" | "Child" | "Grandparent" | "Aunt/Uncle" | "Neice/Nephew/Cousin" | "Other";

export type IGender = "Male" | "Female";