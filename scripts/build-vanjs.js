const vanJsConv = import('vanjs-converter');

const viewBoxPattern = /viewBox="\d+ \d+ (\d+) (\d+)"/;
function getViewBox(svg) {
    let match = svg.match(viewBoxPattern);
    return match ? [true, parseInt(match[1]), parseInt(match[2])] : [false];
}

module.exports =  {
    buildSource: async (svg, componentName, format, isDeprecated) => {
        const {htmlToVanCode} = await vanJsConv;
        const [hasViewBox, w, h] = getViewBox(svg);
        let _widthheight = hasViewBox ? `width: ${w}, height: ${h},` : '';
        let _import = format == 'esm' ? `import van from 'vanjs-core';` : 'const van = require("vanjs-core");';
        let _export = format == 'esm' ? 'export default' : 'module.exports =';
        let _deprecated = isDeprecated ? `/** @deprecated */` : '';
        let {code, tags, components} = htmlToVanCode(svg, {skipEmptyText: true, spacing: false, indent: 4}); 
        //console.log({svg, componentName, format, code, tags, components})
        let [outer, ...rest] = code, close = rest.pop();
        // all  svg  must use tagNS to work correctly. This does not work: //let tagsImport = tags.length ? `const { ${tags.join(', ')} } = van.tags;` : '';
        let _tags = (components.length||tags.length) ? `const { ${[...tags, ...components].join(', ')} } = van.tagsNS('http://www.w3.org/2000/svg');` : '';
        return `
${_import}
${_tags}
${_deprecated}
function ${componentName}({title, titleId, size, ...props} = {}, ...children) {
    let wh = size === false || props.width || props.height ? {} : (size ? {width: size, height: size} : { ${_widthheight} });
    let attrs = { ...wh, ...(titleId ? {"aria-labelledby": titleId} : {}), ...props};
    let extra = title ? [van.tags.title(titleId ? {id: titleId} : {}, title)] : [];
    let inner = [  ...extra, ...children,
    ${rest.join('\n')} 
    ];
    
    return ${outer.replace('"},', '", ...attrs},')} ...inner ${close};
}
${_export} ${componentName};
`;
    },
    buildTypes: ({componentName, svg, isDeprecated }) =>{
        return [
            'import {ChildDom, Props, PropsWithKnownKeys} from "vanjs-core";',
            isDeprecated && '/** @deprecated */',
            `declare const ${componentName}: (props?: { title?: string; titleId?: string; size?: number | false;} & Props & PropsWithKnownKeys<SVGElement>, ...children: ChildDom[]) => ChildDom;`,
            `export default ${componentName};`
        ].filter(x=>!!x).join('\n');
    },
} 