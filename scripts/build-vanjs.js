const vanJsConv = import('vanjs-converter');

module.exports =  {
    buildSource: async (svg, componentName, format, isDeprecated) => {
        const {htmlToVanCode} = await vanJsConv;
        let _import = format == 'esm' ? `import van from 'vanjs-core';` : 'const van = require("vanjs-core");';
        let _export = format == 'esm' ? 'export default' : 'module.exports =';
        let _deprecated = isDeprecated ? `/** @deprecated */` : '';
        let {code, tags, components} = htmlToVanCode(svg, {skipEmptyText: true, spacing: false, indent: 4}); 
        //console.log({svg, componentName, format, code, tags, components})
        let [outer, ...rest] = code, close = rest.pop();
        outer = outer.replace('"},', '", "aria-labelledby": titleId, ...props},');
        let tagsImport = tags.length ? `const { ${tags.join(', ')} } = van.tags;` : '';
        let compImport = components.length ? `const { ${components.join(', ')} } = van.tagsNs('http://www.w3.org/2000/svg');` : '';
        return `
${_import}
${tagsImport}
${compImport}
${_deprecated}
function ${componentName}({title, titleId, ...props}, ...children) {
    let extra = van.val(title) ? [van.tags.title({id: titleId}, title)] : [];
    let inner = [  ...extra, ...children,
    ${rest.join('\n')} 
    ];
    
    return ${outer} ...inner ${close};
}
${_export} ${componentName};
        `;
    },
    buildTypes: (types, {package, style, format, componentName, svg, isDeprecated }) =>{
        types.push('import {ChildDom, TagFunc} from "vanjs-core";');
        if (isDeprecated) {
          types.push(`/** @deprecated */`)
        }
        types.push(`declare const ${componentName}: TagFunc<ChildDom>;`);
        types.push(`export default ${componentName};`)
    }

} 