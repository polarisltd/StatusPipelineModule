export enum PipelineColumnElementType {
Task = 'Task'
}
export interface IPipelineColumn {
title: string;
status: string;
order: number;
color: string;
}
export interface IPipelineColumnElement {
title: string,
id: string,
type: PipelineColumnElementType
status: string,
}
