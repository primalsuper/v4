import { SITE, canonical, amphtml, ogImage, sanitizeSlug, escapeHTML, escapeJSON } from "./config";

export function seo({ title="", description="", slug="", image="", type="article", published="", updated="", kategori="" }){
	const safeSlug=sanitizeSlug(slug);
	const url=canonical(safeSlug?"/"+safeSlug:"/");
	const amp=amphtml(safeSlug?"/"+safeSlug:"/");
	const og=image||ogImage(safeSlug);
	const datePublished=published||new Date().toISOString();
	const dateModified=updated||datePublished;

	return `
<title>${escapeHTML(title)}</title>
<meta name="description" content="${escapeHTML(description)}">
<link rel="canonical" href="${url}">
<link rel="amphtml" href="${amp}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${escapeHTML(title)}">
<meta property="og:description" content="${escapeHTML(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHTML(title)}">
<meta name="twitter:description" content="${escapeHTML(description)}">
<meta name="twitter:image" content="${og}">
<script type="application/ld+json">
{
"@context":"https://schema.org",
"@type":"BlogPosting",
"headline":"${escapeJSON(title)}",
"description":"${escapeJSON(description)}",
"image":"${og}",
"url":"${url}",
"mainEntityOfPage":"${url}",
"datePublished":"${datePublished}",
"dateModified":"${dateModified}",
"articleSection":"${escapeJSON(kategori||"Artikel")}",
"author":{
"@type":"Organization",
"name":"${escapeJSON(SITE.name)}"
},
"publisher":{
"@type":"Organization",
"name":"${escapeJSON(SITE.name)}",
"logo":{
"@type":"ImageObject",
"url":"${canonical("/logo.png")}"
}
}
}
</script>
<script type="application/ld+json">
{
"@context":"https://schema.org",
"@type":"BreadcrumbList",
"itemListElement":[
{
"@type":"ListItem",
"position":1,
"name":"Home",
"item":"${SITE.domain}"
},
{
"@type":"ListItem",
"position":2,
"name":"${escapeJSON(kategori||"Artikel")}",
"item":"${SITE.domain}"
},
{
"@type":"ListItem",
"position":3,
"name":"${escapeJSON(title)}",
"item":"${url}"
}
]
}
</script>
`;
}
