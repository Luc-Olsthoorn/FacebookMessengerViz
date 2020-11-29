import {useState, useEffect} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, Brush, ResponsiveContainer} from 'recharts';
import moment from 'moment'
const colors = [
  '#72a1e5',
  '#eca400',
  '#2e382e',
  '#9883e5',
  '#fcd3de',
  '#f038ff',
  '#ef709d',
  '#e2ef70',
  '#49111c',
]

const buildGraph = ({messages, timeInterval})=>{
  messages = messages.sort((a,b)=>{if(a.timestamp_ms < b.timestamp_ms) return -1; return 1;});
  let data = [];
  let tempTimeStamp = messages[0].timestamp_ms;
  let tempGroup={};
  let people = { };
  for(let message of messages){
    tempGroup[tempTimeStamp]=tempGroup[tempTimeStamp]||{};
    tempGroup[tempTimeStamp].name = moment(tempTimeStamp).format('MMM YYYY');
    if(message.timestamp_ms < (Number(tempTimeStamp) + Number(timeInterval))){
      //normal add
      tempGroup[tempTimeStamp][message.sender_name] = tempGroup[tempTimeStamp][message.sender_name]+1||1;
      people[message.sender_name]=0;
    }else{
      //finish off the grouping


      data.push({...people, ...tempGroup[tempTimeStamp]});
      tempTimeStamp = tempTimeStamp+timeInterval;
    }
  }
  data.push({...people, ...tempGroup[tempTimeStamp]});
  let peopleList = Object.keys(people);
  console.log(data);
  return {data, peopleList};
}

const timeIntervalMap ={
  'Month':2592000000,
  'Week':604800000,
}

export default function LineGraphMessages({messages}){
  const [data, setData] = useState([]);
  const [people, setPeople] = useState([]);
  const [timeInterval, setTimeInterval] = useState('Month');
  useEffect(()=>{
    const {peopleList, data} = buildGraph({messages:messages, timeInterval:timeIntervalMap[timeInterval]});
    setPeople(peopleList);
    setData(data);
  }, [messages])
  return (
    <div>
    <h3 style={{fontWeight:'300'}}>Interactions over time:</h3>
    <ResponsiveContainer width="95%" height={400}>
      <LineChart
        style={{padding:'1rem', fontWeight:'300'}}
        data={data}
        syncId="main"
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke='white' />
        <XAxis dataKey="name" stroke='white' />
        <YAxis stroke='white'/>
        <Tooltip contentStyle={{backgroundColor:'white', color:'black'}} cursor={{ stroke: 'white', strokeWidth: 2 }} animationDuration={30} />
        <Legend />
        <Brush dataKey="name" data={data} fill="#50C9CE" stroke='white' margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
           <LineChart   >
             {people.map((o,key)=>
               <Line type="monotone"  dataKey={o} strokeWidth={1} dot={false} activeDot={false} stroke={colors[key]||'black'}  />
             )}
           </LineChart>
        </Brush>
        {people.map((o,key)=>
          <Line type="monotone"  dataKey={o} strokeWidth={2} dot={false} activeDot={false} stroke={colors[key]||'black'}  />
        )}
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
}
