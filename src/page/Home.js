import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { getAllRoutes, getNews } from "../api/busApi";
import { setSearchName } from "../action";
import { StoreContext } from "../store";

import Nav from "../component/Nav";
import Footer from "../component/Footer";

import { Select, List, Typography } from "antd";

const { Title } = Typography;

export default function Home(){
    const [routeData,setRouteData] = useState([]);
    const [newsData,setNewsData] = useState([]);
    const { state: { searching }, dispatch } = useContext(StoreContext);
    const navigate = useNavigate();

    async function getRoutes(){
        let nameDatas = [];
        setRouteData([]);
        const allRoutes = await getAllRoutes();
        if(allRoutes){
            for(let i=0;i< allRoutes.length;i++){
              const nameData={
                value: allRoutes[i].routeName,
                label: allRoutes[i].routeName
              };
              nameDatas.push(nameData);
            }
            setRouteData(nameDatas);
          }
    }

    async function getRecentNews(){
        setNewsData([]);
        const allNews = await getNews();
        setNewsData(allNews);
    }

    const handleSearch = (value)=>{
        setSearchName(dispatch,value);
        navigate(`/bus/:${value}`)
    }


    useEffect(()=>{
        getRoutes();
        getRecentNews();
    },[])

    return(
        <div className="flex flex-col justify-between h-screen">
            <Nav/>
            <div className="w-full h-full flex">
                <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center">
                    <div className="mb-4 text-primary font-bold">
                        查詢路線/站牌
                    </div>
                    <Select
                        showSearch
                        placeholder="輸入公車路線/站牌"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        className="w-60 mb-12"
                        options={routeData}
                        onSelect={handleSearch}
                        />
                     <img src="./img/mascot.svg"></img>
                </div>
                <div className="w-full lg:w-1/2 flex items-center justify-center">
                    <div className="flex-column align-items-center mt-3">
                        <div className="flex w-full items-baseline justify-between border-b-2 border-primary mb-3">
                            <Title level={4}>最新公告</Title>
                            <Link to="./news" type="text" className="text-sm font-bold">
                                MORE+
                            </Link>
                        </div>
                        <List
                            dataSource={newsData}
                            style={{maxWidth:'480px'}}
                            className="px-4 py-3"
                            renderItem={(item) => (
                                <List.Item>
                                    <Link to={`./news`}
                                        className="font-bold hover:text-primary hover:cursor-pointer px-2"
                                        style={{maxWidth:'440px',whiteSpace:'nowrap',overflow:'hidden', textOverflow:'ellipsis'}}
                                    >{item.newsTitle}</Link>
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}