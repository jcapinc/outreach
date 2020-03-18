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

export interface ITag{
	text: string;
}

export interface ISheep extends DBRecord {
	firstname: string;
	lastname: string;
}

export interface IEventRecord extends DBRecord {
	type: string;
	relation: string;
	message: string;
	date: string;
	recordGuid: string;
}