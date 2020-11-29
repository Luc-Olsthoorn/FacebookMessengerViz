import moment from 'moment'
export default function TimeHeatMap ({messages}){
  let dayWeekMap = {};
  let max=0;
  messages.forEach((message)=>{
    const date = moment(message.timestamp_ms);
    const dayOfTheWeek = date.day(); //0 is Sunday
    const timeOfDay = date.hour();
    dayWeekMap[dayOfTheWeek] = dayWeekMap[dayOfTheWeek] || {};
    dayWeekMap[dayOfTheWeek][timeOfDay] = dayWeekMap[dayOfTheWeek][timeOfDay]+1 || 1;
    if(dayWeekMap[dayOfTheWeek][timeOfDay]>max){
      max=dayWeekMap[dayOfTheWeek][timeOfDay];
    }
  })
  const days = [
    {num:0, text:'S'},
    {num:1, text:'M'},
    {num:2, text:'T'},
    {num:3, text:'W'},
    {num:4, text:'T'},
    {num:5, text:'F'},
    {num:6, text:'S'},
  ]
  const hours = [
    {num:0, text:'12:00 a.m.'},
    {num:1, text:'1:00 a.m.'},
    {num:2, text:'2:00 a.m.'},
    {num:3, text:'3:00 a.m.'},
    {num:4, text:'4:00 a.m.'},
    {num:5, text:'5:00 a.m.'},
    {num:6, text:'6:00 a.m.'},
    {num:7, text:'7:00 a.m.'},
    {num:8, text:'8:00 a.m.'},
    {num:9, text:'9:00 a.m.'},
    {num:10, text:'10:00 a.m.'},
    {num:11, text:'11:00 a.m.'},
    {num:12, text:'12:00 p.m.'},
    {num:13, text:'1:00 p.m.'},
    {num:14, text:'2:00 p.m.'},
    {num:15, text:'3:00 p.m.'},
    {num:16, text:'4:00 p.m.'},
    {num:17, text:'5:00 p.m.'},
    {num:18, text:'6:00 p.m.'},
    {num:19, text:'7:00 p.m.'},
    {num:20, text:'8:00 p.m.'},
    {num:21, text:'9:00 p.m.'},
    {num:22, text:'10:00 p.m.'},
    {num:23, text:'11:00 p.m.'},

  ]
  return (
    <div>
      <h3 style={{fontWeight:'300'}}>Heatmap of Interactions</h3>
      <table>
        <tr>
          <td/>
          {days.map(day=><td style={{textAlign:'center'}}>{day.text}</td>)}
        </tr>
        {hours.map(hour=>
          <tr>
            <td>{hour.text}</td>
            {days.map(day=>{
              let count = 0;
              if(dayWeekMap[day.num] && dayWeekMap[day.num][hour.num]) count = dayWeekMap[day.num][hour.num];
              return(
              <td style={{backgroundColor: `rgba(239, 112, 157, ${count/max})`, padding:'.5rem 1rem .5rem 1rem'}}>

              </td>)
            }
            )}
          </tr>
        )}
      </table>
    </div>
  )
}
