import type * as core from '@spyglassmc/core'
import { BrowserExternals } from '@spyglassmc/core/lib/browser'
import * as zip from '@zip.js/zip.js'

export const Externals: core.Externals = {
	...BrowserExternals,
	archive: {
		...BrowserExternals.archive,

		async decompressBall(buffer) {
			const reader = new zip.ZipReader(new zip.BlobReader(new Blob([buffer])))
			const entries = await reader.getEntries()
			return await Promise.all(entries
				.map(async e => {
					const writer = new zip.Uint8ArrayWriter()
					return {
						data: await e.getData?.(writer),
						path: e.filename,
						mtime: '',
						type: '',
						mode: 0,
					}
				})
			)
		},
	},
}
