
import { DataSource } from './Types';

export default class DataSourceFilter
{
	public static apply(source: DataSource, filter: string): DataSource
	{
		const accepted = filter.split(',');
		return {
			url: source.url,
			nameColumn: source.nameColumn,
			preProcessor: source.preProcessor,
			series: source.series.filter(serie => accepted.includes(serie.code))
		};
	}
}
