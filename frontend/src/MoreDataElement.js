import {useState, useEffect} from 'react';
import LineGraphMessages from './LineGraphMessages';
import TimeHeatMap from './TimeHeatMap';
import WordUsage from './WordUsage';
import moment from 'moment'

export default function MoreDataElement({close, id}){
  const [rawAdvancedData, setRawAdvancedData] = useState({});
  useEffect(()=>{
    fetch(`http://localhost:3000/advancedStats?id=${id}`).then((resp)=>{
      return resp.json();
    }).then((data)=>{
      setRawAdvancedData(data);
    })
  },[id])//onload fetch data
  return (
    <div style={{width:'50%', backgroundColor:'#50C9CE', color:'white', height:'100vh', overflowY:'auto'}}>
      <div style={{padding:'2rem'}}>
        <h1 style={{padding:'1rem', fontWeight:'100', textAlign:'center', fontSize:'3rem'}}>Stats for {rawAdvancedData.title}:</h1>
        <hr style={{borderTop: '1px solid white'}}/>
        {rawAdvancedData?.messages?(
          <>
          <LineGraphMessages messages={rawAdvancedData.messages}/>
          <div style={{display:'flex', paddingTop:'3rem', alignItems:'center'}}>
            <div style={{width:'50%', padding:'1rem'}}>
              <BasicMessagingStats messages={rawAdvancedData.messages}/>
            </div>
            <div style={{width:'50%', padding:'1rem'}}>
              <TimeHeatMap messages={rawAdvancedData.messages}/>
            </div>
          </div>
          <WordUsage messages={rawAdvancedData.messages}/>


          </>
        ):(<></>)}
      </div>
    </div>
  )
}

function BasicMessagingStats ({messages}){
  messages = messages.sort((a,b)=>{if(a.timestamp_ms < b.timestamp_ms) return -1; return 1;});
  let data = [];
  const averageMessagesPerDay = Math.ceil(messages.length/((messages[messages.length-1].timestamp_ms-messages[0].timestamp_ms)/86400000))
  const amountOfTimeTalking = moment.duration(moment(messages[messages.length-1].timestamp_ms).diff(moment(messages[0].timestamp_ms))).humanize();
  const amountCalled = messages.filter(o=>o.type==='Call').length;
  const spentTaling = moment.duration(moment(messages.filter(o=>o.type==='Call').reduce((a, b) => a + b.call_duration, 0)*1000).diff(moment(0))).humanize();
  const averageCallDuration = moment.duration(moment(messages.filter(o=>o.type==='Call').reduce((a, b) => a + b.call_duration, 0)*1000/amountCalled).diff(moment(0))).humanize();
  const longestCall = moment.duration(moment(Math.max(...messages.filter(o=>o.type==='Call').map(o=>o.call_duration))*1000).diff(moment(0))).humanize();
  return (<div style={{fontSize:'2rem', fontWeight:'300'}}>
    You have spent <span style={{color:'#EF709D'}}>{amountOfTimeTalking}</span> interacting with each other, sharing an average of about <span style={{color:'#EF709D'}}>{averageMessagesPerDay}</span> interactions a day
    <br/>
    <br/>
    {messages.find(o=>o.type==='Call')?(<>You have called each other <span style={{color:'#EF709D'}}>{amountCalled}</span> times, averaging <span style={{color:'#EF709D'}}>{averageCallDuration}</span> each time and about <span style={{color:'#EF709D'}}>{spentTaling}</span> in total
    <br/>One time you spoke for <span style={{color:'#EF709D'}}>{longestCall}</span></>

  ):(<>You have never called each other</>)}
  </div>)
}
