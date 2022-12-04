function getClosestFactors(input) {
    // var testNumber = Math.sqrt(input)
    // log.trace(tag.general, testNumber)
    // while (input % testNumber !== 0) {
    //     testNumber--;
    // }
    // return [testNumber, input / testNumber]
    var a = 1, b = input, i = 0
    while (a < b) {
        i++;
        if (input % i === 0) {
            a = i
            b = Math.floor(input / a)
        }
    }
    return [b, a]

}

function getReasonableDimensions(input){
    var k = 1
    var max = ~~Math.sqrt(input);
    return Array.from({length: max}, (_,i,a) => [input%(max-i),max-i])
                .sort((a,b) => a[0] - b[0])
                .slice(0,k)
                .map(t => [Math.floor(input/t[1]), t[1]])[0];
}

console.log(getClosestFactors(25))
console.log(getClosestFactors(10))
console.log(getClosestFactors(12))
console.log(getClosestFactors(54))
console.log(getClosestFactors(63))

console.log('split ------------------')
console.log(getReasonableDimensions(25))
console.log(getReasonableDimensions(10))
console.log(getReasonableDimensions(12))
console.log(getReasonableDimensions(54))
console.log(getReasonableDimensions(63))