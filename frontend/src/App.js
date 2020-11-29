import {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import MoreDataElement from './MoreDataElement';

export default function App() {
  const [rawBasicData, setRawBasicData] = useState([]);
  const [moreDataId, setMoreDataId] = useState(false);
  const [filteredBasicData, setFilteredBasicData] = useState([]);
  const [filters, setFilters] = useState({sortBy: {count:true}, filterBy:'', items:10})
  useEffect(()=>{
    fetch('http://localhost:3000/basicStats').then((resp)=>{
      return resp.json();
    }).then((data)=>{
      setRawBasicData(data);
    })
  },[])//onload fetch data
  useEffect(()=>{
    let sorted = rawBasicData.sort((a,b)=>{
      if(filters.sortBy.count){
        if(a.count > b.count) return -1;
        return 1;
      }else{
        return 0;
      }
    })
    let filtered = sorted.filter(o=>o?.title?.toLowerCase()?.includes(filters.filterBy.toLowerCase()))
    setFilters({...filters, items:10})
    setFilteredBasicData(filtered)
  }, [rawBasicData, filters.sortBy, filters.filterBy])

  return (
    <div style={{display:'flex'}}>
      <div style={{width:'50%', height:'100vh'}}>
        <div style={{ padding:'2rem', height:'90%'}}>
          <input
            style={{border: '#EF709D', borderWidth: '1px', borderStyle: 'solid', height: '1.5rem', paddingLeft: '1rem', borderRadius: '1rem'}}
            type="text"
            name="search"
            value={filters.filterBy}
            onChange={(event)=>{setFilters({...filters, filterBy:event.target.value})}}
          />
          <div style={{overflowY:'auto', height:'100%'}}>
            <InfiniteScroll
              pageStart={0}
              loadMore={()=>{setFilters({...filters, items:filters.items+10})}}
              hasMore={filters.items<filteredBasicData.length}
              loader={<></>}
              style={{display:'flex', flexWrap: 'wrap'}}
              useWindow={false}
            >
            {filteredBasicData.slice(0, filters.items).map(({title,messageSplit,count, id})=>
            <div
              style={{backgroundColor:'#9883E5', width:'10rem', margin:'1rem', padding:'1rem', color:'white', display:'flex', justifyContent:'space-between',  flexDirection:'column', cursor:'pointer'}}
              onClick={()=>{setMoreDataId(id)}}
            >
              <div>
                <h3>{title}</h3>

                <div style={{paddingTop:'1rem'}}>
                  <p>Total messages:</p>
                  <h2 style={{fontWeight:'100', padding:'1rem', textAlign:'center'}}>{count}</h2>
                </div>
              </div>
              <GenerateMessageSplitVisual messageSplit={messageSplit} count={count}/>
            </div>)}
            </InfiniteScroll>
          </div>
        </div>
        <div style={{textAlign:'center'}}>Made with ❤️ by <a href='www.lucolsthoorn.com'>Luc Olsthoorn</a></div>
      </div>
    {!!moreDataId?(<MoreDataElement id={moreDataId} close={()=>{setMoreDataId(false)}}/>):(<></>)}
    </div>

  );
}

const GenerateMessageSplitVisual = ({messageSplit, count}) =>{
  const [open, setOpen] = useState(false);
  let width = 6;
  let divider = count/width;
  return(
    <div style={{height: open?('100%'):('5rem'), overflowY:'auto'}}>
      {Object.keys(messageSplit).sort((a,b)=>{if(messageSplit[a] > messageSplit[b]){return -1} return 1}).map(o=>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', margin:'.25rem'}}>
          <div style={{width:`${messageSplit[o]/divider}rem`, backgroundColor:'#50C9CE', height:'1.25rem'}} >
          </div>
          <div style={{fontSize:'.75rem'}}>{o}</div>
        </div>
      )}
    </div>
  )
}
//participants:
//title:
//group:
//count:
//messageSplit
