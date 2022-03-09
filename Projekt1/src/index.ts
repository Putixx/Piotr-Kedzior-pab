const express = require('express')  
const app = express()  
app.get('/:operation/:num1/:num2', function (req, res) {  
  const num1 = +req.params.num1;
  const num2 = +req.params.num2;
  let wynik:number = 0;
  const operation = req.params.operation;

  switch(operation)
  {
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

  res.send("Wynik operacji " + operation + " to: " + wynik.toString())
})  
app.listen(3000)  
