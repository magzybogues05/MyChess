const { Chess }=require("chess.js");
const { GAME_OVER, INIT_GAME, MOVE } = require('./Messages')

 class Game{

    constructor(player1,player2){
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.startTime=new Date();
        this.moveCount=0;
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"white"
            }
        }));
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"black"
            }
        }));
    }

    makeMove(socket,move)
    {
        //validation
        if(this.moveCount%2==0 && socket!==this.player1)
        {
            return;
        }
        if(this.moveCount%2==1 && socket!==this.player2)
        {
            return; 
        }
        try{
            this.board.move(move);
            
        }
        catch(e)
        {
            console.log(e);
            return;
        }

        //check if the game is over

        if(this.board.isGameOver())
        {
            //send game over to both the players
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner: this.board.turn()==="w"?"black":"white"
                }
            }))
            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner: this.board.turn()==="w"?"black":"white"
                }
            }))
            return;
        }

        if(this.moveCount%2==0)
        {
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        }
        else{
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        }
        this.moveCount++;

        //send the updated board to both the players
    }

}

module.exports={Game};