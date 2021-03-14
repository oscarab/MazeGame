async function initMaze() {
    for(var i = 0; i < r; i++){
        maze[i] = new Array();
        for(var j = 0; j < c; j++){
            maze[i][j] = 1;
        }
    }
    maze[2][0] = 0;
    maze[2][1] = 0;
    maze[r - 2][c - 1] = 0;
    maze[r - 2][c - 2] = 0;
    list.push({x: 1,y: 1, face: 0});
    list.push({x: 2,y: 2, face: 1});
    list.push({x: 3,y: 1, face: 2});
    while(list.length > 0){
        var index = Math.floor(Math.random()*list.length);
        var node = list[index];
        list.splice(index, 1);
        var target = {x: 0, y: 0, face: -1};    //相隔的点
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
        if(maze[target.x][target.y] == 1){  //如果没通
            maze[target.x][target.y] = 0;
            maze[node.x][node.y] = 0;
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