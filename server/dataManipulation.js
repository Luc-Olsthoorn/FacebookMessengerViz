const  { readdirSync, readFileSync} = require('fs')
const filesPath = './inputData/messages/inbox';

const getListOfChatNames = () =>{
  const messageNames = readdirSync(filesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  return messageNames;
}
const getMessagesData = (path) =>{
  const fileNames = readdirSync(path).filter(o => o.endsWith('.json')).filter(o=>o.startsWith('message'));
  let jsons = fileNames.map(o=>{
    try{
      return JSON.parse(readFileSync(`${path}/${o}`));
    }catch(err){
      return {}
    }
  })
  let data={
    participants:jsons[0]?.participants||[], //get the zeroeth or fault if there is none
    title: jsons[0]?.title||'',
    group: jsons[0]?.thread_type==='RegularGroup'?(true):(false) || false,
    messages: [...jsons.map(o=>o.messages).flat()]
  }
  return data;
}
const getBasicStats = (id) => {
  let path = `${filesPath}/${id}`;
  let data = getMessagesData(path);
  //calculate messageSplit

  let messageSplit = {};
  data.messages.forEach(o=>{messageSplit[o.sender_name]=messageSplit[o.sender_name]+1|| 1})
  let output = { //may want to remove messages for speed
    ...data,
    count: data.messages.length,
    messageSplit,
    id
  }
  delete output.messages;
  return output;
}
const getAllBasicStats = () =>{
  const ids = getListOfChatNames();
  return ids.map((id)=>{
    return getBasicStats(id);
  })
}
const getAdvancedStats = (id) =>{
  const {messages} = getMessagesData(`${filesPath}/${id}`);
  return {
    messages,
    ...getBasicStats(id)
  }
}
module.exports = {
  getAllBasicStats,
  getAdvancedStats,
}
