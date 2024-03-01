import React from "react";


function SessionBox({site, date, consommation, price, computePrice, difference})
{
    return (
        <div className="session_box" style={styles.session_box}>
            <table className="table_session" style={styles.table_session}>
                <tr>
                    <td width="40%">{site}</td>
                    <td width="16%">{date}</td>
                    <td width="12%">{consommation} kWh</td>
                    <td width="10%">{price}€</td>
                    <td width="10%">{computePrice}€</td>
                    <td width="10%">{difference}€</td>
                    <td width="2%">
                        {difference > 0 && 
                            <>
                                <div class={'green'} style={styles.green} >+</div>
                            </>
                        }
                        {difference < 0 && 
                            <>
                                <div class={'red'} style={styles.red}>-</div>
                            </>
                        }
                        {difference == 0 && 
                            <>
                                <div class={'blue'} style={styles.blue}>=</div>
                            </>
                        }
                    </td>
                </tr>
            </table>

        </div>
        );
    }
    
const styles = {
    session_box: {
        width: "75vw",
        padding: "1rem",
        margin: "1rem",
        border: "solid #a1a1a1 1px",
        backgroundColor: "#f1f1f1",
        display: "flex",
        alignItem: "center",
        textAlign: "center"
    },
    green: {
        backgroundColor: '#55ff76'
    },
    blue: {
        backgroundColor: '#54b1ff'
    },
    red: {
        backgroundColor: '#ff5733'
    },

    table_session: {
        width: "100%"
    }
};
    
    export default SessionBox;