/**
 * @file dateutility.ts
 * @note 日時ユーティリティ
 */


 /**
  * Date型から文字列を取得する
  * @param {Date} date 
  * @param {String} format 
  * @returns {String} 変換後文字列
  * @note フォーマットは"YY/MM/DD"、"YY/MM/DD hh:mm:ss"に対応
  * @note 順次対応していく
  * @note 変換できないdateに関しては空（""）を返す
  * @note typescriptだとconstが必要かも。。
  */
//   export function getStringFormatDate(date: Date, format: string) {
 export const getStringFormatDate = (date: Date, format: string): string => {
     let DayObj = new Date(date);			// Date型に入れる必要あり！！入れないと怒られるかな
     if(DayObj.toString() === "Invalid Date"){ //Date型に変換できない場合
         return "";
     }
     let num_year: number = DayObj.getFullYear();
     let num_month: number = DayObj.getMonth() + 1;
     let num_day: number = DayObj.getDate();
     let num_hour: number = DayObj.getHours();
     let num_minute: number = DayObj.getMinutes();
     let num_second: number = DayObj.getSeconds();
 
     // ０埋めを行う
     let str_month: string = ('0' + num_month).slice(-2);
     let str_day: string = ('0' + num_day).slice(-2);
     let str_hour: string = ('0' + num_hour).slice(-2);
     let str_minute: string = ('0' + num_minute).slice(-2);
     let str_second: string = ('0' + num_second).slice(-2);
 
     let formatStr: string = format;
     if( formatStr == 'YYYY/MM/DD' ){
         formatStr = formatStr.replace(/YYYY/g, num_year.toString());
         formatStr = formatStr.replace(/MM/g, str_month);
         formatStr = formatStr.replace(/DD/g, str_day);
     } else if(formatStr ==  'YYYY-MM-DD'){
         formatStr = formatStr.replace(/YYYY/g, num_year.toString());
         formatStr = formatStr.replace(/MM/g, str_month);
         formatStr = formatStr.replace(/DD/g, str_day);
     } else if( formatStr == 'YYYY/MM/DD hh:mm:ss' ){
         formatStr = formatStr.replace(/YYYY/g, num_year.toString());
         formatStr = formatStr.replace(/MM/g, str_month);
         formatStr = formatStr.replace(/DD/g, str_day);
         formatStr = formatStr.replace(/hh/g, str_hour);
         formatStr = formatStr.replace(/mm/g, str_minute);
         formatStr = formatStr.replace(/ss/g, str_second);	
     }
 
     return formatStr;
 }