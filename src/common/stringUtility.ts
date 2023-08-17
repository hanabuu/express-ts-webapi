/**
 * @file stringutility.ts
 * @note 文字列ユーティリティ
 */

/**
 * SJIS文字列からバイト数分の文字列を切り出す
 * @param str 文字列
 * @param begin 開始バイト(0から数えたバイト数で)
 * @param byteNum 切り出すバイト数
 */
export const substr_b = (str: string, begin: number, byteNum: number): string => {
    let length: number = 0;
    let res: string = "";
    // let uArray: Uint8Array = Uint8Array.from(str);
    for(let i:number=0; i<str.length; i++){
        let bytelen: number = str.charCodeAt(i);
        if ( (bytelen >= 0x0 && bytelen < 0x81) || (bytelen === 0xf8f0) || 
            (bytelen >= 0xff61 && bytelen < 0xffa0) || (bytelen >= 0xf8f1 && bytelen < 0xf8f4) ) {
            length += 1;
        } else {
            length += 2;
        }
        if((length == begin+1) && (byteNum == 1)){
            res += str[i];
            break;
        } else if((length > begin) && (length <= begin+byteNum)){
            res += str[i];
            if(length >= begin+byteNum) break;
        } else {
            ;
        }
    }
    return res;
}