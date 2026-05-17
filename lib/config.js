// ====================== GLOBAL SITE CONFIG ======================
export const SITE={
	name:"LebahHack",
	domain:"https://web.lebahhack.net",
	ampDomain:"https://web.lebahhack.net/amp",
	description:"Platform digital modern yang menyediakan berbagai tools, informasi teknologi, tutorial, dan solusi online dengan akses cepat, ringan, dan mudah digunakan untuk semua pengguna.",
	defaultImage:"/og/default"
};

// ====================== API CONFIG ======================
export const API_BASE="https://web.lebahhack.workers.dev";

// ====================== URL HELPERS ======================
export function url(path=""){
	if(!path.startsWith("/")) path="/"+path;
	return SITE.domain+path;
}

export function amphtml(path=""){
	if(!path.startsWith("/")) path="/"+path;
	return SITE.ampDomain+path;
}

export function canonical(path=""){
	return url(path);
}

export function ogImage(slug=""){
	return slug?url("/og/"+sanitizeSlug(slug)):url(SITE.defaultImage);
}

// ====================== SLUG SANITIZER ======================
export function sanitizeSlug(str=""){
	return encodeURIComponent(
		String(str)
			.toLowerCase()
			.replace(/<[^>]*>?/gm,"")
			.replace(/['"]/g,"")
			.replace(/[^a-z0-9\s-]/g,"")
			.replace(/\s+/g,"-")
			.replace(/-+/g,"-")
			.trim()
	);
}

// ====================== TEXT HELPERS ======================
export function stripHTML(html=""){
	return String(html)
		.replace(/<script[\s\S]*?<\/script>/gi,"")
		.replace(/<style[\s\S]*?<\/style>/gi,"")
		.replace(/<[^>]*>?/gm,"")
		.replace(/\s+/g," ")
		.trim();
}

export function cleanDescription(str=""){
	return stripHTML(str)
		.replace(/\s+/g," ")
		.trim();
}

export function readingTime(text=""){
	const words=stripHTML(text).split(/\s+/).length;
	return Math.max(1,Math.ceil(words/200));
}

// ====================== IMAGE HELPERS ======================
export function cardImage(src,alt=""){
	return `
<img src="${src}" alt="${escapeHTML(alt)}" loading="lazy" decoding="async" width="400" height="210">
`;
}

export function postImage(src,alt=""){
	return `
<img src="${src}" alt="${escapeHTML(alt)}" fetchpriority="high" loading="eager" decoding="async" width="1200" height="630">
`;
}

// ====================== ESCAPE HELPERS ======================
export function escapeHTML(str=""){
	return String(str).replace(/[&<>"]/g,s=>({
		"&":"&amp;",
		"<":"&lt;",
		">":"&gt;",
		'"':"&quot;"
	}[s]));
}

export function escapeJSON(str=""){
	return String(str)
		.replace(/\\/g,"\\\\")
		.replace(/"/g,'\\"')
		.replace(/\n/g," ");
}
