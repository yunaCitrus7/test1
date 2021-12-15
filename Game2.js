
let player, pf, screenTop, bottom, obstacles, bullets, lifeItem, enemies;//Sprite
let playerImg, bgImg, earImg, obs1, obs2;//image
let jumpSd, itemSd, bgm, hit, shootSd, menuBgm ; // sound
let start_btn;
//playerProperties
let gravity = 0.3;
let jumpingHeight = -8;
//backgroundScrolling
let x1 = 0, x2 = 600;
let scrollSpeed = 0.2;
//sceneControl;
let displayMenu = true;
let gameStart =  false;
let gameOver = false;
//gameSetting
let movingSpeed = 0.1;
let ObmovingSpeed = 0.03
let playerHealth = 5;
let obActive = true;
let score = 0;
let spawnLife = false;
let speedup = false;
let speed = 60;
let bulletState = false;
let levelScore = 1;
//enemySettings
let count = 0;
let enemyMaxDuration = 500; 
let enemyHealth = 50;
let enemyMaxHealth = 50;
let enemyState = false;
let enemyIsDestroyed = false;
let ap = 50;
//gui
let gui0;
var BGMSoundLevel = 5;
var SFXLevel = 5;
var BackgroundMusic = true;
var SoundEffect = true;

let playSndEffect = true;
let songSpeed;
//gui_difficulties
let gui1;
var Difficulties = ['Beginner', 'Intermediate', 'Expert'];

let pixelFont;
//
let enemySpawn = 1000;
let obsSpawn = 100;
//---sceneControl-------------


//---------------------------------------
function preload(){
    soundFormats('mp3','wav');
    playerImg  = loadImage('./assets/playerImage0001.png');
    bgImg      = loadImage('./assets/StarryNightPx.png');
    bgImg2     = loadImage('./assets/StarryNight.jpg')
    earImg     = loadImage('./assets/ear.png');
    obs1       = loadImage('./assets/obstacle1.png');
    obs2       = loadImage('./assets/obstacle2.png');
    obs3       = loadImage('./assets/obstacle3.png');
    obs4       = loadImage('./assets/obstacle4.png');
    lifeImg    = loadImage('./assets/life.png');
    btnimg1    = loadImage('./assets/button1.png');
    enemyImg   = loadImage('./assets/enemy.png');

    jumpSd     = loadSound('./assets/JumpSFX.wav');
    itemSd     = loadSound('./assets/coins.wav');
    bgm        = loadSound('./assets/bgm.mp3');
    hit        = loadSound('./assets/getHit.wav');
    shootSd    = loadSound('./assets/shoot.wav');
    heal       = loadSound('./assets/heal.mp3');
    gameOverSnd   = loadSound('./assets/gameOver.wav');
    clicksnd   = loadSound('./assets/click.wav');
    failSnd   = loadSound('./assets/failed.wav');
    explode   = loadSound('./assets/explode.wav');
    success   = loadSound('./assets/success.wav');
    

    pixelFont  =loadFont('./assets/Pixeboy-z8XGD.ttf');
}

function setup(){

    createCanvas(600, 400);
    //frameRate(speed);
    textFont(pixelFont);

    gui0=createGui("Sound Settings");
    sliderRange(1, 10, 0);
    gui0.addGlobals("BGMSoundLevel","SFXLevel","BackgroundMusic","SoundEffect");
    gui0.setPosition(625, 10);

    gui1 = createGui("Difficulties Selection");
    gui1.addGlobals("Difficulties");
    gui1.setPosition(625, 225);

    player = createSprite(150,200, 50, 50 );
    player.addAnimation('moving', './assets/playerImage0001.png', './assets/playerImage0002.png');
    //player.addAnimation(playerMoving);
    
    bottom = createSprite(width/2, height, width, 100);
    bottom.immovable = true;
    bottom.shapeColor = (0);
    screenTop = createSprite(width/2, 0, width, 100 );
    screenTop.immovable = true;
    screenTop.shapeColor = (0);


    pf = new Group();
    ears = new Group();
    lifeItem = new Group();
    obstacles = new Group();
    obstacles2 = new Group();
    bullets = new Group();
    enemies = new Group();




}

function draw(){

    if(displayMenu == true){
    menu();
   
    }

    if(gameStart == true){
    displayMenu = false;
    game();

        }

    if(gameOver == true){

        showResult();

    }
    soundControl();


}

function menu(){

    bgScroll(bgImg2);

    textAlign(CENTER);
    fill(255);
    stroke(0);
    strokeWeight(5);
    textSize(50);
    text("Van Gogh's", width/2, height/2 - 60);
    text("Adventure", width/2, height/2 - 25);

     image(btnimg1, width/2 - 50, height/2 + 25);
   
   
}
function game(){
    //BackgroundMusic = true;
    bgScroll(bgImg);
   // drawPlatform();
    drawPlayer();
    drawEars();
    drawSprite(bottom);
    drawSprite(screenTop);
    drawObstacles();
    spawnItems();
    enemy();

    fill(255);
    noStroke();
    textSize(20);
    textAlign(CENTER);
    text('Score: '+ score, width-50, 33);
    drawLifes();
    messageBar();


    if(playerHealth <= 0){

        gameStart = false;
        gameOver = true;
        gameOverSnd.play();
       }


}
function bgScroll(img){

    //image(bgImg, x1, 0, width, height);
    //image(bgImg, x2, 9, width, height);
    image(img, x1, 0, width, height);
    image(img, x2, 0, width, height);

    x1 -= scrollSpeed;
    x2 -= scrollSpeed;

    if (x1 < -width){
      x1 = width;
    }
    if (x2 < -width){
      x2 = width;
    }
  }

function keyPressed(){
if(gameStart == true){
    if(keyIsDown(32)){
          player.velocity.y =  jumpingHeight;
          gameStart = true;
          if(playSndEffect == true){
          jumpSd.play();}


    }

    if(keyIsDown(88)){
        gameStart = false;
        gameOver = true;
        if(playSndEffect == true){
        gameOverSnd.play();}

    }

   
}

}

function drawPlayer(){

    player.velocity.y  += gravity;
    player.collide(bottom);
    player.collide(screenTop);

    if(obActive == true && player.overlap(obstacles)){
        if(playSndEffect == true){
        hit.play();}
        playerHealth -= 1;
    }
    if(obActive == true && player.overlap(obstacles2)){
        if(playSndEffect == true){
        hit.play();}
        playerHealth -= 1;
    }

    drawSprite(player);
    shooting();
    

    if(player.position.y > height){
        player.position.y = height-100;

    }

}

function drawEars(){
//spawn ears
if(frameCount % 60 === 0){
    let posY = random(150, 300);
    let esp = createSprite(width, posY,10,10);
    esp.addImage(earImg);
    ears.add(esp);
}
//move ears
for(i = 0; i < ears.length; i ++){

    ears[i].velocity.x -= movingSpeed;

        if(ears[i].overlap(player)){
            if(playSndEffect == true){
            itemSd.play();}
            ears[i].remove();
            score += 1 * levelScore;

        } else if ( ears[i].position.x < 0){

                ears[i].remove();
        }
}

drawSprites(ears);

}

function drawObstacles(){
    let spawnObsChance = int(random(1, obsSpawn));
    if(spawnObsChance == 1){

        obActive = true;
        let obHeight = random(50, 250);
        let obSp = createSprite(width, height-90, 25, obHeight);
        obSp.shapeColor = (0);
        
        let type = int(random(1, 4));
        if(type == 1){
        obSp.addImage(obs1);}
        if(type == 2){
        obSp.addImage(obs2);}
        if(type == 3){
            obSp.addImage(obs3);}

        obstacles.add(obSp);
    }

    for(i = 0; i < obstacles.length; i++){

        obstacles[i].velocity.x -= ObmovingSpeed;

        if( obstacles[i].overlap(player)){
          obActive = false;
        }
        if(obstacles[i].position.x + 50 < 0){
            obstacles[i].remove();
                   }
    }

    if(frameCount % 300 == 0){
        obActive = true;
        let obHeight = random(50, 150);
        let obSp = createSprite(width, 60);
        obSp.shapeColor = (0);
        obSp.addImage(obs4);

        obstacles2.add(obSp);
    }

    for(i = 0; i < obstacles2.length; i++){

        obstacles2[i].velocity.x -= ObmovingSpeed;

        if( obstacles2[i].overlap(player)){
          obActive = false;
        }
        if(obstacles2[i].position.x + 50 < 0){
            obstacles2[i].remove();
                   }
    }
    //obstacles.collide(player);
    drawSprites();

}

function shooting(){

    noFill();
    stroke(255);
    ellipse(mouseX, mouseY, 30, 30);

    if( mouseIsPressed && mouseX < width && mouseY < height){

        shoot = true;
            } else {

                shoot = false;
            }

    if(shoot == true){

        if(playSndEffect == true){
        shootSd.play();}

        bulletState = true;
        let bullet = createSprite(player.position.x, player. position.y, 5, 5 );
        bullet.shapeColor = (255);
        push();
        angleMode(DEGREES);
        translate(player.position.x, player.position.y);
        let bulletAngle = atan2(mouseY - player.position.y, mouseX- player.position.x);
        pop();

        bullet.setSpeed(10, bulletAngle);
        bullet.life = 50;
        bullets.add(bullet);

        for(let i = 0; i < bullets.length; i ++){
        if(bullets[i].overlap(enemies) && enemyHealth >= 0){
            enemyHealth -= 1;
            bulletState = false;
            bullets[i].remove(); }
        if(bullets[i].position.x > width){
            bullets[i].remove();
        }

    }
    }

    drawSprites();
}

function drawLifes(){

    for( i = 0; i < playerHealth; i ++){
        let xPos = i * 30 + 10;
        image(lifeImg, xPos, 15);

    }
}

function spawnItems(){
    if(playerHealth < 5){
    let spawnChance = int(random(1, 1000));
    if(spawnChance == 1){
        spawnLife = true;
    } else {
        spawnLife = false;

    }
    if( spawnLife == true){

        let posY = random(100, 200);
        let sp = createSprite( width, posY);
        sp.addImage(lifeImg);
        lifeItem.add(sp);
    }

    for(let i = 0; i < lifeItem.length; i ++){
        lifeItem[i].velocity.x -= movingSpeed;

        if(lifeItem[i].overlap(player) && playerHealth < 5){
            if(playSndEffect == true){
            heal.play();}
            playerHealth += 1;
            lifeItem[i].remove();

        }
    }

    drawSprite();
}
}

function enemy(){

let spawnEnemy = false;
let EnemyspawnChance = int(random(1, enemySpawn));

if(EnemyspawnChance == 1){
    spawnEnemy = true;

} else {
    spawnEnemy = false;}


if(spawnEnemy == true && enemyState == false){
    count = 0; 
    enemyState = true;
    enemyHealth = enemyMaxHealth;
    let enemyX = width- 50;
    let enemyY = random(100, 300);
    let enemySp = createSprite( enemyX, enemyY, 30, 30);
    enemySp.addImage(enemyImg);
    enemies.add(enemySp);}

for( let i = 0; i < enemies.length; i++){
    


    if(enemies[i].position.y >= 50 && enemies[i].position.y <= 200 ){
        ap = 350;
    }
    if(enemies[i].position.y >= 200 && enemies[i].position.y <= 350 ){

        ap = 50;

    }
    enemies[i].attractionPoint(0.2, width-50, ap );
    
    let healthBar = map(enemyHealth, enemyMaxHealth, 0, 50, 0);
    fill(255);
    rect(enemies[i].position.x - 25, enemies[i].position.y - 40, 50, 10);
    fill(255, 0, 0);
    rect(enemies[i].position.x - 25, enemies[i].position.y - 40, healthBar, 10);

        if(enemyHealth <= 1){
            if(playSndEffect == true){
        success.play();}
        enemies[i].remove();
        enemyState = false;
        score += 50 * levelScore;
            }
        if(playerHealth <= 0){
            enemies[i].remove();
        }

        if(count >= enemyMaxDuration){
            
            enemies[i].attractionPoint(0.5, player.position.x, player.position.y);
            
            if(enemies[i].position.x < player.position.x && enemyState == true || enemies[i].position.y >= height){

              if(playSndEffect == true){
                explode.play();}

                playerHealth -= 1;
                enemies[i].remove();
                if(playSndEffect == true){
                hit.play();}
                enemyState = false;
            }
        }
       
    
}

if(enemyState == true){
    count = count + 1;
}


drawSprites();

}

function soundControl(){

    if(BackgroundMusic == true ){
        if(!bgm.isPlaying()){
        bgm.play();}
    }
    if(BackgroundMusic == false){
        bgm.stop();
    }
    gameOverSnd.setVolume(SFXLevel*0.1);
    clicksnd.setVolume(SFXLevel*0.1);
    explode.setVolume(SFXLevel*0.1);
    success.setVolume(SFXLevel*0.1);

    bgm.setVolume(BGMSoundLevel*0.1 );
    jumpSd.setVolume(SFXLevel*0.1 );
    itemSd.setVolume(SFXLevel*0.1 );
    hit.setVolume(SFXLevel*0.1 );
    shootSd.setVolume(SFXLevel*0.1 );
    heal.setVolume(SFXLevel*0.1 );
    

    if(SoundEffect == true){
        playSndEffect = true;
    } else{
        playSndEffect = false;}


    if(gameStart == false){

        BackgroundMusic = false;
        playSndEffect = false;

    }


}

function messageBar(){

    if(enemyState == true){

        fill(255, 0, 0);
        noStroke();
        text("Enemy Spawned!", width/2 - 10, 30 );

        fill(255);
        text("Time Limit: ", width - 180, height - 20);
        let timeLimit = map(count, 0, enemyMaxDuration, 100, 0);
        fill(0, 0, 255);
        //stroke(255);
        rect(width - 120, height - 35, timeLimit, 20);
        }

    


}

function gameReset(){

    playerHealth = 5;
    player.position.x = 150;
    player.position.y = 200;

    score = 0;
    count  = 0;
    frameCount = 0;
    enemyState = false;
    enemyHealth = 50;
    ap = 50;



}

function showResult(){

    background(0);

    image(playerImg, width/2 - 30 , 50);
    noStroke();
    textSize(50);
    textAlign(CENTER);

    fill(255);
    text("Game Over", width/2 , height/2 - 25);
    fill(255, 245, 51);
    text("Your Score is:   " + score, width/2, height/2 + 35);
    textSize(30);
    fill(255);
    text("Click to continue", width/2, height / 2 + 150);
   
    
}   

function mouseClicked(){
    if(mouseX < width){

    if(mouseX < width/2 + 50 && mouseX > width/2 - 50 
    && mouseY  > height/2 + 25 && mouseY < height/2 + 75){
    if(displayMenu == true){

     
        clicksnd.play();

        gameStart = true;
        displayMenu = false;
        gameOver  = false;
        BackgroundMusic = true;
        gameReset(); 
        setDifficulties();

        console.log(enemyMaxDuration);
    }}

    if(gameOver == true){
        clicksnd.play();
        displayMenu = true;
        gameStart = false;
        gameOver = false;
                   }
}
    
}

function setDifficulties(){
    if(Difficulties == 'Beginner'){
        levelScore = 1;
        enemyMaxDuration = 600;
        enemySpawn = 3000;
        obsSpawn = 300;
        ObmovingSpeed = 0.03;
        movingSpeed = 0.1
        gravity = 0.3;
        jumpingHeight = -8;
        bgm.rate(1);
    }
    if(Difficulties == 'Intermediate'){
        levelScore = 2;
        enemyMaxDuration = 500;
        enemySpawn = 2000;
        obsSpawn = 200;
        ObmovingSpeed = 0.05;
        movingSpeed = 0.2;
        gravity = 0.5;
        jumpingHeight = -10;
        bgm.rate(1.5);
    }
    if(Difficulties == 'Expert'){
        levelScore = 3;
        enemyMaxDuration = 400;
        enemySpawn = 900;
        obsSpawn = 80;
        movingSpeed = 0.3;
        ObmovingSpeed = 0.1;
        gravity = 0.6;
        jumpingHeight = -12;
        bgm.rate(1.7);

    }





}
