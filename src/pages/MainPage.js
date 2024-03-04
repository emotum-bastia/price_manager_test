import React, { useState, useEffect } from 'react';
import SessionBox from '../components/SessionBox';
import { Link } from 'react-router-dom';
import { Scatter } from 'react-chartjs-2';

const FileViewer = () => {
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [sessionDiv, setSessionDiv] = useState([]);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        var buffer = event.target.result.split('\n');
        buffer.shift();
        var final = [];
        buffer.forEach(element => {
            console.log("element:" + element);
            var splited = element.split(',');
            var computePrice = Number(splited[16]).toFixed(2) * 0.55;
            var difference = Number(splited[19]).toFixed(2) - computePrice;

            final.push({
                site: splited[1].replace("\"", "").replace("\"", ""),
                date:splited[12].replace("\"", "").replace("\"", ""),
                consommation: Number(splited[16]),
                price: Number(splited[19]),
                computePrice: computePrice,
                difference: difference
            });
        });
        setFileContent(JSON.stringify(final));
        var sessionBufferDiv = [];

        final.forEach(
          element =>
          sessionBufferDiv.push(<SessionBox
            site={element.site}
            date={element.date}
            consommation={element.consommation}
            price={element.price}
            computePrice={element.computePrice.toFixed(2)}
            difference={element.difference.toFixed(2)} 
          />)
        );
        setSessionDiv(sessionBufferDiv);
      };

      reader.readAsText(selectedFile);
    }
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      <table className="header_table" style={styles.header_table}>
        <tr>
          <td width="40%">site</td>
          <td width="16%">date</td>
          <td width="12%">consommation en kWh</td>
          <td width="10%">prix en €</td>
          <td width="10%">prix théorique en €</td>
          <td width="10%">différence en €</td>
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
      

