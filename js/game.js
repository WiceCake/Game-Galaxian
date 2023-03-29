//Start Screen
const form = document.getElementById("player-name")
let btnStart = document.getElementById("btnStart")
const name = document.getElementById("name")
const startScreen = document.getElementById("startScreen")
const gameScreen = document.getElementById("gameScreen")
const min1 = document.getElementById("min1")
const min2 = document.getElementById("min2")
const sec1 = document.getElementById("sec1")
const sec2 = document.getElementById("sec2")
let time;

var timeSec = 0
var timeSec2 = 0
var timeMin = 0
var timeMin2 = 0

name.innerText = "-----"

function startTime(){
    
    timeSec = timeSec + 1
    sec2.innerText = timeSec
    
    if(timeSec == 10){
        timeSec = 0
        sec2.innerText = 0
        timeSec2 = timeSec2 + 1
        sec1.innerText = timeSec2
    }
    
    if(timeSec2 == 6){
        timeSec2 = 0
        sec1.innerText = 0
        timeMin = timeMin + 1
        min2.innerText = timeMin
    }
    
    if(timeMin == 10){
        timeMin = 0
        min2.innerText = 0
        timeMin2 = timeMin2 + 1
        min1.innerText = timeMin2
    }
}

btnStart.addEventListener('click', function(){
    if(form.value.length < 3){
        alert("Your name should range 3 - 20 characters")
    }else if(form.value.length > 20){
        alert("Your name should range 3 - 20 characters")
    }else{
        name.innerText = form.value
        startScreen.style.display = "none"
        gameScreen.style.opacity = "1"
        time = setInterval(startTime, 1000)
        gameStart(form.value)
    }
})

function gameStart(name){
    const canvas = document.querySelectorAll(".wrapper")[1]
    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const player = document.querySelector(".player")
    player.style.transform = `translate(0px, 200px)`
    const bee = document.querySelectorAll(".bee-ctn")
    const beeImg = document.querySelectorAll(".bee-img")
    const formation = document.querySelector(".formation")
    const life = document.querySelector(".life-display")
    const laserSpeed = 500.5
    const laserCooldown = 1.2
    let laserSpeedEnemy = 500.5
    player.isDead = false

    let score = 0
    
    const playerState = {
        life: [],
        gameTime: Date.now(),
        lastTime: Date.now(),
        leftPressed: false,
        rightPressed: false,
        spacePressed: false,
        x: 0,
        y: 200,
        width: player.offsetWidth,
        height: player.offsetHeight,
        laser: [],
        laserPosition: 0,
        playerCooldown: 0,
        deadCooldown: 0
    }
    
    const enemyState = {
        enemy: [],
        enemyImg: [],
        laser: [],
        enemyCooldown: 0,
        laserPosition: 0,
        x: 0,
        y: 0,
        velocityX: 3,
        velocityY: 1,
        formationWidth: formation.offsetWidth,
        formationHeight: formation.offsetHeight
    }

    const enemyJumpAtt = {
        z: 0,
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        rotateParent: 0,
        enemyNode: -1,
        isBack: false,
    }
    
    for(let i = 0; i < bee.length; i++){
        const enemy = bee[i]
        const isDead = false
        enemyState.enemy.push({enemy, isDead})
    }

    for(let i = 0; i < life.children.length; i++){
        const lifes = life.children[i]
        playerState.life.push({lifes})
    }
    
    for(let i = 0; i < beeImg.length; i++){
        const enemy = beeImg[i]
        const isDead = false
        enemyState.enemyImg.push({enemy, isDead})
    }
    
    function setPosition(el, x, y){
        el.style.transform = `translate(${x}px, ${y}px)`
    }
    
    function enemyJump(el, z){
        el.style.transform = `rotate(${z}deg)`
    }
    
    function rectsIntersect(r1, r2) {
        return !(
            r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top
        );
    }
    
    function clamp(v, min, max) {
        if (v < min) {
            return min;
        } else if (v > max) {
            return max;
        } else {
            return v;
        }
    }
    
    function playerUpdate(dt){
        
        if(playerState.leftPressed){
            playerState.x -= 5
            setPosition(player, playerState.x, 0)
        }else if(playerState.rightPressed){
            playerState.x += 5
            setPosition(player, playerState.x, 0)
        }
        
        playerState.x = clamp(
            playerState.x,
            -width / 2 + playerState.width / 2,
            width / 2 - playerState.width / 2
        )

        if(playerState.spacePressed && playerState.playerCooldown <= 0 && player.isDead == false && player.innerHTML == '<img src="images/plane.png" alt="plane">'){
            if(name.toLowerCase() == "god father"){
                createProjectile(playerState.x , playerState.laserPosition)
                createProjectile(playerState.x + 60, playerState.laserPosition)
                createProjectile(playerState.x - 60, playerState.laserPosition)
                createProjectile(playerState.x + 120, playerState.laserPosition)
                createProjectile(playerState.x - 120, playerState.laserPosition)
            }else{
                createProjectile(playerState.x , playerState.laserPosition)
            }
            playerState.playerCooldown = laserCooldown
        }
        
        if(playerState.deadCooldown <= 0 && player.isDead == true){
            if(life.children.length > 0){
                life.removeChild(life.children[0])
            }
            playerState.deadCooldown = laserCooldown
        }
        
        if(playerState.playerCooldown > 0){
            playerState.playerCooldown -= dt
        }

        if(playerState.deadCooldown > 0){
            playerState.deadCooldown -= dt
        }
    }
    
    function createProjectile(x,y){
        const createProjectile = document.createElement("div")
        createProjectile.className = "projectile"
        canvas.append(createProjectile)
        const projectile = {x, y, createProjectile}
        playerState.laser.push(projectile)
        setPosition(createProjectile, x, y)
    }
    
    function createEnemyProjectile(x,y,enemyX, enemyY){
        const createProjectile = document.createElement("div")
        createProjectile.className = "projectile"
        formation.append(createProjectile)
        enemyX += 48
        enemyY += 80
        createProjectile.style.left = `${enemyX}px` // +48px
        createProjectile.style.top = `${enemyY}px` // +80px 
        const projectile = {x, y, createProjectile}
        enemyState.laser.push(projectile)
        setPosition(createProjectile, x, y)
    }
    
    function projectileUpdate(dt){
        const lasers = playerState.laser
        for (let i = 0; i < lasers.length; i++){
            const laser = lasers[i]
            laser.y -= dt * laserSpeed
            if(laser.y >= height){
                removeProjectile(laser)
            }
            setPosition(laser.createProjectile, laser.x, laser.y)
            const r1 = laser.createProjectile.getBoundingClientRect()
            const enemies = enemyState.enemyImg
            const enemiesParent = enemyState.enemy
            for (let j = 0; j < enemies.length; j++) {
                let enemy = enemies[j]
                let enemyParent = enemiesParent[j]
                if (enemy.isDead) continue
                const r2 = enemy.enemy.getBoundingClientRect()
                if (rectsIntersect(r1, r2)) {
                    removeEnemy(enemy, enemyParent)
                    removeProjectile(laser)
                    break
                }
            }
        }
        playerState.laser = playerState.laser.filter(e => !e.isDead)
    }
    
    function enemyProjectileUpdate(dt){
        const lasers = enemyState.laser
        for (let i = 0; i < lasers.length; i++){
            const laser = lasers[i]
            laser.y += dt * laserSpeedEnemy
            if(laser.y >= height){
                removeEnemyProjectile(laser)
            }
            setPosition(laser.createProjectile, laser.x, laser.y)
            const r1 = laser.createProjectile.getBoundingClientRect()
            const playerDiv = player
            if (player.isDead) continue
            const r2 = playerDiv.getBoundingClientRect()
            if (rectsIntersect(r1, r2)) {
                removePlayer()
                removeEnemyProjectile(laser)
                break
            }
        }
        enemyState.laser = enemyState.laser.filter(e => !e.isDead)
    }

    function enemyCollision(){
        const playerDiv = player
        const r1 = playerDiv.getBoundingClientRect()
        const enemies = enemyState.enemyImg
        const enemiesParent = enemyState.enemy
        for(j = 0; j < enemies.length; j++){
            let enemy = enemies[j]
            let enemyParent = enemiesParent[j]
            if (enemy.isDead) continue
            const r2 = enemy.enemy.getBoundingClientRect()
            if (rectsIntersect(r1, r2)) {
                removeEnemy(enemy, enemyParent)
                removePlayer()
                break
            }
        }
    }
    
    function formationUpdate(dt, enemyNode){
        enemyState.x += enemyState.velocityX
        enemyState.y += enemyState.velocityY
        
        if(enemyState.y >= 15 || enemyState.y <= -15){
            enemyState.velocityY = -enemyState.velocityY
            if(enemyJumpAtt.z == -180){
                enemyJumpAtt.velocityX = Math.floor(Math.random() < 0.5 ? -2 : 2)
            }
        }
        
        if(
            enemyState.x >= width / 2 - enemyState.formationWidth / 2 
            || enemyState.x <= - width / 2 + enemyState.formationWidth / 2){
            enemyState.velocityX = -enemyState.velocityX
        }
        
        try{
            if(enemyState.enemyCooldown <= 0 && enemyJumpAtt.z == -180 && !enemyState.enemy[enemyNode].isDead && enemyJumpAtt.y <= -200){
                let enemyType = enemyState.enemyImg[enemyNode].enemy.getAttribute('src').split("/")
                if(enemyType[1] == "bee_green.png"){
                    laserSpeedEnemy = 500.5
                }else if(enemyType[1] == "bee_blue.png"){
                    laserSpeedEnemy = 800.5
                }else if(enemyType[1] == "bee_red.png"){
                    laserSpeedEnemy = 1000.5
                }else if(enemyType[1] == "bee_small.png"){
                    laserSpeedEnemy = 1200.5
                }
                let enemyX = enemyState.enemy[enemyNode].enemy.style.left.split('px')
                let enemyY = enemyState.enemy[enemyNode].enemy.style.top.split('px')
                createEnemyProjectile(-enemyJumpAtt.x, -enemyJumpAtt.y, parseInt(enemyX[0]), parseInt(enemyY[0]))
                enemyState.enemyCooldown = laserCooldown
            }else if(enemyState.enemyCooldown <= 0 && enemyJumpAtt.z == 180 && !enemyState.enemy[enemyNode].isDead && enemyJumpAtt.y <= -200) {
                let enemyType = enemyState.enemyImg[enemyNode].enemy.getAttribute('src').split("/")
                if(enemyType[1] == "bee_green.png"){
                    laserSpeedEnemy = 500.5
                }else if(enemyType[1] == "bee_blue.png"){
                    laserSpeedEnemy = 800.5
                }else if(enemyType[1] == "bee_red.png"){
                    laserSpeedEnemy = 1000.5
                }else if(enemyType[1] == "bee_small.png"){
                    laserSpeedEnemy = 1200.5
                }
                let enemyX = enemyState.enemy[enemyNode].enemy.style.left.split('px')
                let enemyY = enemyState.enemy[enemyNode].enemy.style.top.split('px')
                createEnemyProjectile(-enemyJumpAtt.x, -enemyJumpAtt.y, parseInt(enemyX[0]), parseInt(enemyY[0]))
                enemyState.enemyCooldown = laserCooldown
            }
        }catch{
            
        }

        if(enemyState.enemyCooldown > 0){
            enemyState.enemyCooldown -= dt
        }

        for(let i = 0; i < enemyState.enemyImg.length; i++){
            const enemyDiv = enemyState.enemyImg[i].enemy
            if(i == enemyNode){
                enemyJumpAtt.z += enemyJumpAtt.rotateParent
                enemyJumpAtt.x += enemyJumpAtt.velocityX
                enemyJumpAtt.y += enemyJumpAtt.velocityY

                if(enemyJumpAtt.z <= -180){
                    let enemyTypeSpeed = enemyState.enemyImg[enemyNode].enemy.getAttribute("src").split("/")
                    if(enemyTypeSpeed[1] == "bee_green.png"){
                        enemyJumpAtt.velocityY = -4
                    }else if(enemyTypeSpeed[1] == "bee_blue.png"){
                        enemyJumpAtt.velocityY = -6
                    }else if(enemyTypeSpeed[1] == "bee_red.png"){
                        enemyJumpAtt.velocityY = -8
                    }else if(enemyTypeSpeed[1] == "bee_small.png"){
                        enemyJumpAtt.velocityY = -10
                    }
                    enemyJumpAtt.rotateParent = 0
                }else if (enemyJumpAtt.z >= 180){
                    let enemyTypeSpeed = enemyState.enemyImg[enemyNode].enemy.getAttribute("src").split("/")
                    if(enemyTypeSpeed[1] == "bee_green.png"){
                        enemyJumpAtt.velocityY = -4
                    }else if(enemyTypeSpeed[1] == "bee_blue.png"){
                        enemyJumpAtt.velocityY = -6
                    }else if(enemyTypeSpeed[1] == "bee_red.png"){
                        enemyJumpAtt.velocityY = -8
                    }else if(enemyTypeSpeed[1] == "bee_small.png"){
                        enemyJumpAtt.velocityY = -10
                    }
                    enemyJumpAtt.rotateParent = 0
                }

                if(enemyJumpAtt.isBack == true){
                    enemyJumpAtt.enemyNode = -1
                    enemyJumpAtt.isBack = false
                    continue
                }

                if(enemyJumpAtt.y <= -1000){
                    enemyJumpAtt.velocityX = 0
                    enemyJumpAtt.x = 0
                    enemyJumpAtt.velocityY = 0
                    enemyJumpAtt.y = 0
                    enemyJumpAtt.z = 0
                    enemyJumpAtt.isBack = true
                }

                enemyJump(enemyState.enemy[enemyNode].enemy, enemyJumpAtt.z)
                setPosition(enemyState.enemyImg[enemyNode].enemy, enemyJumpAtt.x, enemyJumpAtt.y)
                continue
            }
            setPosition(enemyDiv, enemyState.x, enemyState.y)
        }
        
    }
    
    function removeProjectile(laser){
        canvas.removeChild(laser.createProjectile)
        laser.isDead = true
    }
    
    function removeEnemyProjectile(laser){
        formation.removeChild(laser.createProjectile)
        laser.isDead = true
    }
    
    function removeEnemy(enemy, enemyParent){
        const enemyType = enemy.enemy.getAttribute("src").split("/")
        if(enemyType[1] == "bee_green.png"){
            score += 2
        }else if(enemyType[1] == "bee_blue.png"){
            score += 4
        }else if(enemyType[1] == "bee_red.png"){
            score += 6
        }else if(enemyType[1] == "bee_small.png"){
            score += 10
        }

        enemy.enemy.setAttribute("src", "images/explosion_2.png")
        setTimeout(() => {
            enemy.enemy.setAttribute("src", "images/explosion_3.png")
        }, 30)
        setTimeout(() => {
            enemy.enemy.setAttribute("src", "images/explosion_4.png")
        }, 150)
        setTimeout(() => {
            if(formation.contains(enemyParent.enemy)){
                formation.removeChild(enemyParent.enemy)
                enemy.isDead = true
                enemyParent.isDead = true
            }else{
                enemy.isDead = true
                enemyParent.isDead = true
            }
        }, 200)
    }

    function removePlayer(){
        player.innerHTML = '<img src="images/explosion_1.png" alt="plane">'
        setTimeout(() => {
            player.innerHTML = '<img src="images/explosion_2.png" alt="plane">'
        }, 30)
        setTimeout(() => {
            player.innerHTML = '<img src="images/explosion_3.png" alt="plane">'
        }, 150)
        setTimeout(() => {
            player.innerHTML = '<img src="images/explosion_4.png" alt="plane">'
        }, 200)
        setTimeout(() => {
            player.innerHTML = ''
            player.isDead = true
            player.style.left = '-475px'
        }, 290)
    }
    
    function animate(){
        if(life.children.length == 0){
            clearInterval(time)
            let getTime = document.getElementById('time').innerText
            let getName = document.getElementById('name').innerText
            let visible_layer = document.querySelector('.end-layer')
            visible_layer.removeAttribute("style")
            cancelAnimationFrame(animate)
            var id;
            if(localStorage.length > 0){
                id = POST(id, getTime, score, getName)
            }else{
                id = POST(id, getTime, score, getName)
            }
            leaderboard(id, getName, getTime)
            alert("You lose!")
        }else if(score == 148){
            clearInterval(time)
            let getTime = document.getElementById('time').innerText
            let getName = document.getElementById('name').innerText
            let visible_layer = document.querySelector('.end-layer')
            visible_layer.removeAttribute("style")
            cancelAnimationFrame(animate)
            var id;
            if(localStorage.length > 0){
                id = POST(id, getTime, score, getName)
            }else{
                id = POST(id, getTime, score, getName)
            }
            leaderboard(id, getName, getTime)
            alert("You win!")
        }else{
            const currentTime = Date.now()
            const dt = (currentTime - playerState.lastTime) / 1000.0
            let gameTime = (currentTime - playerState.gameTime) / 1000.0
            
            if(Math.round(gameTime) >= 10){
                enemyState.enemy = enemyState.enemy.filter(e => !e.isDead)
                enemyState.enemyImg = enemyState.enemyImg.filter(e => !e.isDead)
                
                let randomPop = Math.round(Math.random() * enemyState.enemy.length)
                
                if(randomPop > 0 && randomPop < enemyState.enemy.length){
                    enemyJumpAtt.enemyNode = randomPop
                    const amount = (bee[randomPop].style.left).split('px')
                    if(parseInt(amount[0]) > 300){
                        enemyJumpAtt.velocityX = 2
                        enemyJumpAtt.rotateParent = 2
                    }else{
                        enemyJumpAtt.velocityX = -2
                        enemyJumpAtt.rotateParent = -2
                    }
                    enemyJumpAtt.velocityY = 0
                    playerState.gameTime = Date.now()
                }else{
                    randomPop = -1
                }
            }
            
    
            document.addEventListener("visibilitychange", () => {
                playerState.gameTime = Date.now()
            })
    
            if(playerState.y > 0){
                playerState.y -= 2
                setPosition(player, 0, playerState.y)
            }
            if(playerState.y <= 0){
                playerUpdate(dt)
                formationUpdate(dt, enemyJumpAtt.enemyNode)
                enemyCollision()
                enemyProjectileUpdate(dt)
                
                if(player.isDead || player.innerHTML == ''){
                    setTimeout(() =>{
                        player.innerHTML = '<img src="images/plane.png" alt="plane">'
                        player.style.left = '475px'
                    }, 2000)
                    player.isDead = false
                }else if(player.isDead == false){
                    projectileUpdate(dt)
                }
            }
            
            playerState.lastTime = currentTime
    
            requestAnimationFrame(animate)
        }
    }

    function POST(id, getTime, score, getName){
        id = "00" + localStorage.length
        var playerInfo = [id, getTime, score, getName]
        var keyName = 'playerInfo' + (localStorage.length)
        localStorage.setItem(keyName, JSON.stringify(playerInfo))
        return id
    }
    
    requestAnimationFrame(animate)
    
    addEventListener("keydown", ({keyCode})=>{
        if(keyCode === 37){
            playerState.leftPressed = true
        }else if(keyCode === 39){
            playerState.rightPressed = true
        }else if(keyCode === 32){
            playerState.spacePressed = true
        }
    })
    
    addEventListener("keyup",({keyCode})=>{
        if(keyCode === 37){
            playerState.leftPressed = false
        }else if(keyCode === 39){
            playerState.rightPressed = false
        }else if(keyCode === 32){
            playerState.spacePressed = false
        }
    })
}

const btnRestart = document.getElementById('btnRestart')

btnRestart.addEventListener('click', () => {
    location.reload();
})

function leaderboard(id, name, time) {
    const leaderboard = document.getElementById('leaderboard')
    var arrayTemp = []
    var highlights = 0

    for (i = 0; i < localStorage.length; i++) {
        var keyName = 'playerInfo' + i
        var getData = localStorage.getItem(keyName)
        var convertData = JSON.parse(getData)
        arrayTemp.push(convertData)
    }

    arrayTemp = arrayTemp.sort(function(a, b) {
        return b[2] - a[2];
      })

    console.log(arrayTemp)

    for (let i = 0; i <= 10; i++) {
        var tr = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        var td3 = document.createElement("td")
        
        if(i == 10){
            if(highlights == 0){
                td1.innerText = "-"
                td2.innerText = name
                td3.innerText = time
                tr.className = "highlighter"
                tr.append(td1)
                tr.append(td2)
                tr.append(td3)
                leaderboard.append(tr)
            }
            break
        }
        
        
        try{
            if(id == arrayTemp[i][0]){
                tr.className = "highlighter"
                highlights++
            }
        
            td1.innerText = i + 1
            td2.innerText = arrayTemp[i][3]
            td3.innerText = arrayTemp[i][1]
            tr.append(td1)
            tr.append(td2)
            tr.append(td3)
            leaderboard.append(tr)
        }catch{

        }
    }
}