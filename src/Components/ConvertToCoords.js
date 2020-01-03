const ConvertToCoords = (num, axis) => {
    if (axis == "pitch"){
        //console.log(num)
        let convert = ((num - 1) * 35) + 16;
        //console.log(convert)
        return(convert);
    }else if(axis == "time"){
        //console.log(num)
        let convert = ((num - 1) * 45) + 15;
        //console.log(convert)
        return(convert);
    }

}

export default ConvertToCoords;