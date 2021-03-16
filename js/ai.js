async function initAI() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam").remove();
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    var choose;     //选择的类型
    var chpro = 0;  //概率
    ready = true;
    for (let i = 0; i < maxPredictions; i++) {
        var type = prediction[i].className;
        var probability = prediction[i].probability.toFixed(2) * 100;
        document.getElementById(type).innerHTML = parseInt(probability) + "%";
        if(probability > chpro && probability > 85) choose = type, chpro = probability;
    }
    if(frame++ > 10 && isStart){
        frame = 0;
        if(choose == "UP"){
            if(now.x > 0 && maze[now.x - 1][now.y] == 0)
                now.x--;
        }
        else if(choose == "DOWN"){
            if(now.x < r - 1 && maze[now.x + 1][now.y] == 0)
                now.x++;
        }
        else if(choose == "LEFT"){
            if(now.y > 0 && maze[now.x][now.y - 1] == 0)
                now.y--;
        }
        else if(choose == "RIGHT"){
            if(now.y < c - 1 && maze[now.x][now.y + 1] == 0)
                now.y++;
        }
        await draw();
    }
}