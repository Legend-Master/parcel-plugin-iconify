import path from 'node:path'
import { Resolver } from '@parcel/plugin'

export default new Resolver({
	async resolve({ pipeline, specifier, dependency }) {
		if (pipeline === 'iconify-icon') {
			// Pass dataurl option to transformer
			const query =
				dependency.specifierType === 'url' ? new URLSearchParams({ dataurl: 'true' }) : undefined
			return {
				filePath: path.join(__dirname, specifier),
				code: specifier,
				query,
			}
		}
	},
})
