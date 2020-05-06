import { DateTime } from 'luxon';
import * as Enumerable from 'linq';

import { TimeSeries, SeriesConfiguration, ColorSchema, Layout, FrameInfo, PlotSeries } from '../util/Types';
import AnimationPipeline from '../animation/AnimationPipeline';
import CanvasWriter from './CanvasWriter';
import Log10PlotPointsGenerator from './Log10PlotPointsGenerator';
import ScaleLabelGenerator from '../util/ScaleLabelGenerator';

const X_LABEL = 'total confirmed cases (log)';
const Y_LABEL = 'new confirmed cases (log, last week)';

export default class ImageGenerator
{
	// Fields

	private color: ColorSchema;
	private layout: Layout;
	private series: PlotSeries[];


	// Constructor

	public constructor (series: TimeSeries[], configuration: SeriesConfiguration[],
		color: ColorSchema, layout: Layout)
	{
		this.color = color;
		this.layout = layout;
		this.series = this.createPlotSeries(series, configuration);
	}


	// Public methods

	public async generate(outputDirectory: string,
		frames: number, extraFrames: number, days: number)
	{
		// Setup bounderies
		const writer = new CanvasWriter(
			outputDirectory, this.layout.canvasSize,
			this.color.background);
		const frameInfoGenerator = new AnimationPipeline(
			this.series, this.layout.plotArea,
			frames, extraFrames, days);

		for (const frameInfo of frameInfoGenerator.generate())
			await this.drawFrame(frameInfo, writer);
	}


	// Private methods

	private createPlotSeries(series: TimeSeries[], configuration: SeriesConfiguration[]): PlotSeries[]
	{
		return configuration.map(seriesConf =>
		{
			const found = series.find(s => s.name === seriesConf.name);
			if (!found)
				throw new Error(`Time series not found: ${seriesConf.name}`);
			return {
				code: seriesConf.code,
				color: seriesConf.color,
				points: Log10PlotPointsGenerator.generate(found.data),
				milestones: found.milestones
			};
		});
	}

	private async drawFrame(frame: FrameInfo, writer: CanvasWriter)
	{
		writer.clean();
		for (const series of frame.series)
		{
			// Draw series
			const lastColor = this.drawSeriesLines(series, writer);
			this.drawSeriesCircle(series, writer, lastColor);
			this.drawSeriesLabel(series, writer);

			// Draw other items
			this.drawScale(writer, frame);
			this.drawDate(writer, frame.date);
		}

		await writer.save();
	}

	private drawSeriesLines(series: PlotSeries, writer: CanvasWriter): string | null
	{
		if (series.points.length < 2)
			return null;

		// No milestones
		if (series.milestones === null)
		{
			writer.drawPolyline(
				series.color, 3,
				series.points,
				this.layout.plotArea);
			return null;
		}

		// Milestones
		// Read groups
		let lastColor = null;
		for (let index = -1; index < series.milestones.length; index++)
		{
			const milestone = index >= 0 ?
				series.milestones[index] :
				null;
			const currentColor = milestone ?
				milestone.color :
				'white';
			const firstDate = milestone ?
				milestone.date :
				series.points[0].date;
			const lastDate = index < series.milestones.length - 1 ?
				series.milestones[index + 1].date :
				series.points[series.points.length - 1].date;
			if (+firstDate >= +lastDate)
				continue;

			const points = Enumerable
				.from(series.points)
				.where(p => +p.date >= +firstDate)
				.where(p => +p.date <= +lastDate)
				.toArray();
			if (points.length < 2)
				continue;

			writer.drawPolyline(
				currentColor,
				3,
				points,
				this.layout.plotArea);
			lastColor = currentColor;
		}

		return lastColor;
	}

	private drawSeriesCircle(series: PlotSeries, writer: CanvasWriter, forceColor: string | null)
	{
		if (!series.points.length)
			return;

		const point = series.points[series.points.length - 1];
		writer.drawCircle(this.layout.circleSize, forceColor || 'white', point, this.layout.plotArea);
	}

	private drawSeriesLabel(series: PlotSeries, writer: CanvasWriter)
	{
		if (!series.points.length)
			return;

		const point = series.points[series.points.length - 1];
		const x = point.x + this.color.series.offset.x;
		const y = point.y + this.color.series.offset.y;
		writer.drawText(
			series.code, this.color.series.font, this.color.series.color,
			{ x, y }, this.layout.plotArea);
	}

	private drawScale(writer: CanvasWriter, frame: FrameInfo)
	{
		// Lines
		const area = this.layout.plotArea;
		const points = [
			{ x: area.left, y: area.top },
			{ x: area.left, y: area.bottom },
			{ x: area.right, y: area.bottom }
		];
		writer.drawPolyline(this.color.scale.color, 2, points);

		// Scale labels
		this.drawScaleLabels(writer, frame, true);
		this.drawScaleLabels(writer, frame, false);

		// Axis Label X
		const boxX = {
			left: area.left,
			right: area.right,
			top: area.bottom,
			bottom: area.bottom + this.color.axis.offset
		};
		writer.drawBoxedText(X_LABEL, this.color.axis.font, this.color.axis.color, boxX);

		// Axis Label Y
		const boxY = {
			left: area.left - this.color.axis.offset,
			right: area.left,
			top: area.top,
			bottom: area.bottom
		};
		writer.drawBoxedText(Y_LABEL, this.color.axis.font, this.color.axis.color, boxY, -90);
	}

	private drawScaleLabels(writer: CanvasWriter, frame: FrameInfo, horizontal: boolean)
	{
		const area = this.layout.plotArea;
		const areaWidth = horizontal ?
			area.right - area.left :
			area.bottom - area.top;
		const scale = horizontal ?
			frame.scale.horizontal :
			frame.scale.vertical;
		const start = horizontal ? area.left : area.bottom;
		const reverse = !horizontal;
		const rotate = horizontal ? 0 : -90;
		const areaSegment = areaWidth / (scale.max - scale.min);
		const min = Math.ceil(scale.min);
		for (let labelValue = min; labelValue <= scale.max; labelValue++)
		{
			const labelText = ScaleLabelGenerator.generate(Math.pow(10, labelValue));
			const offset = areaSegment * (labelValue - scale.min);
			const pos = reverse ?
				start - offset :
				start + offset;
			const box = {
				left: horizontal ? pos - 50 : area.left - this.color.scale.offset,
				right: horizontal ? pos + 50 : area.left,
				top: horizontal ? area.bottom : pos - 50,
				bottom: horizontal ? area.bottom + this.color.scale.offset : pos + 50
			};
			writer.drawBoxedText(
				labelText,
				this.color.scale.font,
				this.color.scale.color,
				box,
				rotate);
		}
	}

	private drawDate(writer: CanvasWriter, date: DateTime)
	{
		writer.drawText(
			date.toISODate(),
			this.color.date.font,
			this.color.date.color,
			this.layout.datePosition);
	}
}
