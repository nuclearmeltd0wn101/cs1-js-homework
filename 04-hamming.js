function hammingEncode(data)
{
    let ctl = new Array();
    ctl[0] = (data[0] + data[1] + data[3]) % 2;
    ctl[1] = (data[0] + data[2] + data[3]) % 2;
    ctl[2] = (data[1] + data[2] + data[3]) % 2;
    return data.concat(ctl);
}
function hammingDecode(data)
{
    let infoBits = data.slice(0,4);
    let ctlBits = data.slice(4,7);
    let result = new Array();
    result[0] = ((ctlBits[0] + infoBits[0] + infoBits[1] + infoBits[3]) % 2)
        + ((ctlBits[1] + infoBits[0] + infoBits[2] + infoBits[3]) % 2)
        + ((ctlBits[2] + infoBits[1] + infoBits[2] + infoBits[3]) % 2)
        + (infoBits[3] + ctlBits[0] + ctlBits[1] + ctlBits[2] + ctlBits[3]);
    
    result[1] = infoBits;
    return result;
}
hammingDecode([ 1, 0, 1, 1, 0, 1, 0 ])