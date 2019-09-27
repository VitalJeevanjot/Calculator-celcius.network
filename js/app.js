let listOfValuesOne = []
let changeBasedOnLA = true
let globalMode // d = desktop, m = mobile
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
        calculate_ca(this,0 , 1)
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
// <Mobile> layout events...
$('#currency_select').on('change', function(e){
  activeInaciveSiblings(this, 'm')
});
$('#ltv_select').on('change', function(e){
  activeInaciveSiblings(this, 'm')
});
$('#lt_select').on('change', function(e){
  activeInaciveSiblings(this, 'm')
});
// <Desktop> layout events...
$(".currency-btns label").click(function () {
  $(this).addClass('active').siblings().removeClass('active');
  activeInaciveSiblings(this, 'd')
});

$(".collateral-ltv-btns label").click(function () {
  $(this).addClass('active').siblings().removeClass('active');
  activeInaciveSiblings(this, 'd')
});

$(".lt-btns label").click(function () {
  $(this).addClass('active').siblings().removeClass('active');
  activeInaciveSiblings(this, 'd')
});

function activeInaciveSiblings(ele, mode) {
  globalMode = mode
  calculateCEL(mode)
  calculateFiat(mode)
  if (changeBasedOnLA) {
    calculate_ca(this, 0, mode)
  } else {
    calculate_la(this, 0, mode)
  }
}

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
function calculate_ca(e, i, mode) {
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
    if (i) return; // So Settingup current LA from CA won't reset CA based on current LA
    setColleteralValue(joined_value, globalMode)
    calculateCEL(globalMode)
    calculateFiat(globalMode)
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
  }
}
let old_right_val // Temp variable for calculate_la()
function calculate_la(e, i, mode) {
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
  setLoanValue(joined_value, globalMode)
  calculateCEL(globalMode)
  calculateFiat(globalMode)
}

function setColleteralValue(loan_amount, mode) {
  let init_currency, init_ltv
  if (mode === 'd') {
    init_currency = $('.currency-btns > .btn.active').text().trim()
    init_ltv = $('.collateral-ltv-btns > .btn.active').text().trim()
  } else {
    init_currency = $('#currency_select').find("option:selected").val()
    init_ltv =  $('#ltv_select').find("option:selected").val()
  }
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
  changeBasedOnLA = true
}
function setLoanValue(colleteral_amount, mode) {
  let init_currency, init_ltv
  if (mode === 'd') {
    init_currency = $('.currency-btns > .btn.active').text().trim()
    init_ltv = $('.collateral-ltv-btns > .btn.active').text().trim()
  } else {
    init_currency = $('#currency_select').find("option:selected").val()
    init_ltv =  $('#ltv_select').find("option:selected").val()
  }
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
  changeBasedOnLA = false
}

function calculateCEL(mode) {
  let init_lt, init_ltv
  if (mode === 'm') {
    init_lt = $('#lt_select').find("option:selected").val()
    init_ltv =  $('#ltv_select').find("option:selected").val()
  } else {
    init_lt = $('.lt-btns > .btn.active').attr("value");
    init_ltv = $('.collateral-ltv-btns > .btn.active').text().trim()
  }
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

function calculateFiat(mode) {
  let init_lt, init_ltv
  if (mode === 'm') {
    init_lt = $('#lt_select').find("option:selected").val()
    init_ltv =  $('#ltv_select').find("option:selected").val()
  } else {
    init_lt = $('.lt-btns > .btn.active').attr("value");
    init_ltv = $('.collateral-ltv-btns > .btn.active').text().trim()
  }
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
