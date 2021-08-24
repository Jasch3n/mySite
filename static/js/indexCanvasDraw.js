const canvas = document.getElementById("index-overlay-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const overlayWrapper = document.getElementById("overlay-wrapper")

const SQUARE_SIDE_LEN = 9;
overlayWrapper.addEventListener("mousemove", e => {
    ctx.save();

    ctx.fillStyle = "rgba(255, 255, 255, 0.05)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const x = e.clientX 
    const y = e.clientY
    // console.log(x, y);
    // ctx.clearRect(0, 0, canvas.height, canvas.width);

    drawRandomRect(x, y)
    setTimeout(() => {
        ctx.clearRect(x - 7, y - 7, SQUARE_SIDE_LEN * 5, SQUARE_SIDE_LEN * 5)
    }, 250)
    ctx.restore();
});

const drawRandomRect = (x, y) => {
    const randRot = Math.random() * 2 * Math.PI;
    ctx.translate(x + (SQUARE_SIDE_LEN / 2), y + (SQUARE_SIDE_LEN / 2));
    ctx.rotate(randRot);

    const randNum = Math.random() * 10
    let randomColorStr;
    if (randNum <= 3) randomColorStr = "rgba(183,110,121, 1)";
    else if (randNum >= 4 && randNum <= 10) randomColorStr = "rgba(255,192,203, 1)"
    else randomColorStr = "rgba(250,250,210, 1)"

    if (randNum <= 5) {
        ctx.fillStyle = randomColorStr;
        ctx.fillRect(0, 0, SQUARE_SIDE_LEN, SQUARE_SIDE_LEN);
    } else {
        ctx.strokeStyle = randomColorStr;
        ctx.beginPath();
        ctx.rect(0, 0, SQUARE_SIDE_LEN, SQUARE_SIDE_LEN);
        ctx.stroke();
    }
    
}
