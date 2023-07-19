import { useEffect, useState } from "react";
import { getNews } from "../api/busApi";
import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import Nav from "../component/Nav"
import Footer from "../component/Footer";
const { Panel } = Collapse;

export default function News(){
    const [newsData, setNewsData]=useState([]);

    async function getRecentNews(){
        setNewsData([]);
        const allNews = await getNews();
        console.log(allNews);
        setNewsData(allNews);
    }

    useEffect(()=>{
        getRecentNews();
        console.log(newsData);
    },[])

    return(
        <div className="flex flex-col justify-between h-screen">
            <Nav/>
            <div className="w-full h-full flex min-h-[70%]">
                <div className="w-full flex items-center justify-center minh overflow-y-scroll">
                    {
                    newsData.length>1?
                    <Collapse
                    bordered={false}
                    accordion={true}
                    // defaultActiveKey={['1']}
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    className="site-collapse-custom-collapse bg-light text-primary text-xl"
                    style={{width:'600px',height:'auto',marginTop:'20px'}}
                    >
                    {
                        newsData.map((item)=>{
                            return(
                            <Panel header={item.newsTitle} className="site-collapse-custom-panel">
                                {/* <p className="text-base text-bold">詳細：{item.newsDescription}</p> */}
                                <div className="text-base ml-6">{item.newsDepartment}</div>
                                <div className="flex justify-end text-base">發佈時間：{item.newsPublishTime.slice(0,10)}  {item.newsPublishTime.slice(11,19)}</div>
                                <div className="flex justify-end text-base">更新時間：{item.newsUpdateTime.slice(0,10)}   {item.newsUpdateTime.slice(11,19)}</div>
                            </Panel>
                            )
                        })
                        }
                    </Collapse>
                    :<div></div>
                    }
                </div>
            </div>
            <Footer/>
        </div>
    )
}