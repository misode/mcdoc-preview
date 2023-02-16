import { Project, VanillaConfig } from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import sourceUrl from './example.mcdoc?url'
import { Externals } from './externals'
import { useAsync } from './hooks/useAsync'

const CACHE_ROOT = 'file://cache/'
const PROJECT_ROOT = 'file://root/'
const MAIN_FILE = 'file://root/mod.mcdoc'

export function App() {
	const { value: source } = useAsync(async () => {
		const res = await fetch(sourceUrl)
		return await res.text()
	})

	const { value: project } = useAsync(async () => {
		const project = new Project({
			cacheRoot: CACHE_ROOT,
			projectRoot: PROJECT_ROOT,
			externals: Externals,
			initializers: [
				mcdoc.initialize,
				// mcdocLoader,
			],
			defaultConfig: {
				...VanillaConfig,
				env: {
					...VanillaConfig.env,
					dependencies: [
						// '@vanilla-mcdoc',
					],
				},
			},
		})
		await project.init()
		await new Promise(res => project.on('ready', res))
		return project
	})

	const { value: node } = useAsync(async () => {
		if (source === undefined || project === undefined) {
			return undefined
		}
		await project.externals.fs.writeFile(MAIN_FILE, source)
		project.emit('fileCreated', { uri: MAIN_FILE })
		await project.onDidOpen(MAIN_FILE, 'mcdoc', 0, source)
		const res = await project.ensureClientManagedChecked(MAIN_FILE)
		if (res === undefined) {
			return undefined
		}
		return res.node
	}, [source, project])

	return <div class='p-4'>
		<p>{node?.type}</p>
		<pre>{source}</pre>
	</div>
}
