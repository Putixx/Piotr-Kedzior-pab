var express = require('express');
var app = express();
app.get('/:operation/:num1/:num2', function (req, res) {
    var num1 = +req.params.num1;
    var num2 = +req.params.num2;
    var wynik = 0;
    var operation = req.params.operation;
    switch (operation) {
        case "dodaj":
            {
                wynik = num1 + num2;
                break;
            }
        case "odejmij":
            {
                wynik = num1 - num2;
                break;
            }
        case "podziel":
            {
                wynik = num1 / num2;
                break;
            }
        case "pomnoz":
            {
                wynik = num1 * num2;
                break;
            }
        default:
            {
                break;
            }
    }
    res.send("Wynik operacji " + operation + " to: " + wynik.toString());
});
app.listen(3000);
