export default function scripts(){
return `
<script>
const menuToggle=document.getElementById("menuToggle");
const mobileNav=document.getElementById("mobileNav");
const closeMenu=document.getElementById("closeMenu");
const mobileOverlay=document.getElementById("mobileOverlay");

function openMenu(){
mobileNav.classList.add("active");
mobileOverlay.classList.add("active");
document.body.style.overflow="hidden";
}

function closeMobileMenu(){
mobileNav.classList.remove("active");
mobileOverlay.classList.remove("active");
document.body.style.overflow="";
}

menuToggle.onclick=openMenu;
closeMenu.onclick=closeMobileMenu;
mobileOverlay.onclick=closeMobileMenu;

document.addEventListener("keydown",(e)=>{
if(e.key==="Escape"){
closeMobileMenu();
}
});
</script>
`
}
