var list = new Array();
//使用prim算法生成迷宫
async function initMaze() {
    for(var i = 0; i < r; i++){
        maze[i] = new Array();
        for(var j = 0; j < c; j++){
            maze[i][j] = 1;
        }
    }
    maze[2][0] = 0;             //设置入口
    maze[2][1] = 0;
    maze[r - 2][c - 1] = 0;     //设置出口
    maze[r - 2][c - 2] = 0;
    list.push({x: 1,y: 1, face: 0});    //将当前格子四周的墙壁放入列表
    list.push({x: 2,y: 2, face: 1});
    list.push({x: 3,y: 1, face: 2});
    while(list.length > 0){
        var index = Math.floor(Math.random()*list.length);  //随机取一个墙壁
        var node = list[index];
        list.splice(index, 1);
        var target = {x: 0, y: 0, face: -1};    //计算当前墙壁对面的点(隔一个点相对)
        if(node.face == 0){
            target.x = node.x - 1;
            target.y = node.y;
        }
        else if(node.face == 1){
            target.x = node.x;
            target.y = node.y + 1;
        }
        else if(node.face == 2){
            target.x = node.x + 1;
            target.y = node.y;
        }
        else{
            target.x = node.x;
            target.y = node.y - 1;
        }
        if(target.x == 0 || target.x >= r - 1 || target.y == 0 || target.y >= c - 1) continue;
        if(maze[target.x][target.y] == 1){  //如果对面的点没通
            maze[target.x][target.y] = 0;   //打通
            maze[node.x][node.y] = 0;
            //将对面的点的四周墙壁放入列表，并存好各自对面的点的方位
            if(target.x - 1 > 0 && maze[target.x - 1][target.y] == 1){
                list.push({x: target.x - 1, y: target.y, face: 0});
            }
            if(target.y + 1 < c - 1 && maze[target.x][target.y + 1] == 1){
                list.push({x: target.x, y: target.y + 1, face: 1});
            }
            if(target.x + 1 < r - 1 && maze[target.x + 1][target.y] == 1){
                list.push({x: target.x + 1, y: target.y, face: 2});
            }
            if(target.y - 1 > 0 && maze[target.x][target.y - 1] == 1){
                list.push({x: target.x, y:target.y - 1, face: 3});
            }
        }
    }
    await draw();
}

//绘画迷宫
async function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = 'black';
    for(var i = 0; i < r; i++){
        for(var j = 0; j < c; j++){
            if(maze[i][j] == 1)
                ctx.fillRect(j * 10, i * 10, 10, 10);
            else if(i == now.x && j == now.y){
                ctx.fillStyle = '#90ee90';
                ctx.fillRect(j * 10, i * 10, 10, 10);
                ctx.fillStyle = 'black';
            }
            else if(i == enermy.x && j == enermy.y){
                ctx.fillStyle = 'red';
                ctx.fillRect(j * 10, i * 10, 10, 10);
                ctx.fillStyle = 'black';
            }
        }
    }
}

//重画玩家
async function redrawPlayer(player){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(player.y * 10, player.x * 10, 10, 10);
    ctx.fillStyle = '#90ee90';
    ctx.fillRect(now.y * 10, now.x * 10, 10, 10);
    
}

//重画敌人
function redrawBot(bot) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(bot.y * 10, bot.x * 10, 10, 10);
    ctx.fillStyle = 'red';
    ctx.fillRect(enermy.y * 10, enermy.x * 10, 10, 10);
}