// ================= ANALYZE =================
function analyze() {
    let text = document.getElementById("text").value;
    let emotion = document.getElementById("emotion").value;

    fetch("/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text, emotion})
    })
    .then(res => res.json())
    .then(data => {

        document.getElementById("result").innerHTML = `
            <h3>${data.emotion.toUpperCase()}</h3>
            <p>${data.message}</p>

            <button onclick="playSound('${data.emotion}')">🎧 Play Relax Sound</button>

            <br><br>

            <button onclick="startExperience('${data.emotion}')">🧘 Start Experience</button>
            <button onclick="startGame('${data.emotion}')">🎮 Start Game</button>
        `;
    })
    .catch(() => alert("Backend error"));
}

//////////////////////////////////////////////////
// 🎧 YOUTUBE SOUND SYSTEM
//////////////////////////////////////////////////
function playSound(emotion) {

    let sounds = {
        sadness: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        anger: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        fear: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        joy: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        gratitude: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        surprise: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    };

    let titles = {
        sadness: "🌧 Calm Rain Music",
        anger: "🔥 Relaxing Mind Music",
        fear: "🧘 Meditation Sound",
        joy: "😊 Happy Vibes",
        gratitude: "🙏 Peaceful Piano",
        surprise: "😲 Calm Ambient"
    };

    let src = sounds[emotion];

    if (!src) {
        alert("No sound available");
        return;
    }

    document.getElementById("gameSection").innerHTML = `
        <h3>${titles[emotion]}</h3>

        <audio controls autoplay loop style="width:100%">
            <source src="${src}" type="audio/mpeg">
            Your browser does not support audio.
        </audio>

        <p>🎧 Use controls to adjust volume</p>
    `;
}
//////////////////////////////////////////////////
// 🧘 EXPERIENCE
//////////////////////////////////////////////////

function startExperience(emotion) {

    document.getElementById("gameSection").innerHTML = `
        <h3>Relax Mode 🧘</h3>
        <p>Take a deep breath... inhale... exhale...</p>
        <div class="breath"></div>
    `;
}

//////////////////////////////////////////////////
// 🎮 GAMES
//////////////////////////////////////////////////

function startGame(emotion) {

    let gameDiv = document.getElementById("gameSection");
    gameDiv.innerHTML = "";

    // 😢 SADNESS → Balloon Game
    if (emotion === "sadness") {
        let score = 0;
        let totalNeeded = 5;
        let gameOver = false;

        gameDiv.innerHTML = `
            <h3>Target Balloon 🎯</h3>
            <p>Pop only RED balloons</p>
            <p>Score: <span id="score">0</span> / ${totalNeeded}</p>
            <div id="balloonArea" style="height:250px; position:relative; background:#eef;"></div>
        `;

        let area = document.getElementById("balloonArea");
        let colors = ["red","blue","green","yellow"];

        function createBalloon() {
            if (gameOver) return;

            let balloon = document.createElement("div");
            let color = colors[Math.floor(Math.random()*colors.length)];

            balloon.style.position="absolute";
            balloon.style.bottom="0px";
            balloon.style.left=Math.random()*260+"px";
            balloon.style.width="40px";
            balloon.style.height="50px";
            balloon.style.background=color;
            balloon.style.borderRadius="50%";
            balloon.style.cursor="pointer";

            balloon.onclick = () => {
                if (color === "red") {
                    score++;
                    document.getElementById("score").innerText = score;

                    if (score === totalNeeded) {
                        gameOver=true;
                        clearInterval(spawn);
                        setTimeout(()=>endGame(5),500);
                    }
                }
                balloon.remove();
            };

            area.appendChild(balloon);

            let rise=setInterval(()=>{
                let b=parseInt(balloon.style.bottom);
                if(b>230 || gameOver){
                    balloon.remove();
                    clearInterval(rise);
                } else balloon.style.bottom=(b+4)+"px";
            },50);
        }

        let spawn=setInterval(createBalloon,700);
    }

    // 😡 ANGER
    else if (emotion === "anger") {
        let score=0;
        gameDiv.innerHTML=`
            <h3>Tap to Calm 🔥</h3>
            <button id="tapBtn">TAP</button>
            <p>Score: <span id="score">0</span></p>
        `;

        document.getElementById("tapBtn").onclick=()=>{
            score++;
            document.getElementById("score").innerText=score;
            if(score>=20) endGame(5);
        };
    }

    // 😨 FEAR
    else if (emotion === "fear") {
        gameDiv.innerHTML=`
            <h3>Safe Zone 🛡️</h3>
            <div style="width:300px;height:100px;background:#ddd;position:relative;">
                <div id="player" style="width:30px;height:30px;background:red;position:absolute;"></div>
                <div style="width:60px;height:100px;background:green;position:absolute;right:0;"></div>
            </div>
            <button onclick="movePlayer()">Move ➡️</button>
        `;
    }

    // 😊 JOY
    else if (emotion === "joy") {
        let seq="SUN MOON STAR";
        gameDiv.innerHTML=`
            <h3>Memory Game 🧠</h3>
            <p>${seq}</p>
            <button onclick="checkMemory('${seq}')">Remember</button>
        `;
    }

    // 🙏 GRATITUDE
    else if (emotion === "gratitude") {
        gameDiv.innerHTML=`
            <h3>Gratitude Wall 🙏</h3>
            <input id="gratInput" placeholder="I am thankful for...">
            <button onclick="addGratitude()">Add</button>
            <div id="wall"></div>
        `;
    }

    // 😲 SURPRISE
    else if (emotion === "surprise") {
        gameDiv.innerHTML=`
            <h3>Reaction Test ⚡</h3>
            <p id="msg">Wait...</p>
            <button id="clickBtn" disabled onclick="handleClick()">CLICK</button>
        `;

        setTimeout(()=>{
            document.getElementById("msg").innerText="CLICK!";
            document.getElementById("clickBtn").disabled=false;
            window.startTime=new Date().getTime();
        },2000+Math.random()*3000);
    }
}

//////////////////////////////////////////////////
// EXTRA
//////////////////////////////////////////////////

function movePlayer(){
    let p=document.getElementById("player");
    let l=p.offsetLeft;
    p.style.left=(l+20)+"px";
    if(l>230) endGame(5);
}

function addGratitude(){
    let val=document.getElementById("gratInput").value;
    if(!val) return;

    let w=document.getElementById("wall");
    let d=document.createElement("div");
    d.className="gratCard";
    d.innerText=val;
    w.appendChild(d);

    if(w.children.length===3) endGame(5);
}

function handleClick(){
    let r=new Date().getTime()-window.startTime;
    alert("Reaction: "+r+"ms");
    endGame(5);
}

function checkMemory(seq){
    let a=prompt("Enter sequence:");
    if(a && a.toUpperCase()===seq) endGame(5);
    else endGame(2);
}

function endGame(score){
    document.getElementById("gameSection").innerHTML=`
        <h2>🎉 Completed</h2>
        <p>Score: ${score}</p>
        <p>Rate your feeling:</p>
        <span onclick="rate(1)">⭐</span>
        <span onclick="rate(2)">⭐</span>
        <span onclick="rate(3)">⭐</span>
        <span onclick="rate(4)">⭐</span>
        <span onclick="rate(5)">⭐</span>
    `;
}

function rate(v){
    alert("You rated "+v+" ⭐");
}