import { useEffect, useState } from 'react';
import useSound from 'use-sound';
import Words from './files/words.json';
import correctSfx from './files/correct.wav';
import wrongSfx from './files/wrong.wav';
import endSfx from './files/timeover.wav';

function App() {
  const [sound, setSound] = useState(true)
  const [correctPlay] = useSound(correctSfx);
  const [wrongPlay] = useSound(wrongSfx);
  const [endPlay] = useSound(endSfx);
  const [typing, setTyping] = useState('');
  const [words, setWords] = useState([]);
  const [isTrue, setIsTrue] = useState(true);
  const [trueCount, setTrue] = useState(0);
  const [falseCount, setFalse] = useState(0);
  const [isRun, setRun] = useState(false);
  const [isOver, setOver] = useState(false);
  const [interval, setTimeInterval] = useState(false);
  const [time, setTime] = useState(60);

  useEffect(() => {
    setWords(Words.sort(() => 0.5 - Math.random()).slice(0,40))
  }, []);

  useEffect(() => {
    if(time === 0){
      clearInterval(interval)
      setOver(true)
      sound && endPlay()
    }
  }, [time, interval, endPlay, sound]);

  const start = () => {
    setRun(true)
    const newInterval = setInterval(() => {
      setTime(prevCount => prevCount - 1);
    }, 1000);
    setTimeInterval(newInterval);
  }

  const writingWordControl = e => {
    setTyping(e.toLowerCase())
    e === ' ' || !e ? setTyping('') : isRun || start()
    setIsTrue(words[0].slice(0, e.length).toLowerCase() === e.toLowerCase().replace(' ',''))
    if(e.indexOf(' ') > 0){
      if(words[0].toLowerCase() === e.toLowerCase().replace(' ','')){
        setTrue(prev => prev + 1)
        sound && correctPlay()
      }else{
        setFalse(prev => prev + 1)
        sound && wrongPlay()
      }
      setTyping('')
      words.splice(0,1)
    }
  }

  const replay = () => {
    setWords(Words.sort(() => 0.5 - Math.random()).slice(0,40))
    clearInterval(interval)
    setTrue(0)
    setFalse(0)
    setTyping('')
    setRun(false)
    setTime(60)
    setOver(false)
  }

  const writingWordClass = () => {
    if(!typing) return 'active'
    return isTrue ? 'true' : 'wrong'
  }

  return (
    <div className="App">
      <h1 className="Title">Fast Typing</h1>
      <div className={`${isOver ? 'end-stat' : "stat"}`}>
        <span>Correct {trueCount} |</span>
        <span>| Wrong {falseCount}</span><br></br>
        {!isOver ?(
          <span className="time">{time}</span>
        ) : (
          <>
            <div className="time-over">T I M E &nbsp;O V E R</div>
            <button className="replay" onClick={() => replay()}>Replay</button>
          </>
        )}
      </div>
      {!isOver &&
        <>
          <div className="words">
            {words.filter((_data, index) => index < 20).map((word, i) => 
              <span className={`${i === 0 ? writingWordClass() : ""}`} key={i}>{word}{i === 19 ? '. . .' : ' '}</span>
            )}
          </div>
          <div className="body">
            {words.length > 0 &&
              <input value={typing} onChange={(e) => writingWordControl(e.target.value)} placeholder={`${!isRun ? 'start typing' : ""}`}></input>}
            <button onClick={() => setSound(prevState => !prevState)}>Sound <br/>{sound ? 'On' : 'Off'}</button>
            <button onClick={() => replay()}>Replay</button>
          </div>
          <p className="footer">Press space to confrim or skip word</p>
        </>
      }
    </div>
  );
}

export default App;
