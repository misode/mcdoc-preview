import * as mcdoc from '@spyglassmc/mcdoc'
import { useMemo } from 'preact/hooks'

interface Props {
	node: mcdoc.StructPairFieldNode
}
export function FieldPreview({ node }: Props) {
	const identifier = useMemo(() => {
		return node.children.find(mcdoc.IdentifierNode.is)?.value
	}, [node])

	return <li>
		<span>{identifier}</span>
	</li>
}
