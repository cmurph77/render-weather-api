function getCategorization(temp){
    if(temp<13){
        return 'COLD'
    }else if(temp>=13 && temp <=23) {
        return 'MILD'
    } else if(temp>13){
        return 'HOT'
    }
}

console.log(getCategorization(24))