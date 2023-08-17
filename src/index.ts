import express from 'express'
import * as dbutil from "./common/sqliteUtility"
import * as testtype from "./interface/testType"
import * as testDao from "./dao/testDataDao"

// dbfile
const dbfile: string = "testDb.db"
const dbc = new dbutil.dbCommon(dbfile);

// var 変数名: 型
const app: express.Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(3001, function(){
    console.log("Node.js is listening to PORT:3001");
});

// 構造体?宣言
type photo = {
    id: string
    name: string
    type: string
    dataUrl: string
};

// 写真のサンプルデータ
const photoList: photo[] = [
    {
        id: "001",
        name: "photo001.jpg",
        type: "jpg",
        dataUrl: "http://localhost:3000/data/photo001.jpg"
    },{
        id: "002",
        name: "photo002.jpg",
        type: "jpg",
        dataUrl: "http://localhost:3000/data/photo002.jpg"
    }
]

function hello(name: string): photo[] {
    return photoList;
}

// 写真リストを取得するAPI
app.get("/api/photo/list", function(req, res, next){
    res.json(hello("aa"));
});

app.get("/api/testData", function(req, res, next){
    res.json(getTestTable());
});

const getTestTable = () => {
    const dao: testDao.testDataDao = new testDao.testDataDao(dbc.getConnection());
    dao.getTestData().then(data => {
        return data;
    });
}