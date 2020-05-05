
import ChileCuarentenaMilestonesProcessor from './ChileCuarentenaMilestonesProcessor';
import { TimeSeries } from '../util/Types';
import Downloader from '../util/Downloader';

const PROCESSORS: { [key: string]: (input: TimeSeries[], milestones: any[]) => TimeSeries[] } = {
	'chile-cuarentena': ChileCuarentenaMilestonesProcessor.process
};

export default class MilestonesLoader
{
	public static async load(series: TimeSeries[], name: string, url: string)
	{
		const processor = PROCESSORS[name];
		if (!processor)
			throw new Error(`Processor not found: ${name}`);

		const milestones = await Downloader.download(url);
		return processor(series, milestones);
	}
}
