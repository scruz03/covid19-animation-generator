
import { DateTime } from 'luxon';

// Data source

export interface DataPoint {
	date: DateTime;
	value: number;
}

export interface Milestone {
	date: DateTime;
	color: string;
}

export interface TimeSeries {
	name: string;
	data: DataPoint[];
	milestones: Milestone[] | null;
}

// Config

export interface SeriesConfiguration {
	name: string;
	code: string;
	color: string;
}

export interface ColorSchema {
	background: string;
	scale: {
		color: string;
		font: string;
		offset: number;
	},
	axis: {
		color: string;
		font: string;
		offset: number;
	},
	series: {
		font: string;
		color: string;
		offset: Point;
	},
	date: {
		font: string;
		color: string;
	}
}

export interface Box {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export interface Layout {
	canvasSize: number[];
	plotArea: Box;
	circleSize: number;
	datePosition: Point;
	dateFont: object;
}

export interface DataSource {
	url: string;
	nameColumn: string;
	preProcessor: string;
	series: SeriesConfiguration[];
}

export interface Configuration {
	dataSources: { [key: string]: DataSource };
	milestoneSources: { [key: string]: string };
	days: number;
	framesPerDay: number;
	extraEndFrames: number;
	colorSchemas: { [key: string]: ColorSchema };
	layouts: { [key: string]: Layout; };
	defaults: {
		schema: string;
		source: string;
		days: number,
		frames: number,
		extraFrames: number;
	}
}

// Ploy

export interface Scale {
	horizontal: {
		min: number;
		max: number;
	};
	vertical: {
		min: number;
		max: number;
	}
}

export interface FrameFilterInfo {
	date: DateTime;
	ratio: number;
}

export interface FrameInfo {
	date: DateTime;
	series: PlotSeries[];
	scale: Scale;
}

export interface Animation {
	getFrames: () => Generator<FrameFilterInfo>;
	getScale: (
		filteredSeries: PlotSeries[],
		frameFilterInfo: FrameFilterInfo,
		frameIndex: number,
		stepFrameIndex: number) => Scale;
}

export interface PlotSeries {
	code: string;
	color: string;
	points: PlotPoint[];
	milestones: Milestone[] | null
}

export interface Point {
	x: number;
	y: number;
}

export interface PlotPoint extends Point {
	date: DateTime;
}
