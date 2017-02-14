    /**
      * @namespace
    */

    var quizAPI = {



        mathContext: '',
        setMathContext: function (method) {
            /**
                * The method finds math operator that gives context to worded problems
                * @description This method is called by the questionPresentation method
                * @example
                *var mathType = "addition";
                *var operator = quizMaster.mathContext(mathType);
                *console.log(operator); //"+"
                * @param {string} method - argument represent context of math problem
                * @returns {string}
            */

            let operator;
            switch(method) {

                case "addition":
                case "add":
                case "a":
                case "+":
                    operator = "+"; //What is 5 + 5?
                    break;

                case "subtraction":
                case "subtract":
                case "sub":
                case "s":
                case "-":
                    operator = "-"; //What is 5 - 5?
                    break;

                case "multiplication":
                case "multiply":
                case "m":
                case "x":
                case "*":
                    operator = "x"; //What is 5 x 5?
                    break;

                case "division":
                case "divide":
                case "div":
                case "d":
                case "/":
                    operator = "divided by"; //what is 5 divided by 5?
                    break;

                case "power":
                case "exponent":
                case "exp":
                case "e":
                case "**":
                case "^":
                    operator = "to the power of"; //What is 2 to the power of 3?
                    break;

                case "modulus":
                case "remainder":
                case "%":
                    //prefix = "What is the remainder of"
                    operator = "divided by"; //What is the remainder of 6 divided by 5?
                    break;
              }
              this.mathContext = operator;
        },

        getMathContext : function(){
            return this.mathContext;
        },

        init: function(method,data){
            this.setMathContext(method);
            console.log("Quiz has been generated!!");
        },
    }

    window.onload = quizAPI;
