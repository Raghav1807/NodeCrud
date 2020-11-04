const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();
app.use(bodyparser.json());
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodesample',
});

mysqlConnection.connect((err)=> {
    if(!err)
    console.log('Connection Established Successfully');
    else
    console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
});

app.get('/', (req,res) => {
    res.send('In Home Page');
});

app.post('/add', (req,res) => {
    try{
        if(req.body.firstName === undefined || req.body.lastName === undefined || req.body.registerNumber === undefined){
            throw 'Invalid Fields';
        }
        else{
            let data = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                registerNumber: req.body.registerNumber,
                time: Date.now(),
            }

            let query = 'INSERT INTO samplenode ( firstName , lastName , registerNumber ) VALUES ( "'+data.firstName+'" , "'+data.lastName+'" , "'+data.registerNumber+'" )';

            mysqlConnection.query(query, (err , result) => {
                if(err){
                    console.log(err);
                    res.status(503).json({
                        message: err
                    });
                }
                else{
                    console.log('Data Added');
                    res.status(201).json({
                        message: 'Data Added'
                    })
                }
            })

        }
    }
    catch(e){
        console.log(e);
        res.status(400).json({
            message: e
        })
    }
});

app.put('/update', (req,res) => {
    try{
        if(req.body.newFirstName === undefined || req.body.newFirstName === undefined){
            throw 'Invalid Exception';
        }
        else{
            let query = 'UPDATE samplenode SET firstName="'+req.body.newFirstName+'" WHERE firstName="'+req.body.oldFirstName+'"';
            mysqlConnection.query(query , (err , result) => {
                if(err){
                    console.log(err);
                    res.status(503).json({
                        message: err
                    });
                }
                else{
                    console.log('Data Added');
                    res.status(201).json({
                        message: 'Data Updated'
                    })
                }
            })
        }
    }
    catch(e){
        res.status(400).json({
            message: e
        })
    }
});

app.get('/read' , (req,res) => {
    let query = 'SELECT * FROM samplenode';
    mysqlConnection.query(query , (err,result) => {
        if(err) {
            console.log(err);
            res.status(503).json({
                message: err
            })
        }
        else{
            console.log(result);
            res.status(200).json({
                results: result
            })
        }
    })
});

app.delete('/delete', (req,res) => {
    //try{
    //    if(req.body.firstName === undefined){
    //        throw 'Invalid Field';
    //    }
    //    else{
    //        let query = 'DELETE FROM samplenode WHERE firstName="'+req.body.firstName+'"';
    //        mysqlConnection.query((err , result) => {
    //            if(err) {
    //                console.log(err);
    //                res.status(503).json({
    //                    message: err
    //                })
    //            }
    //            else{
    //                console.log('Data Deleted');
    //                console.log(`Affected: ${result.affectedRows}`);
    //                res.status(200).json({
    //                    message: 'Deleted'
    //                })
    //            }
    //        })
    //    }
    //}
    //catch(e){
    //    res.status(400).json({
    //        message: e
    //    })
    //}
    mysqlConnection.query('DELETE FROM samplenode WHERE firstName = "'+req.body.firstName+'"', [req.params.id], (err, rows, fields) => {
        if (!err)
        res.send('Record deleted successfully.');
        else
        console.log(err);
        })
})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

