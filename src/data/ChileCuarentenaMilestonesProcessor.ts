
import { TimeSeries } from '../util/Types';
import { DateTime } from 'luxon';

const GREEN = '#AEFF92';
const RED = '#FF9292';
const YELLOW = '#FFD67A';

export default class ChileCuarentenaMilestonesProcessor
{
	public static process(series: TimeSeries[]): TimeSeries[]
	{
		return series.map(serie => ({
			name: serie.name,
			data: serie.data,
			milestones: [
				{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
				{ date: DateTime.fromISO('2020-04-09'), color: YELLOW },
			]
		}));
	}
}
