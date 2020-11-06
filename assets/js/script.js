var cardDisplayEl = document.getElementById("cards");
var span = document.getElementsByClassName("close")[0];
var modal = document.getElementById('myModal');
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#searchTxtInput");
var sortInputEl = document.querySelector("#myList");
var historyContainerEl = document.querySelector("#searchDatalist");
var loadMoreEl = document.getElementById("load-more");
var removeHiddenEl = document.querySelector(".loadBtn");
var instructionsEl = document.querySelector(".entry");
var noResultsEl = document.querySelector(".no-results")
var forecastContainerEl = document.querySelector("#forecast");
var todayD = moment().format("MM/DD/YYYY");
var searchResultsTitle = document.querySelector("#searchResultsTitle");
var trailSummaryUL = document.querySelector("#trailSummary");
var trailData;
var firstSliceValue;
var sliceValue;


//create history dropdown elements in hike search field
var createHistoryDropdown = function(){
    //console.log("createHistoryDropdown");
    historyContainerEl.innerHTML = "";
    var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistoryArr"));
    if (searchHistoryArr != null){
        searchHistoryArr = searchHistoryArr.sort();
        //console.log(searchHistoryArr);
        for (var i=0;i<searchHistoryArr.length;i++){
            //console.log(searchHistoryArr[i]);
            var historyListItem = document.createElement("option");
            historyListItem.value = searchHistoryArr[i];
            historyListItem.text = searchHistoryArr[i];
            historyContainerEl.appendChild(historyListItem);
        }
    }
}

//store search in localStorage
var storeSearchHistory = function(searchValue){
    //console.log(searchValue);
    
    //strip search value of leading/trailing spaces and lowercase
    var cleanedSearchValue = searchValue.toLowerCase().trim();
    var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistoryArr"));

    //console.log(searchHistoryArr);

    //if localstorage var doesn't exist
    if (searchHistoryArr === null){
        searchHistoryArr = [];
    }

    //avoids duplicates - if searched value does not already exist in localStorage array, add it
    if (searchHistoryArr.indexOf(cleanedSearchValue) < 0){
        searchHistoryArr.push(cleanedSearchValue);
        localStorage.setItem("searchHistoryArr", JSON.stringify(searchHistoryArr));
    }
}

function getCityCoord(city, state) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + "&units=imperial&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c")
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                getHikingInfo(data.coord.lat, data.coord.lon);
                forecastWeather(data.coord.lat, data.coord.lon, city, data);
                storeSearchHistory(city);
            });
        } else {
            noResultsEl.removeAttribute("id", "hidden");
            instructionsEl.setAttribute("id", "hidden");
            return;
        }
    });
}
/*
var getCityCoord = function(city, state) {
    var apiUrl = "https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + "&units=imperial&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c";

    //console.log(city);

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
          response.json().then(function(data) {
            getHikingInfo(data.coord.lat, data.coord.lon);
            forecastWeather(data.coord.lat, data.coord.lon, city, data);
            storeSearchHistory(city);
          });
        }
        else{
            //console.log("getCityCoord fail");
            noResultsEl.removeAttribute("id", "hidden");
            instructionsEl.setAttribute("id", "hidden");
            return;
        } 
    })
    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        //alert("Unable to connect to OpenWeather.");
    });
};
*/

function forecastWeather(lat, lon, city, nowWeather) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c")
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayForecast(data,nowWeather);
            });
        }
    });
}

/*
var forecastWeather = function(lat, lon, city, nowWeather) {
    var apiUrl = "https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
          response.json().then(function(data) {
            displayForecast(data,nowWeather);
          });
        } 
    })
    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        //alert("Unable to connect to OpenWeather.");
    });
};
*/

//function that gets lat and long ONLY
function getHikingInfo(lat, lon) {
    // console.log(selectedItem);
    fetch("https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&maxDistance=50&maxResults=30&key=200829481-354572aba0151d42b45ec3c006e7cbef")

    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //console.log(data.trails)
                trailData = data.trails;
                displayTrails(data, data.trails)
                //show load more button
                removeHiddenEl.removeAttribute("id", "hidden");
            });
        } else {
            noResultsEl.removeAttribute("id", "hidden");
            return;
        }
    });
}

/*
var getHikingInfo = function(lat, lon) {
    var selectedItem = getSelectedValue();
    //console.log(selectedItem);
    var apiUrl = "https://cors-anywhere.herokuapp.com/https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&maxDistance=50&maxResults=30&key=200829481-354572aba0151d42b45ec3c006e7cbef";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
          response.json().then(function(data) {
            //console.log(data.trails)
            displayTrails(data, data.trails)
            //show load more button
            removeHiddenEl.removeAttribute("id", "hidden");
          });
        } else{
            noResultsEl.removeAttribute("id", "hidden");
            return;
        }
    })
    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        //alert("Unable to connect to OpenWeather.");
    });
};
*/

function displayTrails(data, trails) {
    //remove instructions
    instructionsEl.setAttribute("id", "hidden");
    //clear out previous data
    cardDisplayEl.textContent = "";
    for(var i = 0; i < 6; i++ ) {
        if(trails[i].imgMedium !== "" ) {
            var calloutContainer = document.createElement("div");
            calloutContainer.classList = "column"
            var callout = document.createElement("div");
            callout.classList = "callout";
            var calloutImg = document.createElement("img");
            calloutImg.setAttribute("src", trails[i].imgMedium);
            callout.appendChild(calloutImg);
            calloutContainer.appendChild(callout);
        } else {
            var calloutContainer = document.createElement("div");
            calloutContainer.classList = "column"
            var callout = document.createElement("div");
            callout.classList = "callout";
            var calloutImg = document.createElement("img");
            calloutImg.setAttribute("src", "assets/images/mountain.png");
            //Icons made by <a href="https://www.flaticon.com/authors/pongsakornred" title="pongsakornRed">pongsakornRed</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
            callout.appendChild(calloutImg);
            calloutContainer.appendChild(callout);
        };

        //for title of hike
        var hikeTitle = document.createElement("p");
        hikeTitle.classList = "lead";
        hikeTitle.textContent = trails[i].name;
        callout.appendChild(hikeTitle);

        var hikeLocation = document.createElement('p');
        hikeLocation.classList = "subheader";
        hikeLocation.style = "color: black;"
        hikeLocation.textContent = trails[i].location;
        callout.appendChild(hikeLocation);

        //for discription
        var hikeSummary = document.createElement('p');
        hikeSummary.classList = "subheader";
        hikeSummary.textContent = trails[i].summary;
        callout.appendChild(hikeSummary);

        //button that opens modal
        var modalButton = document.createElement("button");
        modalButton.textContent = "See trail details";
        modalButton.classList.add("modalBtn");
        modalButton.setAttribute("data-id", i);
        modalButton.id = "myBtn";
        callout.appendChild(modalButton);


        // when the user clicks on the button, open modal
        modalButton.onclick = function(e) {
            const thisTrail = trails[parseInt(e.target.dataset.id)]
            showModal(thisTrail);
        }


        searchResultsTitle.innerHTML = "<h2>Hikes<h2>";

        //append all to page
        cardDisplayEl.appendChild(calloutContainer);

    }
}
//when the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

//When the user clicks anywhere outside of modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
//var firstSlice = data.trails.slice(firstSliceValue, sliceValue);
function addSliceValue (event) {
    //event.preventDefault();
    sliceValue += 6;
    firstSliceValue += 6;
    var slicedValue = trailData.slice(firstSliceValue, sliceValue);
    if (sliceValue === 30) {
        removeHiddenEl.setAttribute("id", "hidden")
    }
    slicedResults(slicedValue);
    //console.log(slicedValue);
}

function slicedResults (slicedValue) {
    for(var i = 0; i < slicedValue.length; i++ ) {
        if(slicedValue[i].imgMedium !== "" ) {
            var calloutContainer = document.createElement("div");
            calloutContainer.classList = "column"
            var callout = document.createElement("div");
            callout.classList = "callout";
            var calloutImg = document.createElement("img");
            calloutImg.setAttribute("src", slicedValue[i].imgMedium);
            callout.appendChild(calloutImg);
            calloutContainer.appendChild(callout);
        } else {
            var calloutContainer = document.createElement("div");
            calloutContainer.classList = "column"
            var callout = document.createElement("div");
            callout.classList = "callout";
            var calloutImg = document.createElement("img");
            calloutImg.setAttribute("src", "assets/images/mountain.png");
            //Icons made by <a href="https://www.flaticon.com/authors/pongsakornred" title="pongsakornRed">pongsakornRed</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
            callout.appendChild(calloutImg);
            calloutContainer.appendChild(callout);
        }

        //for title of hike
        var hikeTitle = document.createElement("p");
        hikeTitle.classList = "lead";
        hikeTitle.textContent = slicedValue[i].name;
        callout.appendChild(hikeTitle);

        var hikeLocation = document.createElement('p');
        hikeLocation.classList = "subheader";
        hikeLocation.style = "color: black;"
        hikeLocation.textContent = slicedValue[i].location;
        callout.appendChild(hikeLocation);

        var hikeSummary = document.createElement('p');
        hikeSummary.classList = "subheader";
        hikeSummary.textContent = slicedValue[i].summary;
        callout.appendChild(hikeSummary);

        //button that opens modal
        var modalButton = document.createElement("button");
        modalButton.textContent = "See trail details";
        modalButton.classList.add("modalBtn");
        modalButton.setAttribute("data-id", i);
        modalButton.id = "myBtn";
        callout.appendChild(modalButton);


        // when the user clicks on the button, open modal
        modalButton.onclick = function(e) {
            const thisTrail = slicedValue[parseInt(e.target.dataset.id)]
            showModal(thisTrail);
        }

        //when the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

        //When the user clicks anywhere outside of modal, close it
        window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    //append all to page
    cardDisplayEl.appendChild(calloutContainer);
    }
}


var displayForecast = function(data,nowWeather) {
    //console.log("displayForecast");
    //console.log(data);
    //console.log(nowWeather);

    //weather container content
    forecastContainerEl.textContent = "";

    // check if api returned any forecast data
    if (data.length === 0) {
        forecastContainerEl.textContent = "No forecast data found for " + data.city.name + ".";
        return;
    }

    //create h2 3-day forecast header
    var forecastTitleRow = document.createElement("div");
    forecastTitleRow.classList = "row forecastTitle";
    forecastTitleRow.innerHTML = "<div class='small-12 large-12 columns'><h2>3 Day Forecast for " + data.city.name + "</h2></div>";

    //create forecast container for all the items
    var forecastDaysContainer = document.createElement("div");
    forecastDaysContainer.classList = "row forecastAllContainer";

    // append containers to the dom
    forecastContainerEl.append(forecastTitleRow,forecastDaysContainer);

    //using this variable to populate the forecastData array within the loop over the forecast data returned by the api
    var forecastDataIndex = 1;

    //create array that will contain day objects for the forecast
    let forecastData = [];

    //current day's weather comes from diff source than forecast.  populate first item in array with current weather
    forecastData[0] = {
        "date" : todayD, 
        "icon" : "https://openweathermap.org/img/wn/" + nowWeather.weather[0].icon + ".png", 
        "temp" : nowWeather.main.temp, 
        "humidity" : nowWeather.main.humidity
    };

    nextD = moment().add(1,'days').format("MM/DD/YYYY");

    //loop over api forecast data and build object array for the next 2 days
    for (var apiFCData=0;apiFCData<data.list.length;apiFCData++){
        //console.log("apiFCData loop " + apiFCData + " : " + moment(data.list[apiFCData].dt_txt).format("MM/DD/YYYY"));
        if (nextD == moment(data.list[apiFCData].dt_txt).format("MM/DD/YYYY")){
            //console.log("nextD : " + nextD);

            forecastData[forecastDataIndex] = {
                "date" : nextD, 
                "icon" : "https://openweathermap.org/img/wn/" + data.list[apiFCData].weather[0].icon + ".png", 
                "temp" : data.list[apiFCData].main.temp, 
                "humidity" : data.list[apiFCData].main.humidity
            };
            
            //increment forecastDataIndex by 1 to populate the array objects
            forecastDataIndex = forecastDataIndex+1;

            //increment nextD by 1 day
            nextD = moment(new Date(nextD)).add(1,'days').format("MM/DD/YYYY");
        }
    }
    //console.log(forecastData);

    //loop over forecastData array to build html objects
    for (var i=0;i<3;i++){
        //console.log(forecastData[i].date);
        
        var forecastDayParentContainer = document.createElement("div");
            forecastDayParentContainer.classList = "small-12 medium-12 large-4 columns forecastDayContainer";
        var forecastDayChildContainer = document.createElement("div");
            forecastDayChildContainer.classList = "forecastDayItem";
        var forecastDayDateEl = document.createElement("div");
            forecastDayDateEl.classList = "forecastDate";
            forecastDayDateEl.innerText = forecastData[i].date;
        var forecastDayIconEl = document.createElement("div");
            var weatherIcon = document.createElement("img");
            weatherIcon.setAttribute("src", forecastData[i].icon);
            forecastDayIconEl.append(weatherIcon);
        var forecastDayTempEl = document.createElement("div");
            forecastDayTempEl.innerText = "Temp: " + forecastData[i].temp + String.fromCharCode(176) + "F";
        var forecastDayHumidyEl = document.createElement("div");
            forecastDayHumidyEl.innerText = "Humidity: " + forecastData[i].humidity + "%";

        //add individual elements to the parent forecastDayContainerEl
        forecastDayChildContainer.append(forecastDayDateEl,forecastDayIconEl,forecastDayTempEl,forecastDayHumidyEl);
        forecastDayParentContainer.append(forecastDayChildContainer);
        //add container to the dom
        forecastContainerEl.append(forecastDayParentContainer);
        
    }
}

//function that changes the textContent of each data. based on the data.attribute set
function showModal(data){
    modal.style.display = "block";
    trailSummaryUL.innerHTML = "";

    if (data.validationmsg){
        modal.querySelector("h3").innerHTML = data.validationmsg;
        return;
    }else{

        modal.querySelector("h3").innerHTML = "Trail Summary";

        var tr_difficulty = document.createElement("li");
        tr_difficulty.setAttribute("id", "tr_length");
        tr_difficulty.textContent = "Difficulty: " + data.difficulty;

        var tr_length = document.createElement("li");
        tr_length.setAttribute("id", "tr_length");
        tr_length.textContent = "Length: " + data.length + " mi";

        var tr_rating = document.createElement("li");
        tr_rating.setAttribute("id", "tr_rating");
        tr_rating.textContent = "Rating: " + data.stars + " / 5";

        var tr_ascent = document.createElement("li");
        tr_ascent.setAttribute("id", "tr_ascent");
        tr_ascent.textContent = "Ascent: " + data.ascent + " ft";

        var tr_descent = document.createElement("li");
        tr_descent.setAttribute("id", "tr_descent");
        tr_descent.textContent = "Descent: " + data.descent + " ft"; 

        trailSummaryUL.append(tr_difficulty,tr_length,tr_rating,tr_ascent,tr_descent);
    }
}

var formSubmitHandler = function(event){
    event.preventDefault();

    //console.log(event);
       //slicing data to display on page
       firstSliceValue = 0
       sliceValue = 6

    // get value from input element
    var searchValue = searchInputEl.value.trim();

    //console.log(searchSort);

    if (searchValue) {
        getCityCoord(searchValue);
        searchInputEl.value = "";
        searchInputEl.blur();
    } else {
        searchInputEl.value = "";
        searchInputEl.blur();
        var data = {};
        data.validationmsg = "Please enter a valid city.";
        showModal(data);
    }
}

//event listeners
searchFormEl.addEventListener("submit", formSubmitHandler);
searchInputEl.addEventListener("focus", createHistoryDropdown);