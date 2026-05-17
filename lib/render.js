import { SITE, url as buildUrl, amphtml, escapeHTML } from "./config";
import styles from "./render/styles.js";
import scripts from "./render/scripts.js";
import header from "./render/header.js";
import footer from "./render/footer.js";

export function layout({
title=SITE.name,
description=SITE.description,
canonical="",
image="",
schema="",
robots="",
content=""
}){

const canonicalUrl=canonical||SITE.domain;
const ampUrl=amphtml(canonicalUrl.replace(SITE.domain,""));
const ogImage=image||buildUrl(SITE.defaultImage);

return new Response(`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHTML(title)}</title>
<meta name="description" content="${escapeHTML(description)}">
<link rel="canonical" href="${canonicalUrl}">
<link rel="amphtml" href="${ampUrl}">
${styles()}
${robots||""}
${schema||""}
</head>
<body>

${header(SITE.name)}

<main class="container">
${content}
</main>

${footer(SITE.name)}

${scripts()}

</body>
</html>`,{
headers:{
"content-type":"text/html;charset=UTF-8",
"cache-control":"public,max-age=300"
}
});
}
