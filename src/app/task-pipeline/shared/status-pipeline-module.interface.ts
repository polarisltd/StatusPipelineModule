import {Column} from "./column";

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
title: string;
id: string;
type: PipelineColumnElementType;
status: string;
}

export interface IStatusChange {
    src: IPipelineColumn,
    dst: IPipelineColumn,
    elem: IPipelineColumnElement;
}

export interface ITransition{
  srcStatus:string;
  dstStatus:string;
}
