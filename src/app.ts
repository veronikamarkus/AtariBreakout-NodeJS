import Brain from "./brain.js";
import UI from "./ui.js";

function validateIndexHtml() {
    if (document.querySelectorAll("#app").length != 1) {
        throw Error("More or less than one div with id 'app' found!");
    }
    if (document.querySelectorAll("div").length != 1) {
        throw Error("More or less than one div found in index.html!");
    }
}

function uiDrawRepeater(ui: UI){
    setTimeout(() => {
        ui.draw(); 
        uiDrawRepeater(ui);
    }, 0);
}

function main(){
    validateIndexHtml();
    let appDiv: HTMLDivElement = document.querySelector<HTMLDivElement>("#app")!;;
    let brain: Brain = new Brain();
    let ui = new UI(brain, appDiv);

    // const fn = (e) => {
    //     ui.draw();
    // }

    ui.drawChooseLevelPage();

    document.getElementById('button1')!.addEventListener('click', function() {
        ui.draw();
        brain.setLevel1();
        brain.startMoveBall(-60);
        uiDrawRepeater(ui);
    });

    document.getElementById('button2')!.addEventListener('click', function() {
        ui.draw();
        brain.setLevel2();
        brain.startMoveBall(-60);
        uiDrawRepeater(ui);
    });

    document.addEventListener('keydown', (e) =>{
        switch (e.key) {
            case 'ArrowLeft':
                brain.startMovePaddle(brain.paddle, -1);
                break;
            case 'ArrowRight':
                brain.startMovePaddle(brain.paddle, 1);
                break;
        }
     });

     document.addEventListener('keyup', (e) =>{
        switch (e.key) {
            case 'ArrowLeft':
                brain.stopMovePaddle(brain.paddle);
                break;
            case 'ArrowRight':
                brain.stopMovePaddle(brain.paddle);
                break;
            case ' ':
                if (brain.gameOver){
                  brain.startNewGame();
              } else if (brain.paused){
                  brain.unpauseTheGame();
              } else {
                brain.paused = true;
              }
        }
     });

}


console.log("App startup...");
main();
