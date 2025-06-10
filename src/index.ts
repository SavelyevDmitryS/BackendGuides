import fs from 'fs';
import express from 'express';


const app = express();
const port = process.env.PORT || 8080;

//req.query. обращение к cgi параметрам в запросе
//req.body. полезная нагрузка POST

//middleware
const bodyJsonMiddleware = express.json();
app.use(bodyJsonMiddleware);

function readData(path: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err || !data) {
                reject('Its not a file');
                return;
            }

            const json = JSON.parse(data.toString());
            resolve(json);
        });
    })
}

app.get('/', async (req, res) => {
  res.send('Start page, Hello');
});

app.get('/home', async (req, res) => {
    console.log('filePath: ', `./pages/home.json`);
    try {
        const data = await readData(`./pages/home.json`);
        res.status(200).send(data);
    } catch (err) {
        res.sendStatus(404);
        return;
    }
});

app.get('/news', async (req, res) => {
    try {
        const data = await readData(`./pages/news.json`);
        res.send(data);
    } catch (err) {
        res.sendStatus(404);
        return;
    }
});

app.get('/news/:id', async (req, res) => {
    try {
        const data = await readData(`./assets/news/${req.params.id}.json`);
        res.send(data);
    } catch (err) {
        res.sendStatus(404);
        return;
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
