const template = document.createElement('sidebar');
template.innerHTML = `
<div>
    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
    <a class="navitem" href="/index.html">home</a> 
    <a class="navitem" href="/static/writings.html">writings</a>
    <a class="navitem" href="/static/poetry.html">poetry</a>
</div>
`
let sidebarNode = document.getElementById("side-bar")

sidebarNode.appendChild(template);
