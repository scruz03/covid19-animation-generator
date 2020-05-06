
import { TimeSeries, Milestone } from '../util/Types';
import { DateTime } from 'luxon';

const GREEN = '#AEFF92';
const RED = '#FF9292';
const YELLOW = '#FFD67A';

const MILESTONES: { [key: string]: Milestone[] } = {
	'Santiago': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-03-26'), color: RED },
		{ date: DateTime.fromISO('2020-04-14'), color: YELLOW },
	],
	'Punta Arenas': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-04-01'), color: RED },
	],
	'Puente Alto': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-04-09'), color: YELLOW },
	],
	'Vitacura': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-03-26'), color: RED },
		{ date: DateTime.fromISO('2020-04-14'), color: GREEN },
	],
	'Temuco': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-03-28'), color: RED },
		{ date: DateTime.fromISO('2020-05-01'), color: GREEN },
	],
	'Las Condes': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-03-26'), color: RED },
		{ date: DateTime.fromISO('2020-04-17'), color: GREEN },
	],
	'Independencia': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-03-26'), color: RED },
		{ date: DateTime.fromISO('2020-04-03'), color: GREEN },
		{ date: DateTime.fromISO('2020-04-23'), color: YELLOW },
		{ date: DateTime.fromISO('2020-04-30'), color: RED },
	],
	'Quilicura': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
	],
	'Recoleta': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
	],
	'Providencia': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-03-26'), color: RED },
		{ date: DateTime.fromISO('2020-04-14'), color: GREEN },
	],
	'Osorno': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-03-30'), color: RED },
		{ date: DateTime.fromISO('2020-05-01'), color: GREEN },
	],
	'Ñuñoa': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-03-26'), color: RED },
		{ date: DateTime.fromISO('2020-04-14'), color: YELLOW },
	],
	'Chillán': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-03-30'), color: RED },
		{ date: DateTime.fromISO('2020-04-23'), color: GREEN },
	],
	'Hualpén': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-04-06'), color: RED },
		{ date: DateTime.fromISO('2020-04-17'), color: GREEN },
	],
	'Padre Las Casas': [
		{ date: DateTime.fromISO('2020-01-01'), color: GREEN },
		{ date: DateTime.fromISO('2020-03-28'), color: RED },
		{ date: DateTime.fromISO('2020-04-17'), color: GREEN },
	],
};
const NONE = [{ date: DateTime.fromISO('2020-01-01'), color: GREEN }];

export default class ChileCuarentenaMilestonesProcessor
{
	public static process(series: TimeSeries[]): TimeSeries[]
	{
		return series.map(serie => ({
			name: serie.name,
			data: serie.data,
			milestones: MILESTONES[serie.name] || NONE
		}));
	}
}
