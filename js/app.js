let listOfValuesOne = [];
let dataFromApi = fetch('https://api.celsius.network/api/v3/web/supported_currencies')
.then(response => {
  return response ? response.json() : ''
})
.then(data => {
  if (data && data.length > 0) {
    data.forEach(crypto => {
      listOfValuesOne.push({name: crypto.name,usd: crypto.usd, interest: crypto.interestRate})
      console.log(crypto)
    })
  } else {
    console.log('No data available!')
  }

})

function formatNumber(num) {
    return num.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
function format(value) {
    return (value / 1000000).toFixed(2) + 'M';
}

// select elements
var loanAmmount = document.getElementById('loan-amount');
var collateralAmmount = document.getElementById('collateral-amount')
// results cel

// results fiat

// other

// desktop elements



// main logic calculator

// define events
loanAmmount.addEventListener('keyup', calculate)
// collateralAmmount.addEventListener('keyup', calculateCollateralAmmount)

// Formatting Input Values
function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
function format(value) {
  if (value >= 1000000000) return (value / 1000000000).toFixed(2) + 'B';
  else if (value >= 1000000) return (value / 1000000).toFixed(2) + 'M';
}


function calculate () {
  let us_value = formatNumber(loanAmmount.value) // "$1,000.00"
  loanAmmount.value = '$' + us_value
  let value_raw = loanAmmount.value.match(/\d+/g).join("")
  console.log(value_raw)
}


