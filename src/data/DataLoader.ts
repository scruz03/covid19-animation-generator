
// Dependencies
import * as Enumerable from 'linq';
import { DateTime } from 'luxon';

// Local
import { DataSource, TimeSeries } from '../util/Types';
import Downloader from '../util/Downloader';

// Constants
const DATE_REGEXP = /^\d+\/\d+\/\d+$/;

export default class DataLoader
{
	public static async load(dataSource: DataSource): Promise<TimeSeries[]>
	{
		const csvData = await Downloader.download(dataSource.url);
		const data = csvData.map(item => ({
			name: item[dataSource.nameColumn],
			data: Object
				.keys(item)
				.map(k => DATE_REGEXP.exec(k))
				.filter(match => match)
				.map(match => ({
					date: DateTime.fromString(match![0], 'L/d/yy'),
					value: parseInt(item[match![0]], 0)
				}))
		}));

		return Enumerable
			.from(data)
			.groupBy(x => x.name)
			.select(group => ({
				name: group.key(),
				data: group
					.selectMany(x => x.data)
					.groupBy(x => (+x.date))
					.select(group2 => ({
						date: group2.first().date,
						value: group2.sum(x => x.value)
					}))
					.orderBy(x => x.date)
					.toArray(),
				// Milestones should be loaded later
				milestones: null
			}))
			.toArray();
	}
}
