const template = document.createElement('sidebar');
const IS_ONLINE = false

template.innerHTML = `
    <div>
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
        <a class="navitem" href="/mySite/index.html">home</a> 
        <a class="navitem" href="/mySite/static/writings.html">writings</a>
        <a class="navitem" href="/mySite/static/poetry.html">poetry</a>
    </div>
    `

if (IS_ONLINE) {
    console.log("Website is in online version")
    template.innerHTML = `
    <div>
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
        <a class="navitem" href="/mySite/index.html">home</a> 
        <a class="navitem" href="/mySite/static/writings.html">writings</a>
        <a class="navitem" href="/mySite/static/poetry.html">poetry</a>
    </div>
    `
} else {
    console.log("Website is in offline version!")
    template.innerHTML = `
    <div>
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
        <a class="navitem" href="/index.html">home</a> 
        <a class="navitem" href="/static/writings.html">writings</a>
        <a class="navitem" href="/static/poetry.html">poetry</a>
    </div>
    `
}

let sidebarNode = document.getElementById("side-bar")

sidebarNode.appendChild(template);