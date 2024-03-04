import React, { useState, useEffect } from 'react';
import SessionBox from '../components/SessionBox';
import orderBySiteList from '../functions/orderBySiteList';
import orderByConsommationList from '../functions/orderByConsommationList';
import orderByPriceList from '../functions/orderByPrice';
import orderByDifferenceList from '../functions/orderByDifferenceList';
import orderByDateList from '../functions/orderByDateList';
import { Link } from 'react-router-dom';
import { Scatter } from 'react-chartjs-2';

const FileViewer = () => {
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [sessionDiv, setSessionDiv] = useState([]);
  const setListDiv = (bufferNewList) => {
    var sessionBufferDiv = [];
    bufferNewList.forEach(
      element =>
      sessionBufferDiv.push(<SessionBox
        site={element.site}
        date={element.date}
        consommation={element.consommation}
        price={element.price}
        computePrice={element.computePrice.toFixed(2)}
        difference={element.difference.toFixed(2)} 
      />));
    setSessionDiv(sessionBufferDiv);
  }
  const [dataForChart, setDataForChart] = useState(null);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        var buffer = event.target.result.split('\n');
        buffer.shift();
        var final = [];
        buffer.forEach(element => {
            if (!element) return;
            var splited = element.split(',');
            if (!splited[1] || !splited[12] || !splited[19] || !splited) return;

            var computePrice = Number(splited[16]).toFixed(2) * 0.55;
            var difference = Number(splited[19]).toFixed(2) - computePrice;

            final.push({
                site: splited[1].replace("\"", "").replace("\"", ""),
                date:splited[12].replace("\"", "").replace("\"", ""),
                timestamp: Date.parse(splited[12].replace("\"", "").replace("\"", "")),
                consommation: Number(splited[16]),
                price: Number(splited[19]),
                computePrice: computePrice,
                difference: difference
            });
        });
        setFileContent(final);
        var sessionBufferDiv = [];
        setListDiv(final);
      };
      reader.readAsText(selectedFile);
    }
  }, [selectedFile]);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const orderBySite = () => {
    var bufferNewList = orderBySiteList(fileContent);
    setListDiv(bufferNewList);
  };
  const orderBySiteRevert = () => {
    var bufferNewList = orderBySiteList(fileContent);
    bufferNewList.reverse();
    setListDiv(bufferNewList);
  };
  const orderByConsommation = () => {
    var bufferNewList = orderByConsommationList(fileContent);
    setListDiv(bufferNewList);
  };
  const orderByConsommationRevert = () => {
    var bufferNewList = orderByConsommationList(fileContent);
    bufferNewList.reverse();
    setListDiv(bufferNewList);
  };
  const orderByPrice = () => {
    var bufferNewList = orderByPriceList(fileContent);
    setListDiv(bufferNewList);
  }
  const orderByPriceRevert = () => {
    var bufferNewList = orderByPriceList(fileContent);
    bufferNewList.reverse();
    setListDiv(bufferNewList);
  }
  const orderByDifference = () => {
    var bufferNewList = orderByDifferenceList(fileContent);
    setListDiv(bufferNewList);
  }
  const orderByDifferenceRevert = () => {
    var bufferNewList = orderByDifferenceList(fileContent);
    bufferNewList.reverse();
    setListDiv(bufferNewList);
  }
  const orderByDate = () => {
    var bufferNewList = orderByDateList(fileContent);
    setListDiv(bufferNewList);
  }
  const orderByDateRevert = () => {
    var bufferNewList = orderByDateList(fileContent);
    bufferNewList.reverse();
    setListDiv(bufferNewList);
  }
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <table className="header_table" style={styles.header_table}>
        <tr>
          <td width="40%">
            site
            <button className="btn" style={styles.btn} onClick={orderBySite}>˄</button>
            <button className="btn" style={styles.btn} onClick={orderBySiteRevert}>˅</button>
          </td>
          <td width="16%">
            date
            <button className="btn" style={styles.btn} onClick={orderByDate}>˄</button>
            <button className="btn" style={styles.btn} onClick={orderByDateRevert}>˅</button>
          </td>
          <td width="12%">
            consommation en kWh
            <button className="btn" style={styles.btn} onClick={orderByConsommation}>˄</button>
            <button className="btn" style={styles.btn} onClick={orderByConsommationRevert}>˅</button>
          </td>
          <td width="10%">
            prix en €
            <button className="btn" style={styles.btn} onClick={orderByPrice}>˄</button>
            <button className="btn" style={styles.btn} onClick={orderByPriceRevert}>˅</button>
          </td>
          <td width="10%">prix théorique en €</td>
          <td width="10%">
            différence en €
            <button className="btn" style={styles.btn} onClick={orderByDifference}>˄</button>
            <button className="btn" style={styles.btn} onClick={orderByDifferenceRevert}>˅</button>
          </td>
          <td width="2%"></td>
        </tr>
      </table>
      {sessionDiv}

      {dataForChart && (
  <div>
    <Scatter
  data={{
    datasets: [{
      label: 'Différence de prix',
      data: dataForChart
        .filter(entry => !entry.site.startsWith('zz') && !entry.site.startsWith('za'))
        .map(entry => ({ x: entry.site, y: entry.difference })),
      backgroundColor: 'rgba(255, 99, 132, 0.6)', 
      borderColor: 'rgba(255, 99, 132, 1)', 
      borderWidth: 1,
      pointRadius: 2, 
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
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Site de recharge', 
        },
        beginAtZero: true,
      },
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
};

const styles = {
  header_table: {
    width: "77vw",
    padding: "0.25rem 1rem 0.25rem 1rem",
    margin: "1rem",
    backgroundColor: "#a1a1a1",
    textAlign: "center"
  }
}

export default FileViewer;
      

