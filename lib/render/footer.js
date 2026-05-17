export default function footer(siteName){
return `
<footer class="footer">
<div class="footer-bottom">
© ${new Date().getFullYear()} ${siteName}
</div>
</footer>
`
}
