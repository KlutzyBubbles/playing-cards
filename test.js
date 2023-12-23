var diff = {
    x: -1,
    y: 1
}

var corner = diff.x > 0 ? (diff.y > 0 ? 1 : 4) : (diff.y > 0 ? 2 : 3);
//int corner = flag2 ? (flag3 ? 1 : 4) : (flag3 ? 2 : 3);
//float f = (yDiff) / (xDiff);
var num = 180 * (corner - ((corner > 2) ? 2 : 1));

console.log(corner)
console.log(num)