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
    var next = new Array();
    for(var i = 0; i < 4; i++){
        var xx = x + dir[i][0];
        var yy = y + dir[i][1];
        if(xx < 0 || yy < 0 || xx > r - 1 || yy > c - 1 || maze[xx][yy] == 1 || vis[xx * c + yy] == true) continue;
        next.push({x: xx, y: yy});
    }
    var len = next.length;
    for(var i = 0; i < len; i++){
        var xx = next[i].x;
        var yy = next[i].y;
        vis[xx * c + yy] = true;
        if(dfs(xx, yy, deep + 1) == true){
            if(deep == 0){
                var index = Math.floor(Math.random()*len);
                if(Math.random() >= 0.4 || len > 2)
                    enermy = {x: xx, y: yy};
                else
                    enermy = {x: next[index].x, y: next[index].y};
                enermyWaite = 150;
            }
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
    if(isEnd == false)
        window.requestAnimationFrame(enermyGo);
}

function start() {
    if(ready && isEnd){
        initMaze();
        isStart = true;
        isEnd = false;
        startAnimation(document.getElementById("stgame"));
        window.requestAnimationFrame(enermyGo);
    } 
    else
        document.getElementById("warning").style.display = "";
}

function checkGame() {
    if(now.x == r - 2 && now.y == c - 1){
        reset();
        startAnimation(document.getElementById("win"))
    }
    else if(now.x == enermy.x && now.y == enermy.y){
        reset();
        startAnimation(document.getElementById("lose"));
    }
}

function reset() {
    now = {x: 2, y: 0};
    enermy = {x: -1, y: -1};
    enermyWaite = 2000;
    isStart = false;
    isEnd = true;
    initMaze();
}

function closeWarning() {
    document.getElementById("warning").style.display = "none";
}

function startAnimation(element) {
    element.classList.add("tipanimation");
    // element.style.animationPlayState = "running";
    element.addEventListener("animationend", function() {
        this.classList.remove("tipanimation");
    });
}