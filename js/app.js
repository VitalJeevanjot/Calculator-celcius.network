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
  if (changeBasedOnLA) {
    calculate_ca()
  } else {
    calculate_la()
  }
});


function format(value) {
  if (value >= 1000000000) return (value / 1000000000).toFixed(2) + 'B'
  else if (value >= 1000000) return (value / 1000000).toFixed(2) + 'M'
}

function calculate_ca(e, i) {
  let value_raw_la = loanAmount.value.match(/\d+/g)
  let joined_value
  console.log(value_raw_la)
  if (value_raw_la) {
    joined_value = value_raw_la.join("")
    // coloring border red to show something wrong with this input.
    if (joined_value < 1500) {
      $('#loan-amount').css('border-color', 'red');
    }
    if (joined_value >= 1500) {
      $('#loan-amount').css('border-color', '');
    }
    console.log(joined_value)
    loanAmount.value = formatter.format(joined_value)
    changeBasedOnLA = true
    console.log(i)
    if (i) return; // So Settingup current LA from CA won't reset CA based on current LA
    console.log(i)
    console.log('skipping')
    setColleteralValue(joined_value)
  }
}
function validate_ca() {
  let value_raw_la = loanAmount.value.match(/\d+/g)
  let joined_value
  if (!value_raw_la) {
    loanAmount.value = '$1,500'
    setColleteralValue(1500)
    return
  }
  joined_value = value_raw_la.join("")
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
  //.match(/(\d+(\.\d+)?)/g) good with lazy loading
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
  console.log(init_ltv.match(/\d+/g) / 100)
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


