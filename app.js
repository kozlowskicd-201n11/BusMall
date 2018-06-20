'use strict';

Product.names = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

Product.allProducts = [];
Product.pictures = [document.getElementById('left'), document.getElementById('center'), document.getElementById('right')];
Product.listTotal = document.getElementById('listTotal');
Product.imgSection = document.getElementById('allThreeImages');
Product.justBeenViewed = [];
Product.totalClicks = 0;

// PRODUCT OBJECT CONSTRUCTOR -------------
function Product(name) {
  this.name = name;
  if (this.name === 'usb') {
    this.imgPath = 'img/' + name + '.gif';
  }
  else if (this.name === 'sweep') {
    this.imgPath = 'img/' + name + '.png';
  }
  else {
    this.imgPath = 'img/' + name + '.jpg';
  }
  this.votes = 0;
  this.views = 0;
  Product.allProducts.push(this);
}

function makeProducts() {
  for (var i = 0; i < Product.names.length; i++) {
    new Product(Product.names[i]);
  }
}

// RANDOMIZE AND PLACE IMAGES ---------------
function makeRandom() {
  return Math.floor(Math.random() * Product.names.length);
}

function placeImgs() {
  var currentlyShowing = [];
  currentlyShowing[0] = makeRandom();
  while (Product.justBeenViewed.indexOf(currentlyShowing[0]) !== -1) {
    console.log('Duplicate found, rerunning.');
    currentlyShowing[0] = makeRandom();
  }
  currentlyShowing[1] = makeRandom();
  while (currentlyShowing[1] === currentlyShowing[0] || Product.justBeenViewed.indexOf(currentlyShowing[1]) !== -1) {
    console.log('Duplicate found, rerunning.');
    currentlyShowing[1] = makeRandom();
  }
  currentlyShowing[2] = makeRandom();
  while (currentlyShowing[2] === currentlyShowing[1] || currentlyShowing[2] === currentlyShowing[0] || Product.justBeenViewed.indexOf(currentlyShowing[2]) !== -1) {
    console.log('Duplicate found, rerunning.');
    currentlyShowing[2] = makeRandom();
  }
  for (var i = 0; i < 3; i++) {
    Product.pictures[i].src = Product.allProducts[currentlyShowing[i]].imgPath;
    Product.pictures[i].id = Product.allProducts[currentlyShowing[i]].name;
    Product.allProducts[currentlyShowing[i]].views++;
    Product.justBeenViewed[i] = currentlyShowing[i];
  }
  // SET LOCAL STORAGE -----------------------
  var stringData = JSON.stringify(Product.allProducts);
  localStorage.setItem('data', stringData);

}

// CLICK HANDLER -----------------------------
function handleClick(event) {
  if(Product.totalClicks > 23) {
    Product.imgSection.removeEventListener('click', handleClick);
    showTotals();
    makeChart();
  }
  if(event.target.id === 'allThreeImages') {
    return alert('Please click on the image you would like to select.');
  }
  Product.totalClicks += 1;
  console.log('Clicks:' + Product.totalClicks);
  for(var i = 0; i < Product.names.length; i++) {
    if(event.target.id === Product.allProducts[i].name) {
      Product.allProducts[i].votes += 1;
      console.log(event.target.id + ' has ' + Product.allProducts[i].votes + ' votes and has been viewed ' + Product.allProducts[i].views + ' times.');
    }
  }
  placeImgs();
}

//SHOW/HIDE TOTALS ---------------------------------------------
function hideTotals() {
  var ulEl = document.getElementById('listTotal');
  ulEl.parentNode.removeChild(ulEl);
  var imgEl = document.getElementById('allThreeImages');
  imgEl.parentNode.removeChild(imgEl);
  var pEl = document.getElementById('ptag');
  pEl.textContent = 'Study completed, thank you.  Results shown below.';
}

function showTotals() {
  for(var i = 0; i < Product.allProducts.length; i++) {
    var liEl = document.createElement('li');
    liEl.textContent = Product.allProducts[i].name + ' has ' + Product.allProducts[i].votes + ' votes and has been viewed ' + Product.allProducts[i].views + ' times.';
    Product.listTotal.appendChild(liEl);
  }
}
Product.imgSection.addEventListener('click', handleClick);

// CHART ---------------------------------------------
function makeChart() {
  var voteArray = [];

  for (var j = 0; j < Product.allProducts.length; j++) {
    voteArray.push(Product.allProducts[j].votes);
  }

  var colors = ['blue', 'green', 'orange', 'red', 'purple', 'yellow', 'brown', 'maroon', 'forestgreen', 'pink', 'cyan', 'beige', 'grey', 'violet', 'darkblue', 'tan', 'magenta', 'darkgreen', 'tomato', 'darkorange'];

  var ctx = document.getElementById('votechart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Product.names,
      datasets: [{
        label: '# of Votes',
        data: voteArray,
        backgroundColor: colors
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
  hideTotals();
}

// GET LOCAL STORAGE ------------------------------
makeProducts();
(function getStorage() {
  if (localStorage.data) {
    var stringData = localStorage.getItem('data');
    var parsedData = JSON.parse(stringData);
    console.log(parsedData);
    for (var i = 0; i < Product.allProducts.length; i++) {
      Product.allProducts[i].views = parsedData[i].views;
      Product.allProducts[i].votes = parsedData[i].votes;
    }
  }
  else {
    var newData = JSON.stringify(Product.allProducts);
    localStorage.setItem('data', newData);
  }
})();

placeImgs();

