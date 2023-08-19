import sqlite from 'sqlite3'
import * as testType from '../interface/testType'
import logger from "../loglib/logger"

export class testDataDao{
    private db: sqlite.Database;

    constructor(dbc: sqlite.Database){
        this.db = dbc;
    }

    public getTestData(): Promise<testType.test[]>{
        return new Promise((resolve,reject) =>{
            let testDatas: testType.test[] = [];
            try {
                this.db.serialize(() => {
                    this.db.all('SELECT test1, test2 FROM test', (error, rows: testType.test[]) => {
                        if(error) throw Error;
//                        console.log(rows);
                        resolve(rows);
                    });
                });
            } catch(err) {
                console.log(err);
                reject(testDatas);
            }
        });
    }
}