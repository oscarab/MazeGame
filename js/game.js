async function init() {
    document.getElementById("warning").style.display = "none";
    await initMaze();
    await initAI();
}

var vis = new Array();
function dfs(x, y, deep) {      //通过dfs搜索走向玩家的路径
    if(x == now.x && y == now.y) return true;
    if(enemyWaite > 0){
        enemyWaite--;
        return false;
    }
    if(x == -1){
        enemy = {x: 2, y: 0};
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
                var last = Object.assign({}, enemy);
                if(Math.random() >= 0.4 || len <= 2)
                    enemy = {x: xx, y: yy};
                else
                    enemy = {x: next[index].x, y: next[index].y};
                redrawBot(last);
            }
            return true;
        }
        vis[xx * c + yy] = false;
    }
    return false;
}

function enemyGo(){
    for(var i = 0; i <= r * c; i++){
        vis[i] = false;
    }
    vis[enemy.x * c + enemy.y] = true;
    updateProgress();               //更新进度条
    dfs(enemy.x, enemy.y, 0);       //让敌人走一步
    checkGame();                    //检查游戏是否已经结束
}

//时间格式化，加前缀零
function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

//开始游戏
function start() {
    if(ready && isEnd){
        initMaze();
        isStart = true;
        isEnd = false;
        document.getElementById("startgame").disabled = true;
        timecnt = setInterval(function(){
            sec++;
            var min = parseInt(sec / 60);
            document.getElementById("recode-text").innerText = PrefixInteger(min, 2) + ":" + PrefixInteger(sec % 60, 2);
        }, 1000);
        startAnimation(document.getElementById("stgame"));
        enemyThread = setInterval(enemyGo, 1000);
    } 
    else
        document.getElementById("warning").style.display = "";
}

//检查游戏是否结束
function checkGame() {
    if(now.x == r - 2 && now.y == c - 1){   //玩家胜利
        reset();
        startAnimation(document.getElementById("win"));
    }
    else if(now.x == enemy.x && now.y == enemy.y){    //玩家失败
        reset();
        startAnimation(document.getElementById("lose"));
    }
}

//重置游戏
function reset() {
    now = {x: 2, y: 0};
    enemy = {x: -1, y: -1};
    enemyWaite = 30;
    isStart = false;
    isEnd = true;
    document.getElementById("startgame").disabled = false;
    window.clearInterval(timecnt);
    window.clearInterval(enemyThread);
    sec = 0;
    initMaze();
}

//关闭警告框
function closeWarning() {
    document.getElementById("warning").style.display = "none";
}

//播放动画
function startAnimation(element) {
    element.classList.add("tipanimation");
    element.addEventListener("animationend", function() {
        this.classList.remove("tipanimation");
    });
}

//更新进度条
function updateProgress(){
    var percent =  1 - (((r - 2) - now.x) + ((c - 1) - now.y)) / (((r - 2) - 2) + ((c - 1) - 0));
    percent *= 100;
    percent = parseInt(percent);
    var mazeprogress = document.getElementById("mazeprogress");
    mazeprogress.style.width = percent + "%";
    mazeprogress.innerHTML = percent + "%";
}