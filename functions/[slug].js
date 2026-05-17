import { layout } from "../lib/render";
import { getPosts, getPost } from "../lib/api";
import {
SITE,
canonical,
ogImage,
sanitizeSlug,
stripHTML,
readingTime,
cleanDescription,
postImage,
cardImage,
escapeHTML
} from "../lib/config";
import { seo } from "../lib/seo";
import { withCache } from "../lib/cache";

export async function onRequest(context){
	return withCache(
		context,
		300,
		async()=>{

			try{
				let { slug }=context.params;
				slug=sanitizeSlug(slug);

				const post=await getPost(slug);

				if(!post){
					return new Response("404 Not Found",{status:404});
				}

				const posts=await getPosts();

				const related=posts
					.filter(p=>
						sanitizeSlug(p.slug)!==slug &&
						p.kategori===post.kategori
					)
					.slice(0,6);

				const linkedContent=autoLink(post.content,related);

				const tocData=generateTOC(linkedContent);

				const read=readingTime(linkedContent);

				let desc=stripHTML(linkedContent).slice(0,160);
				desc=cleanDescription(desc);

				const url=canonical("/"+slug);
				const og=ogImage(slug);

				const breadcrumb=`
<nav class="breadcrumb">
<a href="/">Home</a>
<span>›</span>
<a href="/kategori/${sanitizeSlug(post.kategori)}">${escapeHTML(post.kategori)}</a>
<span>›</span>
<span>${escapeHTML(post.title)}</span>
</nav>
`;

				const relatedHTML=related.map(p=>`
<div class="card">
<a href="/${p.slug}">
${cardImage(ogImage(p.slug),p.title)}
<h3>${p.title}</h3>
</a>
</div>
`).join("");

				return layout({
					title:post.title,
					description:desc,
					canonical:url,
					image:og,
					schema:seo({
						title:post.title,
						description:desc,
						slug,
						kategori:post.kategori,
						published:post.created,
						updated:post.updated
					}),
					content:`
${breadcrumb}

<article class="post">
${postImage(og,post.title)}
<h1>${post.title}</h1>
<p>⏱ ${read} min read</p>

<div class="post-content">
${tocData.toc}
${tocData.content}
</div>

<div class="post-tags">
<a href="/kategori/${sanitizeSlug(post.kategori)}">
#${escapeHTML(post.kategori)}
</a>
</div>
</article>

<h2>Artikel Terkait</h2>

<div class="grid">
${relatedHTML}
</div>
`
				});

			}catch(e){
				return new Response("Error: "+e.message,{status:500});
			}

		}
	);
}

function autoLink(content="",related=[]){
	let total=0;
	const MAX=8;
	const used=new Set();

	const parser=related.map(p=>{
		const title=stripHTML(p.title);
		const slug=sanitizeSlug(p.slug);

		const words=title
			.toLowerCase()
			.split(" ")
			.filter(w=>w.length>3);

		const keyword=words.slice(0,3).join(" ");

		return { title,slug,keyword };
	});

	return content.replace(
		/(<a[^>]*>.*?<\/a>)|>([^<]+)</gis,
		(match,link,text)=>{

			if(link){
				return link;
			}

			let result=text;

			for(const item of parser){
				if(total>=MAX)break;

				if(!item.keyword||used.has(item.keyword)){
					continue;
				}

				const regex=new RegExp(`\\b${escapeRegex(item.keyword)}\\b`,"i");

				if(regex.test(result)){
					result=result.replace(
						regex,
						`<a href="/${item.slug}">${item.keyword}</a>`
					);

					used.add(item.keyword);
					total++;
				}
			}

			return ">"+result+"<";
		}
	);
}

function escapeRegex(str=""){
	return str.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
}

function generateTOC(html=""){
	const headings=[];
	const content=html.replace(
		/<h2>(.*?)<\/h2>/gi,
		(match,title)=>{
			const clean=stripHTML(title);
			const id=sanitizeSlug(clean);

			headings.push({ id,title:clean });

			return `<h2 id="${id}">${title}</h2>`;
		}
	);

	if(!headings.length){
		return { toc:"",content };
	}

	const toc=`
<details class="toc">
<summary class="toc-title">
<span>📑 Daftar Isi</span>
<span class="toc-toggle"></span>
</summary>
<ul>
${headings.map(h=>`
<li><a href="#${h.id}">${escapeHTML(h.title)}</a></li>
`).join("")}
</ul>
</details>
`;

	return { toc,content };
}
