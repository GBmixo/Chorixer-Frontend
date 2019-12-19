const ConvertToValues = (coord, axis) => {
    if(axis == 'xAxis'){
        let convert = (coord - 15) / 45 + 1
        return convert
    }else if(axis == 'yAxis'){
        let convert = ((coord - 16) / 35) + 1
        return convert
    }

}

export default ConvertToValues;