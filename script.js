  
const inputSlider=document.querySelector("[data-lengthslider]") ;   // fetch by custom attribute "[custom attribute]"
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberscaseCheck=document.querySelector("#numbers");
const symbolscaseCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector("#generateButton");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");       //important
const symbols='~!@#$%^&*()_-+={}[]/":;<>?/';

let password="";  //strating empty
let passwordLength=10;
let checkCount=0;   //initially 1st checkbox is ticked
handleSlider();

//set strength circle  to grey
setIndicator('white');



//reflect password length on UI (every time)
function handleSlider(){
      
   inputSlider.value=passwordLength; //tells inital position of slider
    lengthDisplay.innerText = passwordLength;

 //used for colouring slider
    const min= inputSlider.min; 
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100 /(max-min) )+ "% 100%";

}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    
     indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;   //` used (not single inverted comma)`
    
}


function getRandomInteger(min,max){
    //important
   return  Math.floor(Math.random()  * (max-min))  +min;   //math random provieds between 0(inclusive)  and 1(exclusive)  && floor is used for round off
    
}  


function generateRandomNumber(){
    return getRandomInteger(0,9);
}



function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123) );//ascii value of a  and z    String.fromCharCode   convert ascii code to characters
}


function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91) );//ascii value of A  and Z
}




function generateSymbol(){
       const randnum=getRandomInteger(0,symbols.length);
       return symbols.charAt(randnum); // randnum is index

    }



 function calculateStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked)  hasUpper=true;   //check boxes are ticked or not
    if(lowercaseCheck.checked)  hasLower=true;     //(.checked )property is used for view the status of checkbox
    if(numberscaseCheck.checked)  hasNum=true;
    if(symbolscaseCheck.checked)  hasSym=true;


    if(hasUpper && hasLower && (hasSym || hasNum)     && passwordLength>=8)
        setIndicator('green');

    else if (  
                   (hasLower || hasUpper) &&
                   (hasNum  || hasSym)   &&
                   passwordLength >= 6

             )
              setIndicator('yellow');


    else 
        setIndicator('red');
 }



//async because we want awit function (when copy execution completed then displayed copied)
 async function copyContent(){
  try{
    //important
    await navigator.clipboard.writeText(passwordDisplay.value); //async operation (we want jb tk execution complete n ho tb tk aage n badhe)   return promise
    copyMsg.innerText="Copied";  //await because (copied message jb tk aaye tb tk password copy ho chuka ho)
  }
  
  catch(e)
  {
        copyMsg.innerText="Failed";
  }
    //to make copied span visible
  copyMsg.classList.add("active");


  //to make invisible after while
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 1500);

     
 }




 function shufflePassword(array){
      //fisher yates method(we can shuffle in array form)

      for(let i=array.length-1; i>0;  i--)
        {
            const j=Math.floor(Math.random()*(i+1));
            const temp=array[i];
            array[i]=array[j];
            array[j]=temp;

        } 
        let str="";
        array.forEach( (el) => (str+=el));
        return str;
 }





function handleCheckBoxChange() {
     checkCount=0;
     allCheckBox.forEach(   (checkbox)  => {
        if(checkbox.checked)
            checkCount++;
     });


     //special conditionn  , corner check
     if(checkCount > passwordLength){
        passwordLength=checkCount;
        handleSlider();
     }
         
}




 //all event listner
//v. important

 allCheckBox.forEach(  (checkbox)  =>   {
        checkbox.addEventListener('change' , handleCheckBoxChange)  //function call when ticked or unticked checkbox
          // for every 'change'    handleCheckBoxChange call  and checkcount
    })



 inputSlider.addEventListener('input',(e) => {
    passwordLength=e.target.value;
    handleSlider();  //update on UI
 })



 //copy buttton
 copyBtn.addEventListener('click',()=> { // click is event
    if(passwordDisplay.value)   //copy only when if value is avilable in password    (password.Length >= 0)
        copyContent();
 })




 generateBtn.addEventListener('click', () => {
    console.log('a');
       if(checkCount ==0) 
        return ;

       if(passwordLength < checkCount)
       {
        passwordLength=checkCount;
        handleSlider();
       }


       //lets start to find new password
       //remove old password
       password="";

       //lets puts the stuff mentioned by checkbox

    //    if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    //    }

    //    if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    //    }

    //    if(numberscaseCheck.checked){
    //     password+=generateRandomNumber();
    //    }

    //    if(symbolscaseCheck.checked){
    //     password+=generateSymbol();
    //    }


    console.log('b');
    let funcArray=[];
    if(uppercaseCheck.checked)
          funcArray.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArray.push(generateLowerCase);

    if(symbolscaseCheck.checked)
        funcArray.push(generateSymbol);

    if(numberscaseCheck.checked)
        funcArray.push(generateRandomNumber);


    //compulsory addition
    
    for(let i=0;i<funcArray.length;i++)
        password+=funcArray[i]();



    console.log('c');


    //remaim=ning addition
    for(let i=0;i  <  passwordLength-funcArray.length  ;i++){
        let randomIndex= getRandomInteger(0, funcArray.length);
         password+=funcArray[randomIndex]();

    }


    //shuffle the passsword
    password= shufflePassword(Array.from(password));


    // password display on UI
     passwordDisplay.value=password;


     //calculate strength

     calculateStrength();


 });



