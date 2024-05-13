const mysql = require('mysql2');

var write = mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: "20030",
    user: "master",
    password: "master",
    database: "Luzon"
});

var read = mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: "20031",
    user: "slave1",
    password: "slave1",
    database: "Luzon"
});

write.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Master database!: Master Luzon");
});

read.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Slave database!: Slave Luzon");
})

function masterCrash(write){

    write.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Master database!: Master Luzon");
    });

    write = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20031",
        user: "slave1",
        password: "slave1",
        database: "Luzon"
    });
    
    write.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Slave Recovery database!: Slave Recovery Luzon");
    });

    module.exports.write = write;

}

function slaveCrash(read, write){

    read.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Slave database!: Slave Luzon");
    });

    read = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20030",
        user: "master",
        password: "master",
        database: "Luzon"
    });
    
    read.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Master Recovery database!: Master Recovery Luzon");
    });

    write.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Slave database!: Slave Database");
    });

    write = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20030",
        user: "master",
        password: "master",
        database: "tempDB"
    });

    write.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Master Recovery database!: Master Recovery Luzon");
    })

    module.exports.read = read;
    module.exports.write = write;

}

async function masterRecover(read, write){

    try {

        //recover the values from Luzon.tempLuzon
        var tempData = await getAllApps(1, read)

        console.log(tempData)

        //delete the values
        var resultDelAll = await deleteAllApps(1, read)

        if (resultDelAll && resultDelAll.affectedRows > 0) {
            console.log("Deleted values from TempLuzon")
        }

        write.end(function(err) {
            if (err) throw err;
            console.log("Disconnected to Slave Recovery database!: Slave Luzon");
        });

        write = mysql.createConnection({
            host: "ccscloud.dlsu.edu.ph",
            port: "20030",
            user: "master",
            password: "master",
            database: "Luzon"
        });
        
        write.connect(function(err) {
            if (err) throw err;
            console.log("Connected to Master database!: Master Luzon");
        });

        module.exports.write = write;

        var update = 0;
        var insert = 0;
        //write them to master
        for(let i = 0; i < tempData.length ; i++){
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

            var resultDel = await deleteApp(newData, write)
            var resultIns = await insertApp(newData, write)

            if (resultDel && resultDel.affectedRows > 0) {
                update += 1
                insert -= 1
            }

            if (resultIns && resultIns.affectedRows > 0) {
                insert += 1
            }
        }

        //return ammount of success
        return { update: update, insert: insert }

    
    } catch (error) {
    // Handle any errors that occur within the try block
    console.error("An error occurred:", error);
    // You may want to add additional error handling or logging here
}
}

async function slaveRecover(read, write){

    try {
        // Recover the values from Master.tempDB.tempLuzon
        var tempData = await getAllApps(2, write);
        console.log(tempData);
    
        // Delete the values
        var resultDelAll = await deleteAllApps(2, write);

        if (resultDelAll && resultDelAll.affectedRows > 0) {
            console.log("Deleted values from TempLuzon");
        }
    
        // End the current read connection
        read.end(function(err) {
            if (err) throw err;
            console.log("Disconnected from Master Recovery database!: Master Recovery Luzon");
        });
    
        // Create a new read connection
        var read = mysql.createConnection({
            host: "ccscloud.dlsu.edu.ph",
            port: "20031",
            user: "slave1",
            password: "slave1",
            database: "Luzon"
        });
    
        // Connect to the new read database
        read.connect(function(err) {
            if (err) throw err;
            console.log("Connected to Slave database!: Slave Luzon");
        });
    
        // End the current write connection
        write.end(function(err) {
            if (err) throw err;
            console.log("Disconnected from Master Recovery database!: Master Recovery Luzon");
        });
    
        // Create a new write connection
        var write = mysql.createConnection({
            host: "ccscloud.dlsu.edu.ph",
            port: "20030",
            user: "master",
            password: "master",
            database: "Luzon"
        });
    
        // Connect to the new write database
        write.connect(function(err) {
            if (err) throw err;
            console.log("Connected to Slave database!: Slave Luzon");
        });
    
        // Export read and write modules
        module.exports.read = read;
        module.exports.write = write;
    
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
    
            var resultDel = await deleteApp(newData, write);
            var resultIns = await insertApp(newData, write);
    
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

module.exports = {
    write, read,
    masterCrash,
    masterRecover,
    slaveCrash,
    slaveRecover
};

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
            const query = "DELETE FROM tempLuzon";
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