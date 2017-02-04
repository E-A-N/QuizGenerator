

/**
  * @namespace
*/
var quizMaster = {

    //Initialize attributes
    userFeedback    : document.getElementById("answerDisplay"),
    submitButton    : document.getElementById("dataSubmit"),
    quizForm        : document.getElementById("formx"),
    quizSlot        : document.getElementById("userAnswer"),
    quizContainer   : document.getElementById("quizContainer"),
    quizType        : document.getElementById("quiztype"),
    failURL         : document.getElementById("fail_url"),
    correctAnswer   : 'Correct!', //message to display upon user getting correct answer
    quizResult      : '',
    quizData        : {}, //This attribute will information needed for database
    questIter       : 0,  //This attribute stores current state of the quiz as a number (fsm)
    questList       : {}, //This attribute stores questions as array (number) values
    wordedQuestions : {}, //This attribute displays questions as is written to dom
    answers         : {}, //This attribute carries correct answers
    userAnswers     : {}, //This attribute stores answers submitted from user
    askedQuestions  : [], //This attribute array stores questions already asked
    numberCorrect   : 0,  //This attribute stores number of questions correctly answered
    questNum        : 0,  //This attributes stores total number of questions as a number
    passed          : 0,  //This attributes stores if user has passed or not
    previousQuest   : undefined,  //This attribute stores previous question asked to user
    mathMethod      : "math",     //This attributes stores the kind of math the quiz will use
    //The init function will will change mathMethod to appropriate context


    /**
        *This method will collect form data and pass information to backend

    */
    endOfQuiz: function(){

        //Update Form information
        document.formx.pass.value = this.passed;
        document.formx.nc.value = this.numberCorrect;
        this.quizResult = this.passed ? 'success' : 'gostudy';
        this.quizForm.style.display = 'none';
        this.submitButton.style.display = "inline-block";
        //console.log(this.submitButton);
    },


    /**
        * Converts mathmatical elements into a sentence
        * @example
        *var numberArray = [1,2,3,4];
        *var mathType = "addition";
        *quizMaster.questionPresentation(numberArray,mathType);
        * //returns What is 1 + 2 + 3 + 4
        -This method (as in member function not argument) is called by the init method
        -This method converts the criteria of a given equation into a
        sentence.
        * @param {array} criteria - An array consisting of number values
        * @param {string} method - A string that contains an operator giving mathmaatical context to the sentence.
        * @param  {string} custom - [Optional] This string will automatically override the return value
        * @returns {string}
    */
    questionPresentation: function(criteria, method, custom){

        let test;
        if (custom === undefined){
            //let quest = document.getElementById("currentQuestion");
            let operator = this.mathContext(method);
            //quest.innerHTML = "What is";
            test = "What is";
            for (var i = 0; i < criteria.length; i++){
                if (i === 0) {
                    test += ' ' + criteria[i];
                }
                else {
                    test += ' ' + operator + ' ' + criteria[i];
                }
            }
            test += "?";
        }
        else {
                test = custom;
        }
        return test;
    },

    /**
        * Gets rid of non-int based characters
        * @returns {int}
    */
    getAnswer: function(){
        //this method is called by quizUpdate
        let answer = document.getElementById('ans' + this.questIter).value;
        answer = this.numberSansCommas(answer);
        return parseInt(answer);
    },

    /**
        * Searches a number based string for none numbers
        * @returns {string}
    */
    numberSansCommas: function(numberString) {
        //NumberString a string paramter that is parsed by a regex for none digit based characters.
        //this method is called by getAnswer
        return numberString.replace(/[^\d\.\-\ ]/g, '');
    },


    /**
        * The method finds math operator that gives context to worded problems
        * @description This method is called by the questionPresentation method
        * @example
        *var mathType = "addition";
        *var operator = quizMaster.mathContext(mathType);
        *console.log(operator); //"+"
        * @param  {string} method - argument represent context of math problem
        * @returns {string}
    */
    mathContext: function (method) {
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
            /*
            case "modulus":
            case "remainder":
            case "%":
                //prefix = "What is the remainder of"
                operator = "divided by"; //What is the remainder of 6 divided by 5?
                break;
            */
          }
          return operator;
    },

    quizPath: function(result){
        //this method is called by quizUpdate
        //the result argument is a boolean representing if a quiz has been passed or not
        //to do: adjust this method to adapt to any number of questions
        //to do: implement a custom path
        let next;
        switch(this.questIter){
            //Positive numbers represent test questions
            //Negative 1 represents failed test, Negative -2 represents passed test
            //Example: if you get question 0 correct you go to question 3
            case 0:
            next = result ? 3 : 1;
            break;

            case 1:
            next = result ? 3 : -1;
            //-1 means go study
            break;

            case 2:
            next = result ? 5 : -1;
            break;

            case 3:
            next = result ? 5 : 2;
            break;

            case 4:
            next = result ? 6 : -1;
            break;

            case 5:
            next = result ? 6 : 4;
            break;

            case 6:
            next = result ? 7 : -1;
            break;

            case 7:
            next = result ? -2 : -1;
            //-2 means test is successfully passed
            break;
        }
        return next;
    },

    quizUpdate: function(){
        //this method executes when a user clicks the "userAnswer" DOM button

        //Retrieve answer
        let ans = this.getAnswer();

        //Check if answer is correct
        let passed;
        if (this.mathCheck(ans)){
            //document.getElementById("answerDisplay").innerHTML = "Correct!";
            this.renderResult("quiz+"); //To do: pass comp generator as callback
            passed = true;
            this.numberCorrect++;
        }
        else{
            //document.getElementById("answerDisplay").innerHTML = "Your answer is incorrect.";
            this.renderResult("quiz-"); //To do: pass comp generator as callback
            passed = false;
        }

        //Find out which quiz action comes next
        this.previousQuest = this.questIter; //keep track of previous question
        let inputAnswer = document.getElementById("ans"+ this.questIter).value;
        this.userAnswers["ans" + this.questIter] = inputAnswer; //append user answer to json
        this.askedQuestions["ans" + this.questIter] = 1; //append asked question to array
        this.questIter = this.quizPath(passed);  //decide next appropriate question

        switch(this.questIter){
            case -1: //failed the quiz
              this.passed = 0;
              this.renderResult("complete-");
              this.endOfQuiz();
              break;

            case -2: //passed the quiz
              this.passed = 1;
              this.renderResult("complete+");
              this.endOfQuiz();
              break;

            default: //advance to the next question
              this.renderQuestion();
              break;
        }

        //Check if question has already been displayed
        /* Commented out until logic error is solved
        for (let i = 0; i < this.questNum; i++){
            if (this.askedQuestions[i] === this.questIter) {
                //Look into other actions to take about same questions
                console.log("Question " + this.questIter + " has already been asked!");
                console.log(this.askedQuestions[i]);
                console.log(i);
                return;
            }
        }
        */
    },

    renderResult: function(result, callback){
        /*
            -Example usage: renderSuccess("complete-",giveCompliment)
                ----> "You need to go study more, but you did great!"
            -This function displays messages whenever the user finishes a quiz
             question, or the quiz itself.
            -This method is called by quizUpdate, endOfQuiz
            -The result argument is string type that will determine the kind of
            message the user recieves for finishing.
                -Note: the +/- required for this arg does not refer to
                incrementation or decrementation in any way
            -The callback argument can be any function that returns a string
            type.  That returned string will be concatenated to the returned
            result of this function.
        */

        //Check for callback, otherwise create empty string
        callback = typeof callback === "function" ? callback() : '';
        let msg;
        switch(result){
            case "quiz+":
                msg = this.correctAnswer;
                break;

            case "quiz-":
                msg ="Your answer is incorrect.";
                break;

            case "complete+":
                msg = "Great Job, You Passed!";
                break;

            case "complete-":
                msg = "You need to go study more.";
                break;
        }
        this.userFeedback.innerHTML = "</br>" + msg + callback;
    },

    renderQuestion: function(){
        //This method renders current question to the DOM
        //this method is called by quizUpdate

        //Hide Previous Question
        if (typeof this.previousQuest !== "undefined"){
            let prev = document.getElementById("quizNum" + this.previousQuest);
            prev.style.display = 'none';
        }

        //Initialize temporary variables
        let nodeDiv    = document.createElement("div");
        let nodeLabel  = document.createElement("label");
        let nodeInput  = document.createElement("input");
        let nodeButton = document.createElement("button");

        nodeDiv.id   = "quizNum"  + this.questIter;
        nodeLabel.id = "question" + this.questIter;
        nodeInput.id = "ans"      + this.questIter;
        nodeLabel.className = "typeWriter";
        nodeInput.placeholder = "enter answer here";
        nodeButton.className  = "userAnswerButton";
        nodeButton.id = 'button' + (this.questIter + 1);
        //Populate Node Fields
        nodeButton.value = "ANSWER";
        nodeButton.onclick = this.quizUpdate.bind(quizMaster);
        nodeButton.innerHTML = " Submit your answer ";
        nodeButton.type = "button";
        nodeInput.type = "text";
        nodeInput.name = "ans" + this.questIter;
        nodeInput.focus();

        //Render Question!
        nodeLabel.innerHTML = this.wordedQuestions["question" + this.questIter] + ' ';

        //Embed Node Fields
        this.quizContainer.appendChild(nodeDiv);
        nodeDiv.appendChild(nodeLabel);
        nodeDiv.innerHTML += "</br>";
        nodeDiv.appendChild(nodeInput);
        nodeDiv.innerHTML += "</br>";
        nodeDiv.appendChild(nodeButton);
        nodeDiv.innerHTML += "</br>";

        //Access Global scope to call functions for generated properties
        let buttonIteration = document.getElementById("button" + (this.questIter + 1));
        buttonIteration.onclick = this.quizUpdate.bind(quizMaster);
        let inputFocus = document.getElementById("ans" + this.questIter);
        inputFocus.focus();
    },

    //Use number check to check argument values of calculateProblem
    numberCheck : function(ray) {
        let itemsAreNumbers = true;
        for (var i = 0; i < ray.length; i++){
            if (typeof ray[i] !== "number"){
                itemsAreNumbers = false;
                break;
            }
        }
        return itemsAreNumbers;
    },


    //Pass arbitrary values into the caluculate method from the dom
    calculateProblem : function(method,args) {
        /*
            -Example usage:  quizMaster.calculateProblem("add",[1,2]) --> 3
            -Example usage2: quizMaster.calculateProblem("multiply",[2,3,4,5]) --> 120
            -First argument must always be a key (string)
            -Second argument is an array containing any amount of numbers in the math
            problem
            -This function returns a number value.
            -This method (as in member function) is called by mathCheck
        */

        let correctAnswer;
        switch(method) {

            case "addition":
            case "add":
            case "a":
                correctAnswer = args.reduce((a,b) => a + b);
                break;

            case "subtraction":
            case "subtract":
            case "s":
                correctAnswer = args.reduce((a,b) => a - b);
                break;

            case "multiplication":
            case "multiply":
            case "m":
                correctAnswer = args.reduce((a,b) => a * b);
                break;

            case "division":
            case "divide":
            case "div":
            case "d":
                //check for division by zero
                if (args.findIndex((elm) => (elm === 0)) !== -1) {
                    throw "You can't divide by 0!!";
                }
                else {
                    correctAnswer = args.reduce((a,b) => a / b);
                }
                break;

            case "power":
            case "exponent":
            case "exp":
            case "e":
                    correctAnswer = args.reduce((a,b) => a ** b);
                    break;

            case "modulus":
            case "remainder":
                //check for division by zero
                if (args.findIndex((elm) => (elm === 0)) !== -1) {
                    throw "You can't divide by 0!!";
                }
                else {
                    correctAnswer = args.reduce((a,b) => a % b);
                }
                break;

            default:
                //throw "Error, method of calculation is illegal";
                return method;
                break;
        }
        return correctAnswer;
    },

    mathCheck: function(userAnswer){
        /*
            -Example usage:
            quizMaster.mathCheck([5,4],"multiplication",20)
                ----> true;
                ---->If the user answers is 20, they're correct
            -The userAnswer argument is the user form submitted value
            -This method returns a boolean value
            -This method is called by quiz update
        */

        //Use questIter attribute to find correct answer.
        let correctAnswer = this.calculateProblem(this.mathMethod, this.questList["question" + this.questIter]);
        let isCorrect = correctAnswer === userAnswer;
        return isCorrect;
    },

    dataFetch: function(){
        /*
            -This function will return a jSon containing all necessary quiz info
        */

        //Pack all of quiz data into Json
        let data = this.userAnswers;

        data["fail_url"]   = this.failURL.value;
        data["quiztype"]   = this.quizType.value;
        data["quizResult"] = this.quizResult;
        data["pass"]       = this.passed;
        data["nc"]         = this.numberCorrect;

        //Embded data in another json for server compatibility
        data = { datatype: "object",
                 values: data,
        };
        data = JSON.stringify(data);
        console.log(data);
        return data;
    },

    init: function(method,data){
        /*
            -example Usage: quizMaster.init("addition",json);
            -First argument should be string representing mathmatical operation method
            -Second argument should be a JSON representing quiz questions
                --> Questions will be written per order of the array elements, so take that into account when considering things like pemdas.
            -This method should be public and called externally
        */

        //fields for later use
        this.submitButton.style.display = "none";

        //Initialize the math method (as in field value not member function)
        this.mathMethod = method;

        //Write Values to the DOM
        let num = 0;
        for (let i in data){
            //Append num to input form element names, example: ans0
            let iStr = "question" + num;

            //unpack question values for later use
            this.questList[iStr] = data[i].values;
            if(data[i].custom) {
                this.wordedQuestions[iStr] = data[i].custom;
            }
            else {
                this.wordedQuestions[iStr] =  this.questionPresentation(data[i].values,this.mathMethod);
            }
            num++;
        }

        this.questNum = num;
        this.renderQuestion();  //This starts up the Quiz
    },
};
