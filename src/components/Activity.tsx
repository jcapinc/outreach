import React from 'react';
import * as S from 'semantic-ui-react';
import { IActivity } from '../../ModelTypes';

export interface IActivityFormProps{
	onAddActivity: (activity: IActivity) => void;
}

export function ActivityForm(props: IActivityFormProps){
	return <></>;
}

export interface IActivityListProps extends Pick<IActivityFormProps,"onAddActivity">{
}

export function ActivityList(props: IActivityListProps){
	return <></>;
}