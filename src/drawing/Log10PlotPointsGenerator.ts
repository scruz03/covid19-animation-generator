import * as Enumerable from 'linq';
import { DataPoint, PlotPoint } from '../util/Types';
import { DateTime } from 'luxon';

export default class Log10PlotPointsGenerator
{
	public static generate(points: DataPoint[]): PlotPoint[]
	{
		return points
			.map((point, index) =>
			{
				const x = Math.log10(point.value);
				// const diff = point.date.diffNow();
				// const x = Math.floor(43 + diff.as('days'));
				// console.log(diff.toISO(), x);
				const previous = points[Math.max(0, index - 7)];
				const y = Math.log10(point.value - previous.value);
				return { x, y, date: point.date };
			})
			.filter(point =>
				point.x > -Infinity &&
				point.y > -Infinity &&
				point.x < Infinity &&
				point.y < Infinity);
	}
}
