import axios from "axios"

const baseUrl = `https://ptx.transportdata.tw/MOTC`

const tdxUrl = `https://tdx.transportdata.tw/api/basic/v2`


export const getAllRoutes = async()=>{
    try{
        let data=[]
        let routeData = {}
        let url = `${tdxUrl}/Bus/Route/City/Taipei`
        let result = await axios.get(url,{
            headers:{
                'client_id' : "g111034018-57ed97e2-2180-4d7a",
                'client_secret':"0017be3a-0910-4835-b3c1-ab1793c3533f"
            }
        });
        if(result.data){
            for(let i=0;i<result.data.length;i++){
                routeData = {
                    routeName:result.data[i].RouteName.Zh_tw
                }
                data.push(routeData)
            }
        }
        return data;
    }catch(err){
        console.log('找不到路線')
    }
}

export const getBusGoStop = async(busName)=>{
    try{
        let goData=[]
        let getData = {}
        let url = `${baseUrl}/v2/Bus/DisplayStopOfRoute/City/Taipei/${busName}?%24filter=RouteName%2FZh_tw%20eq%20'${busName}'&%24format=JSON`;
        let result = await axios.get(url);
        const getTime = await getBusGoTime(busName);
        if(result.data){
            result.data[0].Stops.forEach((element)=>{
                for(let el of getTime){
                    if(el.busStop === element.StopName.Zh_tw){
                        getData = {
                            Stopname:element.StopName.Zh_tw,
                            BusTime:el.busTime,
                            BusStatus:el.status
                        }
                goData.push(getData);
                        return;
                    }
                }
            })
        }
        return goData;
    }catch(err){
        console.log('找不到公車去程站牌')
    }
}
export const getBusBackStop = async(busName)=>{
    try{
        let backData=[]
        let getData = {}
        let url = `${baseUrl}/v2/Bus/DisplayStopOfRoute/City/Taipei/${busName}?%24filter=RouteName%2FZh_tw%20eq%20'${busName}'&%24format=JSON`;
        let result = await axios.get(url);
        // let finalResult = [...result.data].reverse();
        console.log(result);
        const getTime = await getBusBackTime(busName);
        if(result.data){
            result.data[1].Stops.forEach((element)=>{
                for(let el of getTime){
                    if(el.busStop === element.StopName.Zh_tw){
                        getData = {
                            Stopname:element.StopName.Zh_tw,
                            BusTime:el.busTime,
                            BusStatus:el.status
                        }
                        backData.push(getData);
                        return;
                    }
                }
            })
        }
        return backData;
    }catch(err){
        console.log('找不到公車回程站牌')
    }
}
// go route time
async function getBusGoTime(busName){
    try{
        let url=`${baseUrl}/v2/Bus/EstimatedTimeOfArrival/City/Taipei/${busName}?%24filter=RouteName%2FZh_tw%20eq%20'${busName}'%20and%20direction%20eq%200&%24format=JSON`;
        let result = await axios.get(url);
        let data=[]
        let allData=[]
        let turnToMin
        let busTimeStatus
        if(result.data){
            result.data.forEach((element)=>{
                // time = Math.round(element.EstimateTime/60);
                // if(Math.round(element.EstimateTime/60)){

                // }
                turnToMin = Math.round(element.EstimateTime/60)
                if(turnToMin < '2' || turnToMin ==='2'){
                    turnToMin = '進站中';
                    busTimeStatus = '1';
                }else if (turnToMin > '2'){
                    turnToMin = turnToMin+'分鐘';
                    busTimeStatus = '0';
                }else{
                    turnToMin = '未發車';
                    busTimeStatus = '0';
                }
                data = {
                    busStop:element.StopName.Zh_tw,
                    busTime:turnToMin,
                    status:busTimeStatus
                }
                allData.push(data);
            })
        }
        return(allData)
    }catch(err){
        console.log('找不到去程的公車時間資訊');
    }
}

// go route time
async function getBusBackTime(busName){
    try{
        let url=`${baseUrl}/v2/Bus/EstimatedTimeOfArrival/City/Taipei/${busName}?%24filter=RouteName%2FZh_tw%20eq%20'${busName}'%20and%20direction%20eq%201&%24format=JSON`;
        let result = await axios.get(url);
        let data=[]
        let allData=[]
        let finalData = []
        let turnToMin
        let busTimeStatus
        if(result.data){
            result.data.forEach((element)=>{
                // time = Math.round(element.EstimateTime/60);
                // if(Math.round(element.EstimateTime/60)){

                // }
                turnToMin = Math.round(element.EstimateTime/60)
                if(turnToMin < '2' || turnToMin ==='2'){
                    turnToMin = '進站中';
                    busTimeStatus = '1';
                }else if (turnToMin > '2'){
                    turnToMin = turnToMin+'分鐘';
                    busTimeStatus = '0';
                }else{
                    turnToMin = '未發車';
                    busTimeStatus = '0';
                }
                data = {
                    busStop:element.StopName.Zh_tw,
                    busTime:turnToMin,
                    status:busTimeStatus
                }
                allData.push(data);
            })
        }
        finalData = [...allData].reverse();
        return(finalData)
    }catch(err){
        console.log('找不到回程的公車時間資訊');
    }
}




//bus news
export const getNews = async()=>{
    try{
        let url=`${baseUrl}/v2/Bus/News/City/Taipei?%24format=JSON`;
        let result = await axios.get(url);
        let allData=[]
        let getData=[]
        if(result.data){
            result.data.forEach((element)=>{
                getData={
                    newsId:element.NewsID,
                    newsDepartment:element.Department,
                    newsTitle:element.Title,
                    newsDescription:element.Description,
                    newsPublishTime:element.PublishTime,
                    newsUpdateTime:element.UpdateTime
                }
                allData.push(getData);
            })
        }
        return allData;
    }catch(err){
        console.log('找不到最新消息');
    }
}