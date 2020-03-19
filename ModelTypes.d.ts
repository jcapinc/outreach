export interface DBRecord{
	guid: string;
}

export interface IUserAppState{
	requests: IPrayerRequest[];
}

export interface IPrayerRequest extends DBRecord {
	topic: string;
	body: string;
	status: string;
	sheep: ISheep[];
	tags: ITag[];
	events: IEvent[];
}

export const BasePrayerRequest: IPrayerRequest = {
	topic: "",
	body: "",
	status: "",
	sheep: [],
	tags: [],
	events: []
}

export interface ITag{
	text: string;
}

export interface ISheep extends DBRecord {
	guid: string;
	firstname: string;
	lastname: string;
}

export const BaseSheepRecord: ISheep = {
	guid:"",
	firstname: "",
	lastname: ""
}

export interface IEventRecord extends DBRecord {
	guid: string;
	message: string;
	date: string;
}