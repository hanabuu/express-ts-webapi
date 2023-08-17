/**
 * @file readFileUtility.ts
 * @note ファイル読込ユーティリティ
 */

import fs from 'fs'
import iconv from 'iconv-lite'
import logger from "../loglib/logger"
import path from 'path'
// import readFileUtility from "./readFileUtility"

/**
 * フォルダのファイル一覧を取得する
 * @param dir 
 * @return <string[]> ファイル一覧
 * @note そもそもこの関数必要かどうか
 * @todo 引数チェックしてないやつならエラー返すとか？
 */
export const getDirFiles = (dir: string): string[] => {
    return fs.readdirSync(dir);
}

/**
 * 複雑なフォルダ内の最新ファイル一覧を取得する
 * @param rootdir 
 * @param secondDir 
 * @return <string[]> 最新ファイル一覧
 * @note ルートディレクトリ配下にユーザーごとのフォルダがいて、それぞれユーザーごとにSDフォルダがある場合に使用
 * @note 仕事でない限り使用しないと思う。。
 */
export const getComplexDirFiles = (rootdir: string, secondDir: string): string[] => {
    let fileResult: string[] = [];
    const dirs = fs.readdirSync(rootdir);
    for(let dir of dirs){
        // 取得したフォルダから中の/SD/のファイル一覧を取得
    
        // logger.info(rootdir + "/" + dir);
        const userfiles = fs.readdirSync( rootdir + '/' + dir + secondDir);
        
        // logger.info(userfiles);
        if(0 == userfiles.length){
            logger.info("SD無し" + dir);
            continue;
        }
        let filename: string = "";
        let mtime: Date = new Date();
        for(let j: number = 0; j<userfiles.length; j++){
            // ファイル一覧から最新ファイルを取得する
            // 最終修正時刻の比較を行う
    
            // logger.info(userfiles[j]);
            const status = fs.statSync(rootdir + '/' + dir + secondDir + userfiles[j]);     // ファイルのステータスを取得
            // logger.info(status.mtime);
            if(filename == ""){                                                             // 最初のファイルの場合は格納するだけ
                filename = rootdir + '/' + dir + secondDir + userfiles[j];
                mtime = status.mtime;
            } else {                                                                        // ２番目以降は最終修正時刻が大きい方のファイル名を取得する
                if(mtime < status.mtime){
                    filename = rootdir + '/' + dir + secondDir + userfiles[j];
                }
            }
        }
        fileResult.push(filename);                                                          // 客毎のファイル名を格納していく
    }
    return fileResult;
}

/**
 * SJISのCSVファイルを読込み、改行コードで分割した文字列配列を取得する
 * @param <string> path ファイルパス
 * @param <number> qflg 0: ダブルクォーテーションなし 1:ダブルクォーテーションあり
 * @returns <string[]> 文字列配列
 */
export const readCSV_SJIS = (path: string, qflg: number): Promise<string[]> => {
    return new Promise(resolve => {
        let res: string[] = [];
        const buf = fs.readFileSync(path);                      // ファイル読込
        const retStr = iconv.decode(buf, "Shift_JIS");          // SJISファイルを読み込む場合のデコード
        let lines = retStr.split('\r\n');                       // 改行コードで分割する
        lines.forEach(data => {
            let rows: string[] = [];
            if(qflg == 0){
                rows = data.split(',');                         // カンマでスプリット
            } else {
                rows = data.replace(/"/g, "").split(',');       // ダブルクォーテーション除去して、カンマでスプリット
            }
            if(rows[0] == ""){
                ;                     // 最後の改行コードはなにか入ってるとみなされるらしい。。
            } else {
                let json_tmp: string = JSON.stringify(rows);            // JSON文字列に変換
                res.push(JSON.parse(json_tmp));                 // JSON文字列をJSON形式に変換し配列にプッシュ
            }
        });
        resolve(res);
    });
}

/**
 * SJISのテキストファイルを読込み、改行コードで分割した文字列配列を取得する
 * @param <string> path ファイルパス
 * @returns <string[]> 文字列配列
 */
 export const readText_SJIS = (path: string): Promise<string[]> => {
    return new Promise(resolve => {
        let res: string[] = [];
        const buf = fs.readFileSync(path);                      // ファイル読込
        const retStr = iconv.decode(buf, "Shift_JIS");          // SJISファイルを読み込む場合のデコード
        let lines = retStr.split('\r\n');                       // 改行コードで分割する
        lines.forEach(data => {
            let rows: string[] = [];
            if(data　== ""){
                ;                     // 最後の改行コードはなにか入ってるとみなされるらしい。。
            } else {
                let json_tmp: string = JSON.stringify(data);            // JSON文字列に変換
                res.push(JSON.parse(json_tmp));                 // JSON文字列をJSON形式に変換し配列にプッシュ
            }
        });
        resolve(res);
    });
}

export const readText_UTF8 = (path: string): string[] => {
        let text: string = fs.readFileSync(path, 'utf8');
        let lines: string[] = text.toString().split('\r\n');
        return lines;
}

/**
 * 指定した深さのサブフォルダからファイル一覧を取り出す
 * @param {String} dirPath
 * @param {int} depth 深さ(指定したフォルダ内は1、その中のフォルダ内は2)
 * @param [in/out] {String[]} fileList
 * // https://mmorley.hatenablog.com/entry/2016/12/12/171628
 * @note 最下層のファイルのみ取得する
 */
export const getFileListToSubDirectory = (dirPath: string, depth: number, fileList: string[]): number => {
    try{
      let ret: number = 0;      // 戻り値用(見つかったファイルの数)
      if(depth < 0){
        return 0;
      }
      const files: string[] = fs.readdirSync(dirPath);
      files.forEach((file) => {
        let fullPath: string = path.join(dirPath, file); // フルパスを取得
        let stats: fs.Stats = fs.statSync(fullPath) // ファイル（またはフォルダ）の情報を取得
        if(stats.isDirectory()){ // フォルダの場合
          // 再帰的に呼び出して戻り値を配列に格納
          let res: number = getFileListToSubDirectory(fullPath, depth-1, fileList);
          if(res > 0){
            //返ってきた値でエラー処理するか
            ret = ret + res;
          } else {
            //ret = res;
          }
        } else { // ファイルの場合
            if(depth == 1){  //最下層のファイルのみ取得
                fileList.push(fullPath);
                ret++;
            } else {
                ;
            }
        }
      });
      return ret;
    } catch(err){
      logger.error(err);
      return -1;
    }
}

export const readJsonFile = (path: string): any => {
    const json: string = fs.readFileSync(path, 'utf8');
    const data: any = JSON.parse(json);
    return data;
}