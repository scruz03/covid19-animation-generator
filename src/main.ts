
// Dependencies
import * as path from 'path';

// Local
import ConfigLoader from './configuration/ConfigLoader';
import DataLoader from './data/DataLoader';
import ImageGenerator from './drawing/ImageGenerator';
import ParameterLoader from './parameters/ParametersLoader';
import MilestonesLoader from './data/MilestonesLoader';
import DataSourceFilter from './util/DataSourceFilter';

// Constants
const OUTPUT_PATH = path.join(__dirname, '../output');

// Main
const main = async () =>
{
	// Help
	if (ParameterLoader.help())
		return;

	// Read arguments and configuration
	const config = await ConfigLoader.load ();
	const options = ParameterLoader.load(config.defaults);

	// Read data
	let dataSource = config.dataSources[options.source];
	if (!dataSource)
		throw new Error(`Data source not found: ${options.source}`);
	if (options.filter)
		dataSource = DataSourceFilter.apply(dataSource, options.filter);
	let timeSeries = await DataLoader.load (dataSource);

	// Milestones
	if (options.milestoneSource)
	{
		const milestoneSource = config.milestoneSources[options.milestoneSource];
		if (!milestoneSource)
			throw new Error(`Milestone source not found: ${options.milestoneSource}`);
		timeSeries = await MilestonesLoader.load(
			timeSeries,
			options.milestoneSource,
			milestoneSource);
	}

	// Generate
	const colorSchema = config.colorSchemas[options.schema];
	if (!colorSchema)
		throw new Error(`Color schema not found: ${options.schema}`);
	const layout = config.layouts[options.layout];
	if (!layout)
		throw new Error(`Layout not found: ${options.layout}`);
	const generator = new ImageGenerator(
		timeSeries,
		dataSource.series,
		colorSchema,
		layout);
	await generator.generate(
		OUTPUT_PATH,
		options.frames,
		options.extraFrames,
		options.days);
};

(async () =>
{
	try {
		await main();
	}
	catch (e)
	{
		console.log(e);
		process.exit(1);
	}
})();
