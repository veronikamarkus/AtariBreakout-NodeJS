export class Paddle {
    readonly width: number = 150;
    readonly height: number = 50;

    private intervalId: number | undefined = undefined;

    constructor(private _left: number, private _top: number, private _color: string) {
    }

    validateAndFixPosition(borderThickness: number): void {
        if (this._left < borderThickness) {
            this._left = borderThickness;
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }

        if ((this._left + this.width) > 1000 - borderThickness) {
            this._left = (1000 - borderThickness) - (this.width);
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }

        console.log(this.left);
    }

    startMove(step: number, borderThickness: number): void {
        if (this.intervalId !== undefined) return;

        this.intervalId = setInterval(() => {
            this._left += step * 30;
            this.validateAndFixPosition(borderThickness);

        }, 40);

    }

    stopMove(borderThickness: number): void {
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
        this.validateAndFixPosition(borderThickness);
    }

    get left(){
        return this._left;
    }

    get top(){
        return this._top;
    }

    get color(){
        return this._color;
    }
}


export class Ball {
    readonly width: number = 15;
    readonly height: number = 15;

    private _movingAngle: number = -1;
    private _movingUp: boolean = true;
    private _movingRight: boolean = true;
    
    constructor(private _x: number, private _y: number, private _color: string){

    }

    get movingAngle(){
        return this._movingAngle;
    }

    set movingAngle(angle:number){
        this._movingAngle = angle;
    }

    get movingUp(){
        return this._movingUp;
    }

    set movingUp(isMovingUp: boolean){
        this._movingUp = isMovingUp;
    }

    get movingRight(){
        return this._movingRight;
    }

    set movingRight(isMovingRight: boolean){
        this._movingRight = isMovingRight;
    }

    get x(){
        return this._x;
    }

    set x(x: number){
        this._x = x;
    }

    get y(){
        return this._y;
    }

    set y(y: number){
        this._y = y;
    }

    get color(){
        return this._color;
    }

}

export class Brick {
    //64
    width = (1000 - 2 * 180) / 10;
    height = 35;
    
    constructor(private _left: number, private _top: number, private _color: string, private _id: number) {
       
    }

    get left(){
        return this._left;
    }

    get top(){
        return this._top;
    }

    get id(){
        return this._id;
    }

    get color(){
        return this._color;
    }

}

export default class Brain{
    readonly width: number = 1000;
    readonly height: number = 1000;
    readonly outerBorderThickness: number = 150;
    readonly innerBorderThickness: number = 30;
    readonly borderThickness: number = this.innerBorderThickness + this.outerBorderThickness;
 
    readonly paddle = new Paddle(425, 1000 - this.borderThickness - 50, 'red');
    readonly ball = new Ball(485, 625, 'red');

    redBrickLine: Brick[] = [];
    brightOrangeBrickLine: Brick[] = [];
    orangeBrickLine: Brick[] = [];
    yellowBrickLine: Brick[] = [];
    greenBrickLine: Brick[] = [];
    blueBrickLine: Brick[] = [];

    private _level: number = 1;
    private _score: number = 0;
    private bricksCount: number = 60;

    private results: number[] = [];

    private _gameOver: boolean = false;
    private _paused: boolean = true;

    private speed: number = 10;

    createNewBricks(){
        this.redBrickLine = this.createBrickLine(300, 'red');
        this.brightOrangeBrickLine = this.createBrickLine(335, '#ED5F1F');
        this.orangeBrickLine = this.createBrickLine(370, 'orange');
        this.yellowBrickLine = this.createBrickLine(405, '#E5E946');
        this.greenBrickLine = this.createBrickLine(440, '#70E563');
        this.blueBrickLine = this.createBrickLine(475, '#4947B8');
    }

    createBrickLine(brickLineTop: number, color: string){
        let brickLine: Brick[] = [];
        let brickLeft: number = 180;

        for (let id = 0; id < 10; id++){
            let brick = new Brick(brickLeft, brickLineTop, color, id);
            brickLine.push(brick);

            brickLeft += brick.width;
        }
        
        return brickLine;
    }

    startMoveBall(angle: number){
        this.ball.movingAngle = angle;
            
        const myInterval = setInterval( () => {
        
            if (this.bricksCount == 0){
                
                this.newRound();
            }
            if (this.gameOver || this.paused){
                clearInterval(myInterval);
            } else {
                this.calculateNextStop(this.degToRad(this.ball.movingAngle), this.speed);
                if (this.detectCollisionWithBrickLine()){
                    
                } else if (this.ball.y >= 1000 - (this.borderThickness + this.paddle.height)){
                    this.checkAndHandleCollisionWithPaddle(this.ball.x, this.ball.x + this.ball.width, this.paddle.left, this.paddle.left + this.paddle.width);
                } else if (this.ball.x <= this.borderThickness) {
                    this.handleCollisionWithLeftWall();
                } else if (this.ball.x + this.ball.width >= 1000 - this.borderThickness) {
                    this.handleCollisionWithRightWall();
                } else if (this.ball.y <= 0 + this.borderThickness){
                    this.handleCollisionWithCeiling();
                } 
            }
        }, 40);

    }

    getBestResults(){
        this.results.sort(function (a, b){
            return b - a;
        });

        this.results = this.results.slice(0, 7);

        return this.results;
    }

    newRound(){
        this.bricksCount = 60;
        this.speed += 5;
        // const myTimeout = 
        setTimeout(() => this.createNewBricks(), 2000);
    
    }

    calculateNextStop(angle: number, speed: number){
        this.ball.x = this.ball.x + speed * Math.cos(angle);
        this.ball.y = this.ball.y + speed * Math.sin(angle);

    }

    handleGameOver(){
        this.results.push(this.score);
        this._score = 0;
        this._gameOver = true;
        this.bricksCount = 60;
        this.ball.y = 625;
        this.ball.x = 485;
        this.createNewBricks();

    }

    handleCollisionWithCeiling(){
        this.ball.y = this.borderThickness;
        this.ball.movingAngle *= -1;
        this.changeMovingDirection();
        this.ball.movingUp = false;
    }

    handleCollisionWithLeftWall(){
        this.ball.x = this.borderThickness;
        this.ball.movingAngle = 180 - this.ball.movingAngle;
        this.changeMovingDirection();
    }

    handleCollisionWithRightWall(){
        this.ball.x = 1000 - this.borderThickness - this.ball.width;
        this.ball.movingAngle = 180 - this.ball.movingAngle;
        this.changeMovingDirection();
    }


    checkAndHandleCollisionWithPaddle(ballLeftX: number, ballRightX: number, paddleLeftX: number, paddleRightX: number){
        if (ballRightX >= paddleLeftX  && ballLeftX <= paddleRightX){
            
            this.ball.y = 1000 - (this.borderThickness + this.paddle.height + this.ball.height);
            this.setBounceAnlgeFromPaddle(ballLeftX, ballRightX, paddleLeftX, paddleRightX);
            this.ball.movingUp = true;
            
        } else if (this.ball.y >= 1000 - this.borderThickness - 15){
            this.handleGameOver();
        }
    }

    setBounceAnlgeFromPaddle(ballLeftX: number, ballRightX: number, paddleLeftX: number, paddleRightX: number){
        let paddleUnit: number = this.paddle.width / 5;    

        switch (true) {
            // ball landed on the edge
            case (ballLeftX <= paddleLeftX + paddleUnit || ballRightX  >= paddleLeftX + 4 * paddleUnit):

                if(this.ball.movingRight){
                    this.ball.movingAngle = -40;
                } else {
                        this.ball.movingAngle = -140;
                }

            console.log('edge ', this.ball.movingAngle)
            break;

            // ball landed in the middle of paddle
            case (ballLeftX >= paddleLeftX + 2 * paddleUnit && ballRightX <= paddleLeftX + 3 * paddleUnit): 
 
                if(this.ball.movingRight){
                        this.ball.movingAngle = -60;
                } else {
                        this.ball.movingAngle = -120;
                }

                console.log('middle part', this.ball.movingAngle)
                break;

            default:

                this.ball.movingAngle *= -1;
            
                console.log('next to middle part', this.ball.movingAngle)
                break;
        }

    }

    detectCollisionWithBrickLine(){

        // if there is collision with bricks
        if (this.ball.y > 299 && this.ball.y <= 510) {
            
            // check which brickline is collisioned
            switch (true) {
                case (this.ball.y < 335):
                    if (this.detectCollisionWithBrick(this.redBrickLine)){
                        // fix ball position
                        this.fixBallPositionAndChangeAngle(300, 334)
                        return true;
                    }
                    break;
                case (this.ball.y < 370):
                    if (this.detectCollisionWithBrick(this.brightOrangeBrickLine)){
                        this.fixBallPositionAndChangeAngle(335, 369);
                        return true;
                    }
                    break;
                case (this.ball.y < 405):
                    if (this.detectCollisionWithBrick(this.orangeBrickLine)){
                        this.fixBallPositionAndChangeAngle(370, 404);
                        return true;
                    }
                    break;
                case (this.ball.y < 440):
                    if (this.detectCollisionWithBrick(this.yellowBrickLine)){
                        this.fixBallPositionAndChangeAngle(405, 439);
                        return true;
                    }
                    break;
                case (this.ball.y < 475):
                    if (this.detectCollisionWithBrick(this.greenBrickLine)){
                        this.fixBallPositionAndChangeAngle(440, 474);
                        return true;
                    }
                    break;
                case (this.ball.y <= 510):
                    if (this.detectCollisionWithBrick(this.blueBrickLine)){
                        this.fixBallPositionAndChangeAngle(475, 510);
                        return true;
                    }
                    break;
            }
            return false;
        }
    }

    detectCollisionWithBrick(brickLine: Brick[]){
        switch (true) {
 
            case (this.ball.x > 179  && this.ball.x < 244):
                if (this.removeBrick(180, brickLine)){
                    this.bricksCount--;
                    this._score++;
                return true;
                }
                break;

            case (this.ball.x > 243  && this.ball.x < 308):
                if (this.removeBrick(244, brickLine)){
                    this.bricksCount--;
                    this._score++;
                return true;
                }
                break;
            
            case (this.ball.x > 307  && this.ball.x < 372):
                if (this.removeBrick(308, brickLine)){
                    this.bricksCount--;
                    this._score++;
                return true;
                }
                break;
                
            case (this.ball.x > 371  && this.ball.x < 436):
                if (this.removeBrick(372, brickLine)){
                    this.bricksCount--;
                    this._score++;
                return true;
                }
                break;
                
            case (this.ball.x > 435  && this.ball.x < 500):
                if (this.removeBrick(436, brickLine)){
                    this.bricksCount--;
                    this._score++;
                return true;
                }
                break;

            case (this.ball.x > 499  && this.ball.x < 564):
                if (this.removeBrick(500, brickLine)){
                    this.bricksCount--;
                    this._score++;
                return true;
                }
                break;

            case (this.ball.x > 563  && this.ball.x < 628):
                if (this.removeBrick(564, brickLine)){
                    this.bricksCount--;
                    this._score++;
                return true;
                }
                break;

            case (this.ball.x > 627  && this.ball.x < 692):
                if (this.removeBrick(628, brickLine)){
                    this.bricksCount--;
                    this._score++;
                    return true;
                }
                break;

            case (this.ball.x > 691  && this.ball.x < 756):  
                if (this.removeBrick(692, brickLine)){
                    this.bricksCount--;
                    this._score++;
                return true;
                }
                break;

            case (this.ball.x > 755  && this.ball.x < 821):   
                if (this.removeBrick(756, brickLine)){
                    this.bricksCount--;
                    this._score++;
                    return true;
                }
                break;
        }
       
        return false;
    }

    removeBrick(brickLeft: number, brickLine: Brick[]){
        let brickToRemove: Brick | undefined = brickLine.find(brick => {
            return (brick.left === brickLeft);
        })
    
        if (brickToRemove == undefined) {
            return false;
        }
        let index: number = brickLine.indexOf(brickToRemove);
        if (index > -1) {
            brickLine.splice(index, 1);
        }
        
        return true;
    }

    fixBallPositionAndChangeAngle(brickTopY: number, brickBottomY: number){
        this.ball.movingAngle *= -1;

        if (this.ball.movingUp) {
            this.ball.y = brickBottomY;
            this.ball.movingUp = false;
        } else {
            this.ball.y = brickTopY;
            this.ball.movingUp = true;
        }
    
    }

    changeMovingDirection(){
        if (this.ball.movingRight){
            this.ball.movingRight = false;
        } else {
            this.ball.movingRight = true;
        }
    }

    constructor() {
        console.log("Brain ctor");
        this.createNewBricks();
    }

    startMovePaddle(paddle: Paddle, step: number) {
        paddle.startMove(step, this.borderThickness);
    }

    stopMovePaddle(paddle: Paddle) {
        paddle.stopMove(this.borderThickness);
    }

    degToRad(degrees: number)
    {
    var pi = Math.PI;
    return degrees * (pi/180);
    }

    startNewGame(){
        if (this._level == 1){
            this.speed = 7;
        } else if (this._level == 2){
            this.speed = 10;
        }
        this.ball.movingUp = true;
        this._gameOver = false;
        this.startMoveBall(-60);
    }

    unpauseTheGame(){
        this._paused = false;
        this.startMoveBall(this.ball.movingAngle);
    }

    setLevel1(){
        this.speed = 7;
        this._level = 1;
    }

    setLevel2(){
        this.speed = 10;
        this._level = 2;
    }

    get level(){
        return this._level;
    }

    get score(){
        return this._score;
    }

    get paused(){
        return this._paused;
    }

    set paused(isPaused: boolean){
        this._paused = isPaused;
    }

    get gameOver(){
        return this._gameOver;
    }

}