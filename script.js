const calculationElement=document.getElementById('calculation');
const resultElement=document.getElementById('result');
const installButton=document.getElementById('installButton');

//calculator state
let currentInput = '0';
let calculation ='';
let result =null;
let lastOperator= null;
let waitingForOperand = false;

//update display
function updateDisplay(){
    resultElement.textContent=currentInput;
    calculationElement.textContent=calculation;
}

//Input digit
function InputDigit(digit){
    if (waitingForOperand){
        currentInput =digit;
        waitingForOperand=false;
    }else {
        currentInput =currentInput==='0'  ? digit:currentInput+digit
    }

}

//input decimal
function inputDecimal(){
    if (waitingForOperand){
        currentInput = '0';
        waitingForOperand =false;
        return;
    }

    if(!currentInput.includes('.')){
        currentInput+='.';
    }
}

//Handle operator
function handleOperator(nextOperator){
    const inputValue = parseFloat(currentInput);

    if(result=== null){
        result= inputValue;
    }else if (lastOperator){
        const currentResult=result || 0;

        switch(lastOperator){
            case'+':
            result=currentResult + inputValue;
            break;

              case'-':
            result=currentResult - inputValue;
            break;

              case'*':
            result=currentResult * inputValue;
            break;

             case'/':
            result=currentResult / inputValue;
            break;
            
              case'%':
            result=currentResult % inputValue;
            break;
        }
    }


    calculation = calculation ? `${calculation}${currentInput}${nextOperator}`:`${currentInput}${nextOperator}`;

    currentInput = String(result);
    waitingForOperand=true;
    lastOperator=nextOperator;

    updateDisplay()
}

//calculate result
function calculate(){
    if (!lastOperator) return;

    const inputValue= parseFloat(currentInput);

    
        switch(lastOperator){
            case'+':
            result=result+ inputValue;
            break;

              case'-':
            result=result- inputValue;
            break;

              case'*':
            result=result*inputValue;
            break;

             case'/':
            result=result /inputValue;
            break;
        
              case'%':
            result=result%inputValue;
            break;
        }

        calculation= `${calculation}${currentInput}=`;
        currentInput= String(result);
        lastOperator=null;
        waitingForOperand-true;

        updateDisplay();
    }

    //clear calculator
    function clearCalculator(){
        currentInput='0';
        calculation='';
        result=null;
        lastOperator=null;
        waitingForOperand=false;

        updateDisplay();
    }

    //delete last character
    function deleteLastCharacter(){
        if(currentInput.lenght===1){
            currentInput='0';
        }else{
            currentInput=currentInput.slice(0, -1);
        }

        updateDisplay();
    }

    //event listener for button
    document.querySelector('.keypad').addEventListener('click',(event)=>{
        const {target}=event;

        if (!target.matches('button')) return;

        if(target.dataset.number){
            if (target.dataset.number==='.'){
                inputDecimal();
            }else{
                InputDigit(target.dataset.number);
            }

            updateDisplay();
        }else if (target.dataset.operator){
            handleOperator(target.dataset.operator);
        }else if (target.dataset.action){
            if (target.dataset.action==='calculate'){
                calculate();
            }else if (target.dataset.action==='clear'){
                clearCalculator();
            }else if (target.dataset.action==='delete'){
                deleteLastCharacter();
            }
        }
    });

    //keyboard support
    document.addEventListener('keydown',(event)=>{
        const{key}=event;

        if(/^\d$/.test(key)){
            event.preventDefault();
            inputDigit(key);
            updateDisplay();
        }else if (key==='.'){
            event.preventDefault();
            inputDecimal();
            updateDisplay();
        }else if (key === '+' || key==='-' || key==='*' || key=== '/'){
            event.preventDefault();
            handleOperator(key);
        }else if (key=== '%'){
            event.preventDefault();
            handleOperator('%');    
        }else if (key=== 'Enter' || key === '='){
            event.preventDefault();
            calculate();
        }else if (key === 'Escape' || key ==='Delete'){
            event.preventDefault();
            clearCalculator();
        }else if (key === 'Backspace'){
            event.preventDefault();
            deleteLastCharacter();
        }
    
    });

    //PWA installation
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e)=>{
        e.preventDefault();
        deferredPrompt=e;
        installButton.style.display='flex';
    });

    installButton.addEventListener('click',async()=>{
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const{outcome}=await deferredPrompt.userChoice;

        if (outcome=== 'accepted'){
            installButton.style.display='none';
        }

        deferredPrompt=null
    });

    //Register service-worker
    if ('serviceWorker' in navigator){
        window.addEventListener('load',() =>{
            navigator.serviceWorker.register('service-worker.js')
            .then(registration =>{
                console.log('SW registered:', registration);
            })
            .catch(registrationError =>{
                console.log('SW registration failed:', registrationError);
            });

        });
    }

    //initial display
    updateDisplay();