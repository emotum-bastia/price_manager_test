import { collection, getDocs, addDoc } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { Line } from 'react-chartjs-2';

import { db } from "../functions/dbConnection";
import readFile from "../functions/readFile";
import logo from "./../assets/logo_e.png"

import orderBySiteList from '../functions/orderBySiteList';
import orderByConsommationList from '../functions/orderByConsommationList';
import orderByPriceList from '../functions/orderByPrice';
import orderByDifferenceList from '../functions/orderByDifferenceList';
import orderByDateList from '../functions/orderByDateList';
import SessionBox from "../components/SessionBox";
import compareString from "../functions/compareString";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";


function Load() {
    const [fileContent, setFileContent] = useState(null); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState("");

    const [collectionList, setCollectionList] = useState([]);
    const [collectionName, setCollectionName] = useState("");
    const [collectionContentList, setCollectionContentList] = useState([]);

    const [sessionDiv, setSessionDiv] = useState([]);
    const [listSite, setListSite] = useState([]);
    const [listSiteBtn, setListSiteBtn] = useState([]);

    const [dataForChart, setDataForChart] = useState(null);

    const [value, setValue] = useState(0.55);

    var listSiteBufferDirect = [];
    var tarif = 0.75;


    var connection = false;


    function setListDiv(bufferNewList) {
        var sessionBufferDiv = [];


        bufferNewList.forEach(
            function (element) {
            var place = listSiteBufferDirect.find(function (cursor) { return cursor.name == element.site});
            console.log("list site :" + JSON.stringify(listSiteBufferDirect));
            if (place) { 
                if (place.hide) return;
            }
            else {
                var place = listSite.find(function (cursor) { return cursor.name == element.site});
                console.log("list site :" + JSON.stringify(listSite));
                listSiteBufferDirect = listSite;
                if (place) { 
                    if (place.hide) return;
                }
            }
            // console.log(place.name + "->" + place.hide);
            var computePrice = element.consommation * tarif;
            var difference = element.price - computePrice;
            sessionBufferDiv.push(<SessionBox
                site={element.site}
                date={element.date}
                consommation={element.consommation}
                price={element.price}
                computePrice={computePrice.toFixed(2)}
                difference={difference.toFixed(2)} 
            />)
        });
        setSessionDiv(sessionBufferDiv);
    }

    function changeHideSite(range, listGot, fileContentGot) {
        var bufferSiteList = [];

        for (var i = 0; i < listGot.length; i++) {
            bufferSiteList.push({
                name: listGot[i].name,
                hide: i != range ? listGot[i].hide : !listGot[i].hide
            })
        }
        bufferSiteList.sort(function(first, second) {
            return compareString(first.name, second.name);
        });
        setListSiteBtnDiv(bufferSiteList, fileContentGot);
        console.log('filecontent got =' + fileContentGot);
        setListSite(bufferSiteList);
        listSiteBufferDirect = bufferSiteList;
        setListDiv(fileContentGot);
    }

    function setListSiteBtnDiv(bufferSiteList, siteList) {
        var bufferListBtn = [];
        var range = 0;
        bufferSiteList.forEach(function () {
          var i = range;
          bufferListBtn.push(
            <div class="check_list" style={styles.check_list}>
              <input
                type="checkbox"
                id={bufferSiteList[range].name}
                names={bufferSiteList[range].name}
                checked={!bufferSiteList[range].hide}
                onClick={() => changeHideSite(i, bufferSiteList, siteList)}
              />
              <label for={bufferSiteList[range].name}>{bufferSiteList[range].name}</label>
            </div>);
            range++;
        });
        setListSiteBtn(bufferListBtn);
        
    }

    useEffect(() => {
        if ((!collectionList || collectionList.length < 1) && !connection) getCollectionList();
        if ((!collectionContentList || collectionContentList.length < 1) && !connection) getCollectionContentList();
        if (!connection) connection = true;
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                var result = readFile(event.target.result, tarif);
                console.log("result:" + JSON.stringify(result));
                if (result) {
                    setFileContent(result);
                    getCollectionList();
                    getCollectionContentList();
                    setAllListData(result);
                }
                else setFileContent(null);
            }
            reader.readAsText(selectedFile);
            setSelectedFile(null);
        }
        if (collectionContentList.length > 0 && !fileContent) {
            setAllListData(collectionContentList);
            setFileContent(collectionContentList);
            if (!fileContent) setFileContent(collectionContentList);
        }
    }, [collectionName, selectedFile, collectionContentList, fileContent])

    function setAllListData(sessionList) {
        var bufferSiteList = [];

        console.log("Session list:" + JSON.stringify(sessionList));
        sessionList.forEach(function (element) {
            if (bufferSiteList.findIndex((cursor) => cursor.name == element.site) < 0)
                bufferSiteList.push({name: element.site, hide: false});
        });
        bufferSiteList.sort(function(first, second) {
            return compareString(first.name, second.name);
        });

        setListSiteBtnDiv(bufferSiteList, sessionList);
        console.log('buffer site list:' + JSON.stringify(bufferSiteList));
        setListSite(bufferSiteList);
        listSiteBufferDirect = bufferSiteList;
        setListDiv(sessionList);
        setDataForChart(sessionList);
    }

    async function getCollectionList() {
        try {
            const data = await getDocs(collection(db,"collections"));
            const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
            setCollectionList(filteredData);
        }
        catch (err) {
            console.error(err);
        }
    }
    async function getCollectionContentList() {
        if (collectionName.length < 1) return
        try {
            const data = await getDocs(collection(db, collectionName));
            const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
            setCollectionContentList(filteredData);
        }
        catch (err) {
            console.error(err);
        }
    }

    async function createCollection() {
        if (!fileContent || fileContent == []) {
            alert("fichier invalide, veuillez selectionner un fichier valide pour l'ajouter");
            console.erro("empty file");
            return;
        }
        try {
            console.log("title:" + title);
            const result = await collection(db ,"new-session:" + title);
            fileContent.forEach(function (line) {
                addDoc(result, {
                    consommation: line.consommation,
                    price: line.price,
                    site: line.site,
                    timestamp: line.timestamp,
                    date: line.date
                });
            });
            console.log("result:" + JSON.stringify(result));
            
            const data = await collection(db, "collections");
            addDoc(data, {name: "new-session:" + title});
            getCollectionList();
        }
        catch (err) {
            console.error(err);
        }
    }

    
    function changeAll(enable) {
        var listGot = listSite;
        var fileContentGot = fileContent;
        var bufferSiteList = [];

        for (var i = 0; i < listGot.length; i++) {
            bufferSiteList.push({
                name: listGot[i].name,
                hide: enable
            })
        }
        bufferSiteList.sort(function(first, second) {
            return compareString(first.name, second.name);
        });
        setListSiteBtnDiv(bufferSiteList, fileContentGot);
        console.log('filecontent got =' + fileContentGot);
        setListSite(bufferSiteList);
        listSiteBufferDirect = bufferSiteList;
        setListDiv(fileContentGot);
    }

    function orderBySite() {
        var bufferNewList = orderBySiteList(fileContent, listSite);
        setListDiv(bufferNewList);
    };
    
    function orderBySiteRevert() {
        var bufferNewList = orderBySiteList(fileContent, listSite);
        bufferNewList.reverse();
        setListDiv(bufferNewList);
    };

    function orderByConsommation() {
        var bufferNewList = orderByConsommationList(fileContent);
        setListDiv(bufferNewList);
    };
    function orderByConsommationRevert() {
        var bufferNewList = orderByConsommationList(fileContent);
        bufferNewList.reverse();
        setListDiv(bufferNewList);
    };

    function orderByPrice() {
        var bufferNewList = orderByPriceList(fileContent);
        setListDiv(bufferNewList);
    }

    function orderByPriceRevert() {
        var bufferNewList = orderByPriceList(fileContent);
        bufferNewList.reverse();
        setListDiv(bufferNewList);
    }

    function orderByDifference() {
        var bufferNewList = orderByDifferenceList(fileContent, tarif);
        setListDiv(bufferNewList);
    }

    function orderByDifferenceRevert() {
        var bufferNewList = orderByDifferenceList(fileContent, tarif);
        bufferNewList.reverse();
        setListDiv(bufferNewList);
    }

    function orderByDate() {
        var bufferNewList = orderByDateList(fileContent);
        setListDiv(bufferNewList);
    }

    function orderByDateRevert() {
        var bufferNewList = orderByDateList(fileContent);
        bufferNewList.reverse();
        setListDiv(bufferNewList);
    }


    return(
        <div>
            <h1>Load page</h1>
            <img src={logo} id="start" alt='logo_e_emotum' className={'App-logo'} style={{
                margin: "20px", backgroundColor: "white", borderRadius: "50%"
            }}/>
            <div className="selection-section">
                {collectionList.map((collection) =>
                    <div>
                        <button className="btn-session btn" onClick={() => {
                            setFileContent(null);
                            setCollectionName(collection.name);
                            getCollectionContentList();
                        }}>
                            {collection.name}
                        </button>
                    </div>
                )}
            </div>

            <div className="add-section">
                <input
                    className="input-titre"
                    placeholder="titre de la session"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <input className="input-file btn" type="file" onChange={(event) => {
                    const file = event.target.files[0];
                    console.log("file = " + JSON.stringify(file));
                    setSelectedFile(file);
                }}/>
                <button className="btn-create btn" onClick={createCollection}>create collection</button>
            </div>

            <div>
            </div>


            <a href='#chart' className="btn-chart" >voir graph</a>
            <table className="header_table" style={styles.header_table}>
                <tr>
                <td width="40%">
                    <div className='category'>
                    <div className='title_category'>
                        site
                    </div>
                    <div className='order' style={styles.order}>
                        <button className="btn btn-up" style={styles.btn} onClick={orderBySite}>˄</button>
                        <button className="btn btn-down" style={styles.btn} onClick={orderBySiteRevert}>˅</button>
                    </div>
                    <Popup trigger={<button className="btn btn-place"> choisir site</button>} arrow={false} position="bottom">
                        <div className='popup' style={styles.popup}>
                        <button class="btn" onClick={() => changeAll(false)}>toute activer</button>
                        <button class="btn" onClick={() => changeAll(true)}>toute désactiver</button>
                        {listSiteBtn}
                        </div>
                    </Popup>
                    </div>
                </td>
                <td width="12%">
                    <div className='category'>
                    <div className='title_category'>
                        date
                    </div>
                    <div className='order' style={styles.order}>
                        <button className="btn btn-up" style={styles.btn} onClick={orderByDate}>˄</button>
                        <button className="btn btn-down" style={styles.btn} onClick={orderByDateRevert}>˅</button>
                    </div>
                    </div>
                </td>
                <td width="16%">
                    <div className='category'>
                    <div className='title_category'>
                        consommation en kWh
                    </div>
                    <div className='order' style={styles.order}>
                        <button className="btn btn-up" style={styles.btn} onClick={orderByConsommation}>˄</button>
                        <button className="btn btn-down" style={styles.btn} onClick={orderByConsommationRevert}>˅</button>
                    </div>
                    </div>
                </td>
                <td width="10%">
                    <div className='category'>
                    <div className='title_category'>
                    prix en €
                    </div>
                    <div className="order" style={styles.order}>
                        <button className="btn btn-up" style={styles.btn} onClick={orderByPrice}>˄</button>
                        <button className="btn btn-down" style={styles.btn} onClick={orderByPriceRevert}>˅</button>
                    </div>
                    </div>
                </td>
                <td width="10%">prix théorique en €</td>
                <td width="10%">
                    <div className='category'>
                    <div className='title_category'>
                        différence en €
                    </div>
                    <div className='order' style={styles.order}>
                        <button className="btn btn-up" style={styles.btn} onClick={orderByDifference}>˄</button>
                        <button className="btn btn-down" style={styles.btn} onClick={orderByDifferenceRevert}>˅</button>
                    </div>
                    </div>
                </td>
                <td width="2%"></td>
                </tr>
            </table>

            {sessionDiv}

            {dataForChart && (
                <div id="chart" >
                    <a href='#start' className="btn-chart" >haut de page</a>
                    <Popup trigger={<button className="btn btn-place"> choisir site</button>} arrow={false} position="bottom">
                    <div className='popup' style={styles.popup}>
                        <button class="btn" onClick={() => changeAll(false)}>toute activer</button>
                        <button class="btn" onClick={() => changeAll(true)}>toute désactiver</button>
                        {listSiteBtn}
                    </div>
                    </Popup>
                    <Line
                    data={{
                        labels: dataForChart.map(entry => !listSite.find(function (cursor) { return cursor.name == entry.site}).hide ? entry.site : null),
                        datasets: [{
                        label: 'Différence de prix',
                        data: dataForChart.map(entry => entry.difference),
                        fill: false,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        tension: 0.1 // Cela ajoute une légère courbure aux lignes, mettre à 0 pour des lignes droites
                        }]
                    }}
                    options={{
                        plugins: {
                        title: {
                            display: true,
                            text: 'Différences de prix par site de recharge',
                        },
                        legend: {
                            display: true,
                            position: 'bottom',
                        },
                        },
                        scales: {
                        y: {
                            title: {
                            display: true,
                            text: 'Différence de prix (€)',
                            },
                            beginAtZero: true,
                        },
                        },
                    }}
                    />
                </div>
            )}
        </div>
    );
}



const styles = {
    header_table: {
        width: "80vw",
        padding: "0.25rem 5rem 0.25rem 1rem",
        margin: "1rem",
        backgroundColor: "white",
        textAlign: "center",
        verticalAlign: "middle"
    },
    
    popup: {
        backgroundColor: "#00000070",
        height: "50vh",
        width: "25vw",
        padding: "1rem",
        overflowY: "scroll"
    },
    check_list: {
        backgroundColor: "white",
        padding: "0.5rem",
        margin: "0.25rem"
    },
    order: {
        display: "flex",
        flexDirection: "column"
    }
}

export default Load;