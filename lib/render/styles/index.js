import globalStyle from './global.js'
import homeStyle from './home.js'
import postStyle from './post.js'
import kategoriStyle from './kategori.js'

export default function renderAmpStyles(type='home'){
return `
${globalStyle()}
${type === 'home' ? homeStyle() : ''}
${type === 'post' ? postStyle() : ''}
${type === 'kategori' ? kategoriStyle() : ''}
`
}
