import * as mcdoc from '@spyglassmc/mcdoc'
import { useMemo } from 'preact/hooks'
import { FieldPreview } from './FieldPreview'

interface Props {
	node: mcdoc.StructNode
}
export function StructPreview({ node }: Props) {
	console.log('STRUCT', node)
	const identifier = useMemo(() => {
		return node.children.find(mcdoc.IdentifierNode.is)?.value
	}, [node])
	const fields = useMemo(() => {
		const body = node.children.find(mcdoc.StructBlockNode.is)
		return body?.children.filter(mcdoc.StructPairFieldNode.is)
	}, [node])

	return <div class="m-2 font-mono">
		<h3>{identifier}</h3>
		<ul class="list-disc pl-6">
			{fields?.map(f => <FieldPreview node={f} />)}
		</ul>
	</div>
}
