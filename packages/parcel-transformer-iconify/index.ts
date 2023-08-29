import { Transformer } from '@parcel/plugin'
import PostHTML from 'posthtml'
import { render } from 'posthtml-render'
import { loadNodeIcon } from '@iconify/utils/lib/loader/node-loader'

async function addXmlns(svg: string) {
	const parsed = await PostHTML().process(svg)
	// @ts-ignore
	parsed.tree[0].attrs['xmlns'] = 'http://www.w3.org/2000/svg'
	// @ts-ignore
	return render(parsed.tree)
}

async function loadIcon(fullname: string, separator: string) {
	const [prefix, name] = fullname.split(separator)
	const svg = await loadNodeIcon(prefix!, name!)
	if (!svg) {
		throw Error(`Can't find an icon matching ${fullname}`)
	}
	return await addXmlns(svg)
}

export default new Transformer({
	async parse({ asset }) {
		if (asset.type !== 'html') {
			return
		}
		const postHtml = PostHTML()
		return {
			type: postHtml.name,
			version: postHtml.version,
			program: (await postHtml.process(await asset.getCode())).tree,
		}
	},

	async transform({ asset }) {
		if (asset.type === 'html') {
			const ast = await asset.getAST()
			if (!ast) {
				throw new Error('AST does not exist')
			}
			const icons = new Set<string>()
			ast.program.match({ tag: 'iconify-icon' }, (node: PostHTML.Node) => {
				const iconName = node?.attrs?.icon
				if (!iconName) {
					throw Error('No icon name provided')
				}
				icons.add(iconName)
				return node
			})
			const iconMap = new Map()
			const promises = []
			for (const iconName of icons) {
				promises.push(
					(async () => {
						iconMap.set(iconName, await loadIcon(iconName, ':'))
					})()
				)
			}
			await Promise.all(promises)
			ast.program.match({ tag: 'iconify-icon' }, (node: PostHTML.Node) =>
				iconMap.get(node.attrs?.icon)
			)
			asset.setAST(ast)
		} else if (asset.pipeline === 'iconify-icon') {
			asset.bundleBehavior = 'inline'
			asset.meta.inlineType = 'string'
			const code = await loadIcon(await asset.getCode(), '/')
			asset.setCode(
				asset.query.get('dataurl') ? `data:image/svg+xml,${encodeURIComponent(code)}` : code
			)
		}
		return [asset]
	},

	generate({ asset, ast }) {
		return {
			content: asset.type === 'html' ? render(ast.program) : '',
		}
	},
})
