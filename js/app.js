let listOfValuesOne = [];

function latestData() {
  let dataFromApi = fetch('https://api.celsius.network/api/v3/web/supported_currencies')
    .then(response => {
      return response ? response.json() : ''
    })
    .then(data => {
      if (data && data.length > 0) {
        data.forEach(crypto => {
          listOfValuesOne.push({ name: crypto.name, usd: crypto.usd, interest: crypto.interestRate })
          calculate()
          console.log(crypto)
        })
      } else {
        console.log('No data available!')
      }

    })
}
latestData();


// select elements
var loanAmount = document.getElementById('loan-amount')
var collateralAmmount = document.getElementById('collateral-amount')
// results cel

// results fiat

// other

// desktop elements

// Initialize Default Values

// main logic calculator

// define events
loanAmount.addEventListener('keyup', calculate)
collateralAmmount.addEventListener('keyup', calculate)
//Jquery handlers
$(".currency-btns label").click(function() {
  $(this).addClass('active').siblings().removeClass('active');
  calculate()
});

$(".collateral-ltv-btns label").click(function() {
  $(this).addClass('active').siblings().removeClass('active');
  calculate()
});


function format(value) {
  if (value >= 1000000000) return (value / 1000000000).toFixed(2) + 'B'
  else if (value >= 1000000) return (value / 1000000).toFixed(2) + 'M'
}

let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
});

function calculate() {
  let value_raw_la = loanAmount.value.match(/\d+/g)
  let value_raw_ca = collateralAmmount.value.match(/\d+/g)
  
  let joined_value
  if (!value_raw_la || !value_raw_ca) {
    loanAmount.value = '$1,500'
    setColleteralValue(1500)
  }
  else {
    joined_value = value_raw_la.join("")
    // console.log(joined_value)
    loanAmount.value = formatter.format(joined_value)
    setColleteralValue(joined_value)
  }
  if (joined_value < 1500) {
    loanAmount.value = '$1,500'
    setColleteralValue(1500)
  } else {
    // Change collateral value accordingly as well at start
    // Start loading on pre input when start keep inout readable
    // Stop loading and make input writable 
    // use ltv to colleteral amount
    // Get all coin rates at start (Show loading and toasts if not loaded)
    // If user enter colleteral value and do blur on inp field then get latest coin value (To show fast output to user for next time with latest price)
  }

}
function setColleteralValue(loan_amount) {
  let init_currency = $('.currency-btns > .btn.active').text().trim()
  let init_ltv = $('.collateral-ltv-btns > .btn.active').text().trim()
  console.log(init_ltv.match(/\d+/g)/100)
  document.getElementById("ca_logo").src= "assets/"+init_currency.toLowerCase()+".png"; 
  let elements = listOfValuesOne;
  for (let index = 0; index < elements.length; index++) {
    if (elements[index].name === init_currency) {
      console.log(elements[index].name)
      collateralAmmount.value = ((loan_amount/0.25)/parseFloat(elements[index].usd)).toFixed(6)
      // console.log((loan_amount/0.25)/parseFloat(elements[index].usd).toFixed(6))
      break;
    }
  }
}


