import { useState } from 'react';
import './App.css';

function returnNumberButtons() {
  return [9,8,7,6,5,4,3,2,1,0,".", "+", "-", "*", "/"];
}

function returnOperatorButtons() {
  return ["=", "C"];
}

function App() {
  const [expression, setExpression] = useState("");
  const [display, setDisplay] = useState("");

  const formatNumber = (num) => {
    if (num === "") return "";
    const n = Number(num);
    if (isNaN(n)) return num;

    if (Math.abs(n) >= 1_000_000_000) {
      const sci = n.toExponential(2);
      const [base, exp] = sci.split("e");
      const exponent = exp.replace("+", "");
      return `${base} × 10^${exponent}`;
    }

    const parts = n.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  };

  const formatExpression = (expr) => {
    if (expr === "") return "";

    const operators = /[+\-*/]/g;
    const tokens = expr.split(operators);
    const ops = expr.match(operators) || [];
    const lastNumber = tokens[tokens.length - 1];
    const formattedLast = formatNumber(lastNumber);

    let formattedExpr = "";
    for (let i = 0; i < ops.length; i++) {
      formattedExpr += tokens[i] + ops[i];
    }
    formattedExpr += formattedLast;

    return formattedExpr;
  };

  const handleButtonClick = (value) => {
    if (value === "=") {
      try {
        const result = eval(expression);
        const formattedResult = formatNumber(result);
        setExpression(result.toString());
        setDisplay(formattedResult);
      } catch {
        setExpression("");
        setDisplay("Error");
      }
    } else if (value === "C") {
      setExpression("");
      setDisplay("");
    } else {
      const newExpression = expression + value;
      setExpression(newExpression);
      setDisplay(formatExpression(newExpression));
    }
  };

  return (
    <div className="calculator-container">
      <input
        type="text"
        className="calculator-display"
        readOnly
        value={display}
      />
      <div className="grid-container">
        {returnNumberButtons().map((num, index) => (
          <div
            key={index}
            className="grid-item"
            onClick={() => handleButtonClick(num.toString())}
          >
            {num}
          </div>
        ))}
        <div className="operators-column">
          {returnOperatorButtons().map((op, index) => (
            <div
              key={index}
              className={`grid-item operator ${op === "C" ? "clear" : ""} ${op === "=" ? "equals" : ""}`}
              onClick={() => handleButtonClick(op)}
            >
              {op}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
