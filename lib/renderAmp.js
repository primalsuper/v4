import { SITE, amphtml, escapeHTML } from "./config";

import renderAmpStyles from "./renderAmp/styles/index.js";
import header from "./renderAmp/header.js";
import body from "./renderAmp/body.js";
import footer from "./renderAmp/footer.js";

function layoutAmp({
title=SITE.name,
description=SITE.description,
canonical="",
schema="",
content="",
type='home'
}){

const ampUrl=amphtml(canonical.replace(SITE.domain,""));

return new Response(`<!doctype html>
<html amp lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,minimum-scale=1">

<title>${escapeHTML(title)}</title>

<meta name="description" content="${escapeHTML(description)}">

<link rel="canonical" href="${canonical}">

<script async src="https://cdn.ampproject.org/v0.js"></script>

<style amp-custom>

${renderAmpStyles(type)}

</style>

${schema||""}

</head>

<body>

${header(SITE.name)}

${body(content)}

${footer(SITE.name)}

</body>
</html>`,{
headers:{
"content-type":"text/html;charset=UTF-8",
"cache-control":"public,max-age=300"
}
});
}

export {
layoutAmp,
layoutAmp as renderAmp
};
