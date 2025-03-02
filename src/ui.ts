import { Brick } from "./brain.ts";
import Brain from "./brain.ts";
import { Paddle } from "./brain.ts";
import { Ball } from "./brain.ts";

export default class UI{
    // real screen dimensions
    width: number = -1;
    height: number = -1 ; 

    private scaleX: number = 1;
    private scaleY: number = 1;

    constructor(private brain: Brain, private appContainer: HTMLDivElement) {
        this.setScreenDimensions();

        console.log(this);
    }

    setScreenDimensions(width?: number , height?: number): void {
        this.width = width || document.documentElement.clientWidth;
        this.height = height || document.documentElement.clientHeight;

        this.scaleX = this.width / this.brain.width;
        this.scaleY = this.height / this.brain.height;

    }

    calculateScaledX(x: number): number {
        return x * this.scaleX | 0;
    }

    calculateScaledY(y: number): number {
        return y * this.scaleY | 0;
    }

    drawBorderSingle(left: number, top: number, width: number, height: number, color: string): void {

        let border = document.createElement('div');

        border.style.zIndex = '10';
        border.style.position = 'fixed';

        border.style.left = left + 'px';
        border.style.top = top + 'px';

        border.style.width = width + 'px';
        border.style.height = height + 'px';
        border.style.backgroundColor = color;

        this.appContainer.append(border);
    }

    drawInnerBorder(){
    // top border
    this.drawBorderSingle(this.calculateScaledX(this.brain.outerBorderThickness),
        this.calculateScaledY(this.brain.outerBorderThickness),
        this.width - this.calculateScaledX(this.brain.outerBorderThickness) * 2,
        this.calculateScaledY(this.brain.innerBorderThickness), 'grey');

    // left
    this.drawBorderSingle(this.calculateScaledX(this.brain.outerBorderThickness),
    this.calculateScaledY(this.brain.outerBorderThickness),
    this.calculateScaledX(this.brain.innerBorderThickness),
    this.height - this.calculateScaledY(this.brain.outerBorderThickness) * 2, 'grey');

    // right
    this.drawBorderSingle(this.width - this.calculateScaledX(this.brain.outerBorderThickness) - this.calculateScaledX(this.brain.innerBorderThickness),
    this.calculateScaledY(this.brain.outerBorderThickness),
    this.calculateScaledX(this.brain.innerBorderThickness),
    this.height - this.calculateScaledY(this.brain.outerBorderThickness) * 2, 'grey');

    
    // bottom
    this.drawBorderSingle(this.calculateScaledX(this.brain.outerBorderThickness),
    this.height - this.calculateScaledY(this.brain.borderThickness),
    this.width - this.calculateScaledX(this.brain.outerBorderThickness) * 2, 
    this.calculateScaledY(this.brain.innerBorderThickness + 1), 'grey');
    }

    drawOuterBorder() {
        // top border
        this.drawBorderSingle(0, 0, this.width, this.calculateScaledY(this.brain.outerBorderThickness), 'black');
        // left
        this.drawBorderSingle(0, 0, this.calculateScaledX(this.brain.outerBorderThickness), this.height, 'black');
        // right
        this.drawBorderSingle(this.width - this.calculateScaledX(this.brain.outerBorderThickness), 0, this.calculateScaledX(this.brain.outerBorderThickness), this.height, 'black');
        // bottom
        this.drawBorderSingle(0, this.height - this.calculateScaledY(this.brain.outerBorderThickness), this.width, this.calculateScaledY(this.brain.outerBorderThickness), 'black');
    }

    drawPaddle(paddle: Paddle): void {
        let div: HTMLDivElement = document.createElement('div');

        div.style.zIndex = '10';
        div.style.position = 'fixed';

        div.style.left = this.calculateScaledX(paddle.left) + 'px';
        div.style.top = this.calculateScaledY(paddle.top) + 'px';

        div.style.width = this.calculateScaledX(paddle.width) + 'px';
        div.style.height = this.calculateScaledY(paddle.height) + 'px';

        div.style.backgroundColor = paddle.color;

        this.appContainer.append(div);                                                                                        
    }

    drawScore() {
        let div: HTMLDivElement = document.createElement('div');

        div.style.zIndex = '10';
        div.style.position = 'fixed';

        div.style.left = this.calculateScaledX(200) + 'px';
        div.style.top = this.calculateScaledY(30) + 'px';

        div.style.width = this.calculateScaledX(400) + 'px';
        div.style.height = this.calculateScaledY(110) + 'px';

        div.innerHTML = "Complexity level: " + this.brain.level
        + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Score: " + this.brain.score;

        div.style.fontSize = "x-large";
        div.style.backgroundColor = 'black';
        div.style.color = 'orange';
        this.appContainer.append(div);
    }

    drawLevelButtons(){
        let div: HTMLDivElement = document.createElement('div');

        div.style.zIndex = '10';
        div.style.position = 'fixed';

        div.style.left = this.calculateScaledX(400) + 'px';
        div.style.top = this.calculateScaledY(400) + 'px';

        div.style.width = this.calculateScaledX(200) + 'px';
        div.style.height = this.calculateScaledY(200) + 'px';

        div.style.fontSize = "x-large";
        div.style.backgroundColor = 'black';

        let button1: HTMLButtonElement = document.createElement("button");
        let button2: HTMLButtonElement = document.createElement("button");

        button1.innerHTML = "LEVEL 1"
        button1.setAttribute("id", "button1");
        button1.style.height = "100px";
        button1.style.width = "250px";
        button2.innerHTML = "LEVEL 2"
        button2.style.height = "100px";
        button2.style.width = "250px";
        button2.setAttribute("id", "button2");

        div.appendChild(button1);
        div.appendChild(button2);

        this.appContainer.append(div);
    }

    drawBestResults() {
        let div = document.createElement('div');

        div.style.zIndex = '10';
        div.style.position = 'fixed';

        div.style.left = this.calculateScaledX(20) + 'px';
        div.style.top = this.calculateScaledY(160) + 'px';

        div.style.width = this.calculateScaledX(100) + 'px';
        div.style.height = this.calculateScaledY(200) + 'px';

        div.style.backgroundColor = 'white';

        let resultString: string = this.brain.getBestResults().join("<br/><br/>");

        div.innerHTML = "Best results: " + "<br/><br/>" + resultString;
        div.style.fontSize = "x-large";
        div.style.backgroundColor = 'black';
        div.style.color = 'orange';
        this.appContainer.append(div);
    }

    drawBall(ball: Ball) {
        let div = document.createElement('div');

        div.style.zIndex = '10';
        div.style.position = 'fixed';

        div.style.left = this.calculateScaledX(ball.x) + 'px';
        div.style.top = this.calculateScaledY(ball.y) + 'px';

        div.style.width = this.calculateScaledX(ball.width) + 'px';
        div.style.height = this.calculateScaledY(ball.height) + 'px';

        div.style.backgroundColor = ball.color;

        this.appContainer.append(div);
    }

    drawBrickSingle(brick: Brick, brickLineColor: string) {
        let div = document.createElement('div');
        let id = brickLineColor + brick.id;
        div.setAttribute("id", id);

        div.style.zIndex = '10';
        div.style.position = 'fixed';

        div.style.left = this.calculateScaledX(brick.left) + 'px';
        div.style.top = this.calculateScaledY(brick.top) + 'px';

        div.style.width = this.calculateScaledX(brick.width) + 'px';
        div.style.height = this.calculateScaledY(brick.height) + 'px';

        div.style.backgroundColor = brick.color;

        this.appContainer.append(div);
    
    }

    drawBrickLine(brickLine: Array<Brick>, color: string){
        for (let i = 0; i < brickLine.length; i++) {
            this.drawBrickSingle(brickLine[i], color);
        }
    }

    drawChooseLevelPage(){
        document.body.style.backgroundColor = "black";
        this.drawLevelButtons();
    }

    drawBricks(){
        this.drawBrickLine(this.brain.redBrickLine, 'red');
        this.drawBrickLine(this.brain.brightOrangeBrickLine, 'brightOrange');
        this.drawBrickLine(this.brain.orangeBrickLine, 'orange');
        this.drawBrickLine(this.brain.yellowBrickLine, 'yellow');
        this.drawBrickLine(this.brain.greenBrickLine, 'green');
        this.drawBrickLine(this.brain.blueBrickLine, 'blue');
    }

    draw() {
        // clear previous render
        this.appContainer.innerHTML = '';
        this.setScreenDimensions();
        document.body.style.backgroundColor = 'black';

        this.drawOuterBorder();
        this.drawInnerBorder();
        this.drawPaddle(this.brain.paddle);
        this.drawBricks();
        this.drawScore();
        this.drawBestResults();

        this.drawBall(this.brain.ball);

    
    }
}