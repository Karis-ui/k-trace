export function calculateGrades({moistureContent,defects,cuppingScore}){
    const totalDefects = Object.values(defects).reduce((a,b) => a+(b || 0),0);
    const score = cuppingScore.total;

    if (score >= 85 && moistureContent >= 10 && moistureContent <=12 && totalDefects <=5){
        return "AA";
    }else if (score >= 80 && score <85 && moistureContent >= 10 && moistureContent <=12.5 && totalDefects <=10){
        return "AB";
    }else if (score >= 75 && score <80 && moistureContent >= 10 && moistureContent <=13 && totalDefects <=15){
        return "PB";
    }else{
        return "C";
    }
}

export function calculatePayout({grade, weight}){
    const Pricetable = {AA:100, AB:90, PB:80, C:70};

    const pricePerKg = Pricetable[grade] || 60;
    return weight * pricePerKg;
}