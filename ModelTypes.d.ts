export interface DBRecord{
	guid: string;
}

export interface IPrayerRequest extends DBRecord {
	topic: string;
	body: string;
}

export interface IPrayerRequestRelations extends IPrayerRequest, IHistoricRecord {
	sheep: IPrayerSheepRelations[];
}

export interface IPrayerTag extends DBRecord {
	title: string;
}

export interface IPrayerTagRelationships {
	prayerGuid: string;
	tagGuid: string;
}

export interface ISheep extends DBRecord {
	firstname: string;
	lastname: string;
}

export interface ISheepRelations extends ISheep, IHistoricRecord {
	prayerRequests?: IPrayerRequestRelations[];
}

export interface IPrayerSheep extends DBRecord {
	sheepGuid: string;
	prayerGuid: string;
	isPrimary: boolean;
}

export interface IPrayerSheepRelations extends IPrayerSheep{
	sheep?: ISheepRelations;
	prayer?: IPrayerRequestRelations;
}

export interface IHistoricRecord{
	history?: IEventRecord[];
}

export type EventRecordType = "CREATED_BY";

export interface IEventRecord extends DBRecord {
	type: EventRecordType;
	relation: string;
	message: string;
	date: string;
	recordGuid: string;
}