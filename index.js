const app = require("express")();
const stream = require('stream');
const fs = require('fs');
const http = require('http');
const PDF_FILE = `${process.cwd()}/sample.pdf`;

app.use("/get", (req, res) => {
    res.sendFile(PDF_FILE);
});

app.get("/download-from-request", (req, res) => {
    http.get("http://localhost:3000/get", file => {
        var fileName = "doc-from-stream.pdf";
        var readStream = new stream.PassThrough();
        var buffer;
    
        res.set('Content-disposition', 'attachment; filename=' + fileName);
        res.set('Content-Type', 'application/pdf');
    
        file.on("data", chunk => {
            buffer = chunk;
        });

        file.on("end", () => {
            readStream.pipe(res);
            readStream.end(buffer);
        })
    })
});

app.get("/download-from-file", (req, res) => {
    fs.readFile(PDF_FILE, (err, data) => {
        var fileName = "doc-from-file.pdf";
        var buffer = data;
        var readStream = new stream.PassThrough();
    
        res.set('Content-disposition', 'attachment; filename=' + fileName);
        res.set('Content-Type', 'application/pdf');
    
        readStream.pipe(res);
        readStream.end(buffer);
    });
});
console.log();


app.get("/", (req, res) => {
    
    res.send(`
    <ul>
    <li><a href="/download-from-request">Stream</a></li>
    <li><a href="/download-from-file">Arquivo</a></li>
    </ul>
    `);
});

app.listen(3000);