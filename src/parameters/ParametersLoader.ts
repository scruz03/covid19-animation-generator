
import * as optimist from 'optimist';

const PARAMETERS = {
	help: 'This help message',
	source: 'Sets the data source',
	schema: 'Sets the color schema',
	layout: 'Sets the output layout',
	days: 'Number of days for which the animation will be generated. Use 0 to plot all days.',
	frames: 'Number of frames per day',
	extraFrames: 'Number of extra frames for the last image',
	milestoneSource: 'Milestone source',
	filter: 'Filter codes separated by comma (eg: US,CL)'
};
const argv = optimist.argv;

export default class ParametersLoader
{
	public static help()
	{
		if (!argv.help)
			return false;

		console.log('Optional parameters:');
		for (const name of Object.keys(PARAMETERS))
			// @ts-ignore
			console.log(`  --${name}: ${PARAMETERS[name]}`);

		return true;
	}

	public static load(defaults: any)
	{
		const options: any = {};
		for (const name of Object.keys(PARAMETERS))
			options[name] = Object.keys(argv).includes(name) ?
				argv[name] :
				defaults[name];
		return options;
	}
}
