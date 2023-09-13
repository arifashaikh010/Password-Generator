const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");     //all checkboxes 
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();             //update on UI based on passwordLength
//set strngth circle color to grey
setIndicator("#ccc");

//set passwordLength
//passwordLength ko UI pr 'reflect' karwata haii
function handleSlider(){
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  //or kuch bhi karna chahiye ? - HW
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
  indicator.style.backgroundColor =color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;        //shadow
}

function getRndInteger(min, max){
  return Math.floor(Math.random() * (max-min)) + min;  //round off using Math.floor
}

function generateRandomNumber(){
  return getRndInteger(0,9);
}

function generateLowerCase(){
  return String.fromCharCode(getRndInteger(97,123));        //a-97, z-123
}

function generateUpperCase(){
  return String.fromCharCode(getRndInteger(65,91));        //a-65, z-91
}

function generateSymbol(){
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength(){
  let hasUpper = false; 
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;
  
  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");     //green
  } else if (
    (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
    setIndicator("#ff0");     //green
  } else {
    setIndicator("#f00");     //white
  }
}

async function copyContent(){
  try{
    await navigator.clipboard.writeText(passwordDisplay.value);  //await - jab tak complete na ho aage na jaye
    copyMsg.innerText = "Copied";
  }
  catch(e){
    copyMsg.innerText = "Failed";
  }
  //to make copy wala span visible
  copyMsg.classList.add("active");       //css ke ander active class likha hai..wo active hojayega

  setTimeout( () => {                     //2 sec ke bad copied text disappear hojaye
    copyMsg.classList.remove("active");
  },2000);

}

function shufflePassword(array){
  //Algorithm - 'Fishers Yates Method'
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange(){
  checkCount=0;
  allCheckBox.forEach( (checkBox) => {
    if(checkBox.checked){
      checkCount++  ;
    }
  });

  //special checkcount
  if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach( (checkBox) => {
  checkBox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener('click', () => {
  if(passwordDisplay.value)
    copyContent();
});

generateBtn.addEventListener('click', () => {
  //none of the checkbox are selected
  if(checkCount == 0)
    return;                          //no password alloted

  if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
  }

  //let's start the journey to find new password
  console.log("Starting the journey");
  //1.remove old password
  password = "";

  //2.add things according to 'checked' checkboxes
  // if(uppercaseCheck.checked){
  //   password += generateUpperCase();
  // }

  // if(lowercaseCheck.checked){
  //   password += generateLowerCase();
  // }

  // if(numbersCheck.checked){
  //   password += generateRandomNumber();
  // }

  // if(symbolsCheck.checked){
  //   password += generateSymbol();
  // }
  
  //2.compulsory addition + remaining addition
  let funcArr = [];

  if(uppercaseCheck.checked)
    funcArr.push(generateUpperCase);

  if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

  if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);

  if(symbolsCheck.checked)
    funcArr.push(generateSymbol);

  //compulsory addition
  for(let i=0; i<funcArr.length; i++){
    password += funcArr[i]();
  }
  console.log("Compulsory addition Done");

  //remaining addition
  for(let i=0; i<passwordLength-funcArr.length; i++){
    let randIndex = getRndInteger(0, funcArr.length);
    console.log("randIndex" + randIndex);
    password += funcArr[randIndex]();
  }
  console.log("Remaining addition Done");

  //password mai 1st letter - upper, 2nd - lower,etc (to password kis bat ka hame sab pata chal raha hai) 
  //hame strong password banana haii. So,
  
  //3.shuffle the password
  password = shufflePassword(Array.from(password));
  console.log("Shuffling Done");

  //4.show password in UI
  passwordDisplay.value = password;
  console.log("UI addition Done");

  //5.calculate strength
  calcStrength(); 
});
 