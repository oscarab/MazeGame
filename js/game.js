async function init() {
    document.getElementById("warning").style.display = "none";
    await initMaze();
    await initAI();
}

var vis = new Array();
function dfs(x, y, deep) {
    if(x == now.x && y == now.y) return true;
    if(enermyWaite > 0){
        enermyWaite--;
        return false;
    }
    if(x == -1){
        enermy = {x: 2, y: 0};
        x = 2;
        y = 0;
    }
    for(var i = 0; i < 4; i++){
        var xx = x + dir[i][0];
        var yy = y + dir[i][1];
        if(xx < 0 || yy < 0 || xx > r - 1 || yy > c - 1 || maze[xx][yy] == 1 || vis[xx * c + yy] == true) continue;
        vis[xx * c + yy] = true;
        if(dfs(xx, yy, deep + 1) == true){
            if(deep == 0) enermy = {x: xx, y: yy}, enermyWaite = 200;
            return true;
        }
        vis[xx * c + yy] = false;
    }
    return false;
}

async function enermyGo(){
    for(var i = 0; i <= r * c; i++){
        vis[i] = false;
    }
    vis[enermy.x * c + enermy.y] = true;
    dfs(enermy.x, enermy.y, 0);
    checkGame();
    window.requestAnimationFrame(enermyGo);
}

function start() {
    if(ready){
        isStart = true;
        document.getElementById("cnt").style.animationPlayState = "running";
        window.requestAnimationFrame(enermyGo);
    } 
    else
        document.getElementById("warning").style.display = "";
}

function checkGame() {
    if(now.x == r - 2 && now.y == c - 1){
        reset();
        document.getElementById("win").style.animationPlayState = "running";
    }
    else if(now.x == enermy.x && now.y == enermy.y){
        reset();
        document.getElementById("lose").style.animationPlayState = "running";
    }
}

function reset() {
    now = {x: 2, y: 0};
    enermy = {x: -1, y: -1};
    enermyWaite = 1200;
    isStart = false;
    initMaze();
}

function closeWarning() {
    document.getElementById("warning").style.display = "none";
}