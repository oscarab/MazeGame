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
    // for (let i = 0; i < maxPredictions; i++) {
    //     var div = document.createElement("div");
    //     div.style.textAlign = "center";
    //     labelContainer.appendChild(div);
    // }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    var choose;
    ready = true;
    for (let i = 0; i < maxPredictions; i++) {
        var type = prediction[i].className;
        var probability = prediction[i].probability.toFixed(2);
        document.getElementById(type).innerHTML = probability;
        if(probability > 0.90) choose = type;
    }
    if(frame++ > 20 && isStart){
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