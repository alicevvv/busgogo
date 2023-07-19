import { useEffect, useState, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { getAllRoutes, getBusGoStop, getBusBackStop } from "../api/busApi";
import { setSearchName } from "../action";
import { StoreContext } from "../store";
import Nav from "../component/Nav"
import Footer from "../component/Footer";
import { Select, Row, Col, Radio, Space, Divider, Modal, Button, Spin } from "antd"
import { QuestionCircleOutlined,LoadingOutlined} from "@ant-design/icons";
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function Path(){
    const [routeData, setRouteData] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const {state:{searching}, dispatch} = useContext(StoreContext);
    const [busName,setBusName]=useState([]);
    const [direction,setdirection] = useState('go');
    const [nowDatas, setNowDatas]=useState([]);
    const [startStop,setStartStop] = useState('');
    const [lastStop,setLastStop] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const navigate = useNavigate()
    const location = useLocation();

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

    async function getBusGotoStops(value){
        const allBusGoStops = await getBusGoStop(value);
        setNowDatas(allBusGoStops);
        setStartStop(allBusGoStops[0].Stopname);
        setLastStop(allBusGoStops[allBusGoStops.length - 1].Stopname);
    }
    async function getBusBackStops(value){
      const allBusBackstop = await getBusBackStop(value);
      setNowDatas(allBusBackstop);
    }

    const backRoute = e =>{
        // setGoBusDatas(BackBusDatas);
        console.log(e.target.value);
        if(e.target.value === "go"){
          // setNowDatas(GoBusDatas);
          getBusGotoStops(busName);
          setdirection('go');
        }else if (e.target.value==="back"){
          getBusBackStops(busName);
          setdirection('back');
        }
    }

    const selectSearch = (value) =>{
        setIsLoading(true);
        setTimeout(()=>{
          setIsLoading(false);
        },2000);
        setBusName(value)
        getBusGotoStops(value);
        setdirection('go');
    
        setSearchName(dispatch,value)
        navigate(`/bus/:${value}`)
    }

    const showModal = () => {
        setIsModalVisible(true);
      };
    const handleOk = () => {
    setIsModalVisible(false);
    };
    const handleCancel = () => {
    setIsModalVisible(false);
    };

    useEffect(()=>{
        if(location.pathname.split(':')[1]==''){
            navigate('/')
        }
        getRoutes();
        setBusName(decodeURI(location.pathname.split(':')[1]));
        getBusGotoStops(decodeURI(location.pathname.split(':')[1]));

        console.log(decodeURI(location.pathname.split(':')[1]));
        setTimeout(()=>{
        setIsLoading(false);
        },2000);
    },[])

    return(
        <div className="flex flex-col justify-between h-screen">
            <Nav/>
            <div className="w-full h-full flex">
                <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center">
                    <Select
                        showSearch
                        placeholder="輸入公車路線/站牌"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        style={{ width: "249px", fontSize: 16, marginBottom:'36px'}}
                        options={routeData}
                        onSelect={selectSearch}
                        >
                    </Select>
                    <div className="mt-3">
                        <img src="../img/bus_m.svg" alt="bus"></img>
                    </div>
                    <div className="mt-3">公車擁擠度：普通</div>
                    <div className="mt-5 mb-4">
                        <img src="../img/bus_degree.svg" alt="degree"></img>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center">
                    <div className="w-3/5 flex justify-between items-center mt-4">
                        <span className="flex items-center" style={{ fontSize: "24px" }}>
                            <span className="mt-4">{busName}路線{" "}</span>
                            <Button className="btn-businfo" onClick={showModal}>
                                {<QuestionCircleOutlined />}
                            </Button>
                        </span>
                        <Modal
                            title=""
                            onOk={handleOk}
                            onCancel={handleCancel}
                            style={{ borderRadius: "20px" }}
                            footer={false}
                            visible={isModalVisible}
                            >
                            <div style={{padding:'20px'}}>
                                <p className="yellow-rec">起迄站名 : </p>
                                <p>{startStop} - {lastStop}</p>
                                <Divider/>
                                <p>業者服務電話 : 臺北客運 0800-003-307</p>
                                <p>新北市政府交通局公車申訴服務電話 : 02-89682460</p>
                            </div>
                        </Modal>
                        <Radio.Group name="directionRadioGroup" value={direction} onChange={backRoute}>
                            <Space direction="vertical">
                                <Radio value={'go'} defaultChecked={true}>去程</Radio> 
                                <Radio value={'back'}>回程</Radio>
                            </Space>
                        </Radio.Group>
                    </div>
                    <div className="w-3/5 mb-4 mt-12 flex justify-center items-start h-full overflow-y-scroll">
                        { isLoading ===true?
                            <Spin indicator={loadingIcon} />
                            :
                            <>
                            {
                                nowDatas?
                                <div className="flex-column" style={{ width: "100%" }}>
                                <Row>
                                    <Col span={6}>
                                    {nowDatas.map((item) => {
                                        if(item.BusStatus === 1){
                                        return <div className="bg-yellow bustimeBadge">{item.BusTime}</div>;
                                        }else{
                                        return <div className="bg-primary bustimeBadge">{item.BusTime}</div>;
                                        }
                                    })}
                                    </Col>
                                    <Col span={10}>
                                    {nowDatas.map((item) => {
                                    return <div className="busstation">
                                        {item.Stopname}</div>
                                    })}
                                    </Col>
                                    <Col span={2}>
                                    {
                                    nowDatas.map(()=>{
                                        return <div className="radioWrapper">
                                        <div className="busCircle"></div>
                                        </div>
                                    })
                                    }
                                    </Col>
                                    <Col span={1}></Col>
                                    <Col span={5}></Col>
                                    <Col span={1}></Col>
                                </Row>
                            </div>:<></>
                            }</>
                        }
                    </div>

                </div>
            </div>
            <Footer/>
        </div>
    )
}