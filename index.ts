const express = require('express')  
const app = express()  
app.get('/', function (req, res) {  
  const num1 = +req.query.num1;
  const num2 = +req.query.num2;
  let wynik:number = 0;
  const operation = req.query.operation;

  if(operation == "dodaj")
    wynik = num1 + num2;
  if(operation == "odejmij")
    wynik = num1 - num2;
  if(operation == "podziel")
    wynik = num1 / num2;
  if(operation == "pomnoz")
    wynik = num1 * num2;

  res.send("Wynik operacji " + operation + " to: " + wynik.toString())
})  
app.listen(3000)  


//res.send('<form method="get"> <label>number1</label><input type="number" name="number1"> <label>number2</label><input type="number" name="number2"> <hr>  <label>operation</label><input type="text" name="operation"> </form>')  
