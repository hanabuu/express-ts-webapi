/**
 * @file sqliteutility.ts
 * @note sqlite3を扱うユーティリティ
 */
import sqlite from 'sqlite3'

// const db: sqlite.Database = new sqlite.Database('inout.db');
// const db: sqlite.Database = new sqlite.Database(':memory:');

/**
 * @class dbCommon
 */
export class dbCommon {
    private db: sqlite.Database;

    /**
     * コンストラクタ
     * @param dbname 
     * @note データベースを作成する
     * @todo 別関数にして引数チェックしたほうがいいかも
     */
    constructor(dbname: string){
        this.db = new sqlite.Database(dbname);
        this.db.serialize();
    }

    /**
     * コネクション取得
     * @returns <sqlite.Database> データベースコネクション
     */
    getConnection(){
        return this.db;
    }

    /**
     * テーブル作成
     * @param <string> sql
     * @note 引数の文字列でテーブルを作成する。
     * @todo 引数チェック必要
     */
    createTable(sql: string){
        // データベースを作成する
        this.db.serialize(() => {
            this.db.run(sql);
        });
    }

    beginTransaction(){
        try{
            this.db.exec('begin transaction');
        } catch(e){
            console.log(e);
        }
    }

    execCommit(){
        try {
            this.db.exec('commit');
        } catch(e){
            console.log(e);
        }
    }

    /**
     * データベースクローズ
     * @note データベースをクローズする
     */
    closeDb(){
        try {
            this.db.close();
        } catch(e) {
            console.log(e);
        }
    }
}

