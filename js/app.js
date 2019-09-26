let listOfValuesOne = [];
let changeBasedOnLA = true;
let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
});

function latestData() {
  let dataFromApi = fetch('https://api.celsius.network/api/v3/web/supported_currencies')
    .then(response => {
      return response ? response.json() : ''
    })
    .then(data => {
      if (data && data.length > 0) {
        data.forEach(crypto => {
          listOfValuesOne.push({ name: crypto.name, usd: crypto.usd, interest: crypto.interestRate })
        })
        console.log(listOfValuesOne)
        calculate_ca()
      } else {
        console.log('No data available!')
      }

    })
}
latestData();


// select elements
var loanAmount = document.getElementById('loan-amount')
var collateralAmount = document.getElementById('collateral-amount')
var aprCEL = document.getElementById('cel_apr')
var pmCEL = document.getElementById('cel_pm')
var totalCEL = document.getElementById('cel_total')
var aprFiat = document.getElementById('fiat_apr')
var pmFiat = document.getElementById('fiat_pm')
var totalFiat = document.getElementById('fiat_total')
// results cel

// results fiat

// other

// desktop elements

// Initialize Default Values

// main logic calculator

// define lazy load events (on blur)
loanAmount.addEventListener('keyup', calculate_ca)
loanAmount.addEventListener('blur', validate_ca)
collateralAmount.addEventListener('keyup', calculate_la)
//Jquery handlers
$(".currency-btns label").click(function () {
  $(this).addClass('active').siblings().removeClass('active');
  if (changeBasedOnLA) {
    calculate_ca()
  } else {
    calculate_la()
  }
});

$(".collateral-ltv-btns label").click(function () {
  $(this).addClass('active').siblings().removeClass('active');
  calculateCEL()
  calculateFiat()
  if (changeBasedOnLA) {
    calculate_ca()
  } else {
    calculate_la()
  }
});

$(".lt-btns label").click(function () {
  $(this).addClass('active').siblings().removeClass('active');
  calculateCEL()
  calculateFiat()
});

function format (labelValue) {

  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+9

  ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
  // Six Zeroes for Millions 
  : Math.abs(Number(labelValue)) >= 1.0e+6

  ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
  // Three Zeroes for Thousands
  : Math.abs(Number(labelValue)) >= 1.0e+3

  ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

  : Math.abs(Number(labelValue));

}

function getRawLAmount() {
  let value_raw_la = loanAmount.value.match(/\d+/g)
  let joined_value
  if (value_raw_la) { 
    joined_value = value_raw_la.join("")
    return joined_value
  }
  return false
}
function calculate_ca(e, i) {
  if (getRawLAmount()) {
    let joined_value = getRawLAmount()
    // coloring border red to show something wrong with this input.
    if (joined_value < 1500) {
      $('#loan-amount').css('border-color', 'red');
    }
    if (joined_value >= 1500) {
      $('#loan-amount').css('border-color', '');
    }
    loanAmount.value = formatter.format(joined_value)
    changeBasedOnLA = true
    if (i) return; // So Settingup current LA from CA won't reset CA based on current LA
    setColleteralValue(joined_value)
    calculateCEL()
    calculateFiat()
  }
}
function validate_ca() {
  let joined_value
  if (!getRawLAmount()) {
    loanAmount.value = '$1,500'
    setColleteralValue(1500)
    return
  }
  joined_value = getRawLAmount()
  if (joined_value < 1500) {
    loanAmount.value = '$1,500'
    $('#loan-amount').css('border-color', '');
    setColleteralValue(1500)
  } else {
    // Start loading on pre input when start keep inout readable
    // Stop loading and make input writable 
    // use ltv to colleteral amount
    // Get all coin rates at start (Show loading and toasts if not loaded)
    // If user enter colleteral value and do blur on inp field then get latest coin value (To show fast output to user for next time with latest price)
  }
}
let old_right_val // Temp variable for calculate_la()
function calculate_la() {
  let value_raw_ca = collateralAmount.value.match(/^[0-9]*\.?[0-9]*$/)
  let joined_value
  if (value_raw_ca) {
    if (value_raw_ca[0] === '.') {
      value_raw_ca = '0.'
      joined_value = value_raw_ca
    } else {
      old_right_val = value_raw_ca
      joined_value = value_raw_ca.join("")
    }
  }
  if (!value_raw_ca) {
    joined_value = old_right_val.join("")
  }
  collateralAmount.value = joined_value
  changeBasedOnLA = false
  setLoanValue(joined_value)
  calculateCEL()
  calculateFiat()
}

function setColleteralValue(loan_amount) {
  let init_currency = $('.currency-btns > .btn.active').text().trim()
  let init_ltv = $('.collateral-ltv-btns > .btn.active').text().trim()
  let ltv_to_use = init_ltv.match(/\d+/g) / 100
  document.getElementById("ca_logo").src = "assets/" + init_currency.toLowerCase() + ".png";
  let elements = listOfValuesOne;
  for (let index = 0; index < elements.length; index++) {
    if (elements[index].name === init_currency) {
      collateralAmount.value = ((loan_amount / ltv_to_use) / parseFloat(elements[index].usd)).toFixed(6)
      old_right_val = collateralAmount.value.match(/^[0-9]*\.?[0-9]*$/) // init temp variable
      break;
    }
  }
}
function setLoanValue(colleteral_amount) {
  let init_currency = $('.currency-btns > .btn.active').text().trim()
  let init_ltv = $('.collateral-ltv-btns > .btn.active').text().trim()
  let ltv_to_use = init_ltv.match(/\d+/g) / 100
  document.getElementById("ca_logo").src = "assets/" + init_currency.toLowerCase() + ".png";
  let elements = listOfValuesOne;
  for (let index = 0; index < elements.length; index++) {
    if (elements[index].name === init_currency) {
      loanAmount.value = ((colleteral_amount * parseFloat(elements[index].usd)) * ltv_to_use).toFixed(0)
      calculate_ca(this, 1)
      break;
    }
  }
}

function calculateCEL() {
  let init_ltv = $('.collateral-ltv-btns > .btn.active').text().trim()
  let init_lt = $('.lt-btns > .btn.active').attr("value");
  let apr_val = 3.46
  // conditions for ltv
  if (init_ltv === '25%') {
    apr_val = 3.46
  }
  if (init_ltv === '33%') {
    apr_val = 4.87
  }
  if (init_ltv === '50%') {
    apr_val = 6.26
  }
  aprCEL.innerText = apr_val + '%'
  let pm_CEL = ((getRawLAmount()*(apr_val/100))/12).toFixed(2)
  pmCEL.innerText = '$' + format(pm_CEL)
  totalCEL.innerText = '$' + format((init_lt * pm_CEL).toFixed(2))
}

function calculateFiat() {
  let init_ltv = $('.collateral-ltv-btns > .btn.active').text().trim()
  let init_lt = $('.lt-btns > .btn.active').attr("value");
  let apr_val = 4.95
  // conditions for ltv
  if (init_ltv === '25%') {
    apr_val = 4.95
  }
  if (init_ltv === '33%') {
    apr_val = 6.95
  }
  if (init_ltv === '50%') {
    apr_val = 8.95
  }
  aprFiat.innerText = apr_val + '%'
  let pm_Fiat = ((getRawLAmount()*(apr_val/100))/12).toFixed(2)
  pmFiat.innerText = '$' + format(pm_Fiat)
  totalFiat.innerText = '$' + format((init_lt * pm_Fiat).toFixed(2))
}
