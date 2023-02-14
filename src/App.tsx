import { Project } from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import { mcdocLoader } from './dependency'
import sourceUrl from './example.mcdoc?url'
import { Externals } from './externals'
import { useAsync } from './hooks/useAsync'

const CACHE_ROOT = 'file://cache/'
const PROJECT_ROOT = 'file://root/'
const MAIN_FILE = 'file://root/main.mcdoc'

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
				mcdocLoader,
				mcdoc.initialize,
			],
		})
		await project.init()
		return project
	})

	const { value: node } = useAsync(async () => {
		if (source === undefined || project === undefined) {
			return undefined
		}
		await project.externals.fs.writeFile(MAIN_FILE, source)
		const file = await project.fs.readFile(MAIN_FILE)
		console.log('FILE', file)
		await project.onDidOpen(MAIN_FILE, 'mcdoc', 0, source)
		const res = await project.ensureClientManagedChecked(MAIN_FILE)
		console.log('RESULT', res)
		return true
	}, [source, project])

	return <div class='p-4'>
		<p>{node}</p>
		<pre>{source}</pre>
	</div>
}
