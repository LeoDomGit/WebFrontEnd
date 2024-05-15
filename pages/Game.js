import styled from "styled-components";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
/**
 * All the constant values required for the game to work.
 * By changing these values we can effect the working of the game.
 */
const BIRD_HEIGHT = 28;
const BIRD_WIDTH = 33;
const WALL_HEIGHT = 600;
const WALL_WIDTH = 400;
const GRAVITY = 8;
const OBJ_WIDTH = 52;
const OBJ_SPEED = 6;
const OBJ_GAP = 200;

/**
 * This function is the main component which renders all the game objects.
 * @returns None
 */
function Game() {

    //Changing the game values based on the activities done in the game.
    const [isStart, setIsStart] = useState(false);
    const [birdpos, setBirdpos] = useState(300);
    const [objHeight, setObjHeight] = useState(0);
    const [objPos, setObjPos] = useState(WALL_WIDTH);
    const [score, setScore] = useState(0);
    const saveScore = (score) => {
        localStorage.setItem('score', score);
    };
    const notyf = new Notyf({
        duration: 1000,
        position: {
          x: "right",
          y: "top",
        },
        types: [
          {
            type: "warning",
            background: "orange",
            icon: {
              className: "material-icons",
              tagName: "i",
              text: "warning",
            },
          },
          {
            type: "error",
            background: "indianred",
            duration: 2000,
            dismissible: true,
          },
        ],
      });
    const incrementAndSaveScore = () => {
        setScore((prevScore) => {
            const newScore = prevScore + 1;
            saveScore(newScore);
            return newScore;
        });
    };

    useEffect(() => {
        let intVal;
        if (isStart && birdpos < WALL_HEIGHT - BIRD_HEIGHT) {
            intVal = setInterval(() => {
                setBirdpos((birdpos) => birdpos + GRAVITY);
            }, 24);
        } else {
            setIsStart(false);
            setBirdpos(300);
            setScore(0);
        }
        return () => clearInterval(intVal);
    });

    useEffect(() => {
        let objval;
        if (isStart && objPos >= -OBJ_WIDTH) {
            objval = setInterval(() => {
                setObjPos((objPos) => objPos - OBJ_SPEED);
            }, 24);

            return () => {
                clearInterval(objval);
            };
        } else {
            setObjPos(WALL_WIDTH);
            setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));
            if (isStart) incrementAndSaveScore();
        }
    }, [isStart, objPos]);

    useEffect(() => {
        let topObj = birdpos >= 0 && birdpos < objHeight;
        let bottomObj =
            birdpos <= WALL_HEIGHT &&
            birdpos >=
            WALL_HEIGHT - (WALL_HEIGHT - OBJ_GAP - objHeight) - BIRD_HEIGHT;

        if (
            objPos >= OBJ_WIDTH &&
            objPos <= OBJ_WIDTH + 80 &&
            (topObj || bottomObj)
        ) { 
            console.log(localStorage.getItem('score'));
            axios.post(process.env.REACT_APP_API_URL+'scores',{
                idUser:Number(localStorage.getItem('id')),
                score:Number(localStorage.getItem('score')),
            }).then((res)=>{
                if(res.data.check==true){
                    notyf.open({
                        type: "error",
                        message:'You Lose',
                      });
                }
            });
            setIsStart(false);
            setBirdpos(300);
            setScore(0);
        }
    }, [isStart, birdpos, objHeight, objPos]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.code === 'Space') {
                setIsStart(true);
                setBirdpos((prev) => prev - 30);
            }
        };

        window.addEventListener('keypress', handleKeyPress);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [isStart, birdpos]);

    const handler = () => {
        if (!isStart) setIsStart(true);
        else if (birdpos < BIRD_HEIGHT) setBirdpos(0);
        else setBirdpos((birdpos) => birdpos - 50);
    };

    const handleKeyDown = (event) => {

        if (event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault();
            handler();
        }
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md">
                        <ScoreShow>Score: {score}</ScoreShow>
                        <Button className="btn btn-sm btn-primary" onClick={(e)=>{
                            localStorage.removeItem('id');
                            localStorage.removeItem('score');
                            notyf.open({
                                type: "success",
                                message: "Thank you. Good Bye",
                              });
                              setTimeout(() => {
                                window.location.replace('/');
                            }, 2000);
                        }}>Logout</Button>
                        <Home onClick={handler} onKeyDown={handleKeyDown} tabIndex="0">

                            <Background height={WALL_HEIGHT} width={WALL_WIDTH}>
                                {!isStart ? <Startboard>Click To Start</Startboard> : null}
                                <Obj
                                    height={objHeight}
                                    width={OBJ_WIDTH}
                                    left={objPos}
                                    top={0}
                                    deg={180}
                                />
                                <Bird
                                    height={BIRD_HEIGHT}
                                    width={BIRD_WIDTH}
                                    top={birdpos}
                                    left={100}
                                />
                                <Obj
                                    height={WALL_HEIGHT - OBJ_GAP - objHeight}
                                    width={OBJ_WIDTH}
                                    left={objPos}
                                    top={WALL_HEIGHT - (objHeight + (WALL_HEIGHT - OBJ_GAP - objHeight))}
                                    deg={0}
                                />
                            </Background>
                            
                        </Home>

                    </div>
                </div>
            </div>

        </>

    );
}

export default Game;

//All the stylesheets required for the game.
const Home = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flexDirection: 'column';
`;

const Background = styled.div`
  background-image: url("./images/background-day.png");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: relative;
  overflow: hidden;
  border: 2px solid black;
`;

const Bird = styled.div`
  position: absolute;
  background-image: url("./images/yellowbird-upflap.png");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;

const Obj = styled.div`
  position: relative;
  background-image: url("./images/pipe-green.png");
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  transform: rotate(${(props) => props.deg}deg);
`;

const Startboard = styled.div`
  position: relative;
  top: 60%;
  background-color: black;
  padding: 10px;
  width: 100px;
  left: 50%;
  margin-left: -50px;
  text-align: center;
  font-size: 20px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
`;

const ScoreShow = styled.div`
  position: absolute;
  top: 10%;
  left: 48%;
  z-index: 1;
  font-weight: bold;
  font-size: 30px;
`;
const Button = styled.button`
position: absolute;
top: 15%;
left: 48.5%;
z-index: 1;
font-weight: bold;
font-size: 20px;
`;