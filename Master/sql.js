const mysql = require('mysql2');

//-----------------------------------------------------------------------------------
//                                Initial Connections
//-----------------------------------------------------------------------------------

var readLuzon = mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: "20030",
    user: "master",
    password: "master",
    database: "Luzon"
});

var writeLuzon = mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: "20030",
    user: "master",
    password: "master",
    database: "Luzon"
});

var readVisMin = mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: "20030",
    user: "master",
    password: "master",
    database: "VisMin"
});

var writeVisMin = mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: "20030",
    user: "master",
    password: "master",
    database: "VisMin"
});

readLuzon.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Master Luzon database!");
});

writeLuzon.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Master Luzon database!");
});

readVisMin.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Master VisMin database!");
});

writeVisMin.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Master VisMin database!");
});

//-----------------------------------------------------------------------------------
//                            Master Crash and Recovery
//-----------------------------------------------------------------------------------

function masterCrash(readLuzon, writeLuzon, readVisMin, writeVisMin){

    readLuzon.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Master database!");
    });

    readLuzon = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20031",
        user: "slave1",
        password: "slave1",
        database: "Luzon"
    });
    
    readLuzon.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Slave Luzon Recovery database!");
    });

    writeLuzon.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Master database!");
    });

    writeLuzon = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20031",
        user: "slave1",
        password: "slave1",
        database: "Luzon"
    });
    
    writeLuzon.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Slave Luzon Recovery database!");
    });

    readVisMin.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Master database!");
    });

    readVisMin = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20032",
        user: "slave2",
        password: "slave2",
        database: "VisMin"
    });
    
    readVisMin.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Slave Vismin Recovery database!");
    });

    writeVisMin.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Master database!");
    });

    writeVisMin = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20032",
        user: "slave2",
        password: "slave2",
        database: "VisMin"
    });
    
    writeVisMin.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Slave Vismin Recovery database!");
    });

    module.exports.readLuzon = readLuzon;
    module.exports.writeLuzon = writeLuzon;
    module.exports.readVisMin = readVisMin;
    module.exports.writeVisMin = writeVisMin;
    
}

//Ayusin, Need to make it na it recovers for two kasi dalawang set of connections
async function masterRecover(readLuzon, writeLuzon, readVisMin, writeVisMin) {
    // Recover the values from VisMin.tempVisMin
    var tempDataVisMin = await getAllApps(2, readVisMin);
    console.log(tempDataVisMin);

    // Delete the values from TempVisMin
    var resultDelAllVisMin = await deleteAllApps(2, writeVisMin);
    if (resultDelAllVisMin && resultDelAllVisMin.affectedRows > 0) {
        console.log("Deleted values from TempVisMin");
    }

    // Recover the values from Luzon.tempLuzon
    var tempDataLuzon = await getAllApps(1, readLuzon);
    console.log(tempDataLuzon);

    // Delete the values from TempLuzon
    var resultDelAllLuzon = await deleteAllApps(1, writeLuzon);
    if (resultDelAllLuzon && resultDelAllLuzon.affectedRows > 0) {
        console.log("Deleted values from TempLuzon");
    }

    readLuzon.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Master database!");
    });

    writeLuzon.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Master database!");
    });

    readVisMin.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Master database!");
    });

    writeVisMin.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Master database!");
    });

    var readLuzon = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20030",
        user: "master",
        password: "master",
        database: "Luzon"
    });
    
    var writeLuzon = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20030",
        user: "master",
        password: "master",
        database: "Luzon"
    });
    
    var readVisMin = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20030",
        user: "master",
        password: "master",
        database: "VisMin"
    });
    
    var writeVisMin = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20030",
        user: "master",
        password: "master",
        database: "VisMin"
    });

    readLuzon.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Master Luzon database!");
    });
    
    writeLuzon.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Master Luzon database!");
    });
    
    readVisMin.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Master VisMin database!");
    });
    
    writeVisMin.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Master VisMin database!");
    });

    module.exports.readLuzon = readLuzon;
    module.exports.writeLuzon = writeLuzon;
    module.exports.readVisMin = readVisMin;
    module.exports.writeVisMin = writeVisMin;

    // Write VisMin data to Master VisMin database
    var updateVisMin = 0;
    var insertVisMin = 0;
    for (let i = 0; i < tempDataVisMin.length; i++) {
        var resultDel = await deleteApp(tempDataVisMin[i], writeVisMin);
        var resultIns = await insertApp(tempDataVisMin[i], writeVisMin);

        if (resultDel && resultDel.affectedRows > 0) {
            updateVisMin += 1;
        }

        if (resultIns && resultIns.affectedRows > 0) {
            insertVisMin += 1;
        }
    }

    // Write Luzon data to Master Luzon database
    var updateLuzon = 0;
    var insertLuzon = 0;
    for (let i = 0; i < tempDataLuzon.length; i++) {
        var resultDel = await deleteApp(tempDataLuzon[i], writeLuzon);
        var resultIns = await insertApp(tempDataLuzon[i], writeLuzon);

        if (resultDel && resultDel.affectedRows > 0) {
            updateLuzon += 1;
        }

        if (resultIns && resultIns.affectedRows > 0) {
            insertLuzon += 1;
        }
    }

    // Return the amount of success for both databases
    return {
        VisMin: { update: updateVisMin, insert: insertVisMin },
        Luzon: { update: updateLuzon, insert: insertLuzon }
    };
}



//-----------------------------------------------------------------------------------
//                            Slave1 Crash and Recovery
//-----------------------------------------------------------------------------------

function slave1Crash(writeLuzon){

    writeLuzon.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Slave database!");
    });

    writeLuzon = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20030",
        user: "master",
        password: "master",
        database: "tempDB"
    });

    writeLuzon.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Master Recovery database!");
    })

    module.exports.writeLuzon = writeLuzon;

}

async function slave1Recover(writeLuzon){

    try {
        // Recover the values from Master.tempDB.tempLuzon
        var tempData = await getAllApps(1, writeLuzon);
        console.log(tempData);
    
        // Delete the values
        var resultDelAll = await deleteAllApps(1, writeLuzon);
        if (resultDelAll && resultDelAll.affectedRows > 0) {
            console.log("Deleted values from TempLuzon");
        }
    
        // End the current write connection
        writeLuzon.end(function(err) {
            if (err) throw err;
            console.log("Disconnected from Master Recovery database!");
        });
    
        // Create a new write connection
        var writeLuzon = mysql.createConnection({
            host: "ccscloud.dlsu.edu.ph",
            port: "20030",
            user: "master",
            password: "master",
            database: "Luzon"
        });
    
        // Connect to the new write database
        writeLuzon.connect(function(err) {
            if (err) throw err;
            console.log("Connected to Master Luzon database!");
        });
    
        // Export read and write modules
        module.exports.writeLuzon = writeLuzon;
    
        var update = 0;
        var insert = 0;
    
        // Write data to the master
        for (let i = 0; i < tempData.length; i++) {
            var newData = {
                patientid: tempData[i].patientid,
                doctorid: tempData[i].doctorid,
                clinicid: tempData[i].clinicid,
                apptid: tempData[i].apptid,
                appstatus: tempData[i].appstatus,
                timequeued: tempData[i].timequeued,
                queuedate: tempData[i].queuedate,
                starttime: tempData[i].starttime,
                endtime: tempData[i].endtime,
                apptype: tempData[i].apptype,
                isvirtual: tempData[i].isvirtual,
                clinicregion: tempData[i].clinicregion
            };
    
            var resultDel = await deleteApp(newData, writeLuzon);
            var resultIns = await insertApp(newData, writeLuzon);
    
            if (resultDel && resultDel.affectedRows > 0) {
                update += 1;
                insert -= 1;
            }
    
            if (resultIns && resultIns.affectedRows > 0) {
                insert += 1;
            }
        }
    
        // Return the number of successful updates and inserts
        return { update: update, insert: insert };
    } catch (error) {
        // Handle any errors that occur within the try block
        console.error("An error occurred:", error);
        // You may want to add additional error handling or logging here
    }
}

//-----------------------------------------------------------------------------------
//                            Slave2 Crash and Recovery
//-----------------------------------------------------------------------------------

function slave2Crash(writeVisMin){

    writeVisMin.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Slave database!");
    });

    writeVisMin = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20030",
        user: "master",
        password: "master",
        database: "tempDB"
    });

    writeVisMin.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Master Recovery database!");
    })
    
    module.exports.writeVisMin = writeVisMin;

}

async function slave2Recover(writeVisMin){

    try {
        // Recover the values from Master.tempDB.tempVisMin
        var tempData = await getAllApps(2, writeVisMin);
        console.log(tempData);
    
        // Delete the values
        var resultDelAll = await deleteAllApps(2, writeVisMin);
        if (resultDelAll && resultDelAll.affectedRows > 0) {
            console.log("Deleted values from TempVisMin");
        }
    
        // End the current write connection
        writeVisMin.end(function(err) {
            if (err) throw err;
            console.log("Disconnected from Master Recovery database!");
        });
    
        // Create a new write connection
        var writeVisMin = mysql.createConnection({
            host: "ccscloud.dlsu.edu.ph",
            port: "20030",
            user: "master",
            password: "master",
            database: "VisMin"
        });
            
        // Connect to the new write database
        writeVisMin.connect(function(err) {
            if (err) throw err;
            console.log("Connected to Slave database!");
        });
    
        // Export read and write modules
        module.exports.writeVisMin = writeVisMin;
    
        var update = 0;
        var insert = 0;
    
        // Write data to the master
        for (let i = 0; i < tempData.length; i++) {
            var newData = {
                patientid: tempData[i].patientid,
                doctorid: tempData[i].doctorid,
                clinicid: tempData[i].clinicid,
                apptid: tempData[i].apptid,
                appstatus: tempData[i].appstatus,
                timequeued: tempData[i].timequeued,
                queuedate: tempData[i].queuedate,
                starttime: tempData[i].starttime,
                endtime: tempData[i].endtime,
                apptype: tempData[i].apptype,
                isvirtual: tempData[i].isvirtual,
                clinicregion: tempData[i].clinicregion
            };
    
            var resultDel = await deleteApp(newData, writeVisMin);
            var resultIns = await insertApp(newData, writeVisMin);
    
            if (resultDel && resultDel.affectedRows > 0) {
                update += 1;
                insert -= 1;
            }
    
            if (resultIns && resultIns.affectedRows > 0) {
                insert += 1;
            }
        }
    
        // Return the number of successful updates and inserts
        return { update: update, insert: insert };
    } catch (error) {
        // Handle any errors that occur within the try block
        console.error("An error occurred:", error);
        // You may want to add additional error handling or logging here
    }
}

//-----------------------------------------------------------------------------------
//                                  Helper Functions
//-----------------------------------------------------------------------------------

function getAllApps(option, sql) {
    if(option === 1){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM tempLuzon";
            sql.query(query, function (err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }); //sql.query
        }); //return promise
    }
    if(option === 2){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM tempVisMin";
            sql.query(query, function (err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }); //sql.query
        }); //return promise
    }
} //func

function deleteAllApps(option, sql) {
    if(option === 1){
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM tempLuzon";
            sql.query(query , function (err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }); //sql.query
        }); //return promise
    }
    if(option === 2){
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM tempVisMin";
            sql.query(query, function (err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }); //sql.query
        }); //return promise
    }
} //func

function insertApp(data, sql) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO appointments 
            (patientid, doctorid, clinicid, apptid, appstatus, timequeued, queuedate, starttime, endtime, apptype, isvirtual, clinicregion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        sql.query(
            query,
            [
                data.patientid,
                data.doctorid,
                data.clinicid,
                data.apptid,
                data.appstatus,
                data.timequeued,
                data.queuedate,
                data.starttime,
                data.endtime,
                data.apptype,
                data.isvirtual,
                data.clinicregion
            ],
            function (err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        ); //sql.query
    }); //return promise
} //func

function deleteApp(data, sql) {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM appointments
            WHERE apptid = ?`;

        sql.query(
            query,
            [
                data.apptid,
            ],
            function (err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        ); //sql.query
    }); //return promise
} //func

//-----------------------------------------------------------------------------------
//                                  Export Functions
//-----------------------------------------------------------------------------------

module.exports = {
    writeLuzon, readLuzon,
    writeVisMin, readVisMin,
    masterCrash,
    masterRecover,
    slave1Crash,
    slave1Recover,
    slave2Crash,
    slave2Recover
};