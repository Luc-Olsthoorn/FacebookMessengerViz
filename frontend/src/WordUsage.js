import {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment'
import utf8 from 'utf8';

const emojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

const processWords = ({messages})=>{
  let totalChars = 0;
  let totalWords = 0;
  let wordMap = {};
  messages.forEach(message=>{
    totalChars += message.content?.length||0;
    let words = message.content?.split(' ') || [];
    totalWords += words.length;
    words.forEach(word=>{
      let strippedWord = word.toLowerCase().replace('.','').replace(',','').replace('?','');
      if(strippedWord){
          wordMap[strippedWord]=wordMap[strippedWord]+1||1
      }
    })//adds one to a word or maes new one
  })
  let wordList = Object.entries(wordMap);
  wordList.sort(([worda,counta],[wordb,countb])=>{if(counta>countb)return-1; return 1});
  let emojiList = [];
  wordList.forEach(([word, count])=>{
    let emojiWord=word;
    try{
      emojiWord = utf8.decode(word)
    }catch(err){
      //do nothing
    }
    if(emojiWord.match(emojiRegex)){
      emojiList.push([emojiWord,count]);
    }
  })
  return {totalWords, wordList, emojiList}
}

export default function WordUsage({messages}){
  const [totalWordsState, setTotalWords] = useState(0);
  const [wordListState, setWordList] = useState([]);
  const [emojiListState, setEmojiList] = useState([]);
  const [wordsLoaded, setWordsLoaded] = useState(10);
  const [emojisLoaded, setEmojisLoaded] = useState(10);
  useEffect(()=>{
    setTimeout(()=>{
      const {totalWords, wordList, emojiList} = processWords({messages});
      setWordList(wordList);
      setTotalWords(totalWords);
      setEmojiList(emojiList);
    },200)
  }, [messages])


  return (
    <div style={{display:'flex', alignItems:'center'}}>

      <div style={{width:'50%', padding:'1rem'}}>
        <h3 style={{fontWeight:'300'}}>Here are your most popular words:</h3>
        <div style={{height:'200px', width:'100%', overflowY:'auto', overFlowX:'hidden', margin:'1rem', maxWidth:'400px'}}>
          <InfiniteScroll
            pageStart={0}
            loadMore={()=>{setWordsLoaded(wordsLoaded+10)}}
            hasMore={wordsLoaded<wordListState.length}
            loader={<div className="loader" key={0}>Loading ...</div>}
            useWindow={false}
          >
          {wordListState.slice(0, wordsLoaded).map(([word,count],key)=><div style={{fontSize:'1.25rem'}}>
            {key+1}. <span style={{color:'#EF709D'}}>{word}</span>, <span style={{fontWeight:'200'}}>{count} times</span>
          </div>)}
          </InfiniteScroll>
        </div>
        <h3 style={{fontWeight:'300'}}>Here are your most popular emojis:</h3>
        <div style={{height:'200px', width:'100%', overflowY:'auto', overFlowX:'hidden', margin:'1rem', maxWidth:'400px'}}>
          <InfiniteScroll
            pageStart={0}
            loadMore={()=>{setEmojisLoaded(emojisLoaded+10)}}
            hasMore={emojisLoaded<emojiListState.length}
            loader={<div className="loader" key={0}>Loading ...</div>}
            useWindow={false}
          >
          {emojiListState.slice(0, emojisLoaded).map(([emoji,count],key)=><div style={{fontSize:'1.25rem'}}>
            {key+1}. {emoji}, <span style={{fontWeight:'200'}}>{count} times</span>
          </div>)}
          </InfiniteScroll>
        </div>
      </div>
      <div style={{width:'50%', padding:'1rem'}}>
        <h3 style={{fontWeight:'300'}}>Word usage:</h3>
        <div style={{fontSize:'2rem', fontWeight:'300'}}>
          You have said <span style={{color:'#EF709D'}}>{totalWordsState}</span> words to each other.
          Each message has an average length of <span style={{color:'#EF709D'}}>{Math.ceil(totalWordsState/messages.length)}</span> words.
        </div>
      </div>
    </div>
  )
}
