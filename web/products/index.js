// js file for product service
var tableProducts = document.getElementById("tableProducts");
var writed = [];
var counter = 0;
var counterElements = 0;
var costComplete = 0;
var windowAlert = document.getElementById("windowAlert"),
    headingAlertWindow = document.getElementById("headingAlertWindow"),
    textAlertWindow = document.getElementById("headingAlertWindow");
// Create a Map
var elementsUse = new Map();
var nameElement = document.getElementById("name");
var noticesElement = document.getElementById("notices");
// Get the modal
var modal = document.getElementById("myModal");
var licens = document.getElementById("licens");
// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close2")[0];

var modalText = document.getElementById("textModal");
var modalHTML = document.getElementById("htmlModal");

fetchNormal = (bodyHere, url, method) => {
    fetch(url, {
            body: bodyHere,
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
            },
            keepalive: true,
            method: method
        }).then(function(res) {
            window.location.reload();
        })
        .catch(function(res) {
            console.log(res);
        });
};

// JavaScript code
function search() {
    let input = document.getElementById('searchField').value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName('elementsTable');
    for (i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = 'none';
        } else {
            x[i].style.display = 'table-row';
        }
    }
    // console.log("Pressed");

}

function noticeShow(z) {

    let textModal = writed[z].notices;
    textModal = textModal.replace('\n', '');
    let htmlToDisplay = writed[z].notices;
    htmlToDisplay = htmlToDisplay.replace('\n', '');

    modalHTML.innerText = htmlToDisplay;
    modal.style.display = "block";
    modalText.innerHTML = textModal;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function sending() {
    if (nameElement.value != "") {
        let sendText = {
            "name": nameElement.value.trimEnd(),
            "notices": noticesElement.value,
            "price": 0,
            "pieces": 0,
            "tags": nameElement.value.trimEnd()
        };
        fetchNormal(JSON.stringify(sendText), '/productManagement/newProduct', 'POST');
    } else {
        alert("Bitte nehme einen anderen Namen, \n der Name ist schon vergeben in der Datenbank !\n und benutze einen Namen und eine Notiz !");
    }
}

function sendElementSold() {
    var piecesElements = Number(document.getElementById("piecesElements").value);
    var elementCost = Number(document.getElementById("costElement").value);
    var selectName = document.getElementById("selectProduct").value;
    var id = 0;
    console.log(selectName)
    for (let y = 0; y < writed.length; y++) {
        if (writed[y].id == selectName) {
            console.log("Hi")
            id = writed[y].id;
        }
    }
    if (selectName == "Select something") {
        openAlertWindow("Leer", "Bitte w&auml;hlen sie etwas aus !");
    } else {
        let sendText = {
            "id": id,
            "price": elementCost,
            "pieces": piecesElements
        };
        console.log(sendText)
        fetchNormal(JSON.stringify(sendText), '/productManagement/updateProduct', 'PUT');
    }
}



fetch("/productManagement/fetchdata").then(function(response) {
    return response.json();
}).then(function(data) {
    console.log(data);
    let sortJSON = data;
    write(sortJSON);
}).catch(function(error) {
    console.log("error: " + error);
});

function write(data) {
    // console.log(data);
    if (Array.isArray(data) == true) {
        var dataNew = [];
        dataNew = data;
        const elements = document.getElementById("newBlogs");
        //console.log("is array");
        for (var x = 0; x < dataNew.length; x++) {



            elementsUse.set(counter * 200, counter);
            const f = counter * 200;
            var p = x;
            var row = document.createElement("tr");
            tableProducts.appendChild(row);
            var product = document.createElement("td");
            product.innerHTML = data[x].name;
            var notices = document.createElement("div");
            var noticeClick = document.createElement("i");
            var noticeText = document.createElement("a");
            noticeClick.className = "fa fa-caret-down";
            var g = document.createElement("td");
            var strChars = data[x].notices.split("<");
            noticeText.innerHTML = " " + strChars[0];
            notices.appendChild(noticeText);
            notices.appendChild(noticeClick);
            g.onclick = function() {
                console.log(elementsUse.get(f));
                noticeShow(elementsUse.get(f));
            };
            g.appendChild(notices);
            notices.className = "noticeTable";
            var pieces = document.createElement("td");
            pieces.innerText = dataNew[x].pieces;
            pieces.className = "piecesElements";
            var euros = document.createElement("td");
            euros.innerHTML = dataNew[x].price + " &euro;";
            var used = document.createElement("td");
            row.append(product, g, pieces, euros, used);
            row.className = "elementsTable";
            tableProducts.appendChild(row);

            var dropdown = document.createElement("div");
            dropdown.className = "dropdown";
            var doropbtn = document.createElement("button");
            doropbtn.className = "dropbtn";
            doropbtn.innerText = "Aktionen";
            var ico = document.createElement("i");
            ico.className = "fa fa-caret-down";
            doropbtn.appendChild(ico);
            var selectorField = document.createElement("div");
            selectorField.className = "dropdown-content";
            selectorField.id = "div" + String(x);
            for (let c = 0; c < 4; c++) {

                var y = document.createElement("a");
                switch (c) {
                    case 0:
                        y.innerText = "1 Aufbrauchen";
                        y.onclick = function() {
                            console.log(elementsUse.get(f));
                            useProduct(elementsUse.get(f));
                        };
                        break;
                    case 1:
                        y.innerText = "Alle Aufbrauchen";
                        y.onclick = function() {
                            console.log(elementsUse.get(f));
                            useAllPoduct(elementsUse.get(f));
                        };
                        break;
                    case 2:
                        y.innerHTML = "L&ouml;schen";
                        y.onclick = function() {
                            console.log(elementsUse.get(f));
                            deletePoduct(elementsUse.get(f));
                        };
                        break;
                    case 3:
                        y.innerHTML = data[p].time;
                        break;
                }
                selectorField.appendChild(y);
            }
            dropdown.appendChild(selectorField);
            dropdown.appendChild(doropbtn);
            used.appendChild(dropdown);
            tableProducts.appendChild(row);
            var option = document.createElement("option");
            option.innerHTML = data[x].name;
            option.value = data[x].id;
            document.getElementById("selectProduct").appendChild(option);
            writed[counter] = dataNew[x];
            counter++;
        }
    } else {
        console.log("Don't work !");
    }
}
var body = document.getElementById("body");
var state = true;

function openForm2() {
    document.getElementById("myForm2").style.display = "block";
}

function closeForm2() {
    document.getElementById("myForm2").style.display = "none";
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function loadData() {
    console.log("Loaded");
}

function deletePoduct(z) {
    if (confirm("Are you sure?") == true) {
        let sendText = {
            "id": writed[z].id
        }
        console.log(sendText);
        fetchNormal(JSON.stringify(sendText), '/productManagement/deleteProduct', 'DELETE');

    } else {
        // console.log("OK");
    }
}

function useProduct(z) {
    // console.log(writed[z].product);
    if (writed[z].pieces > 1) {
        let sendText = {
            "id": writed[z].id,
            "notices": writed[z].notices,
            "price": -(writed[z].price / writed[z].pieces),
            "pieces": -1,
        };
        fetchNormal(JSON.stringify(sendText), '/productManagement/updateProduct', 'PUT');

    }
}

function useAllPoduct(z) {
    if (writed[z].pieces >= 1) {
        let sendText = {
            "id": writed[z].id,
            "notices": writed[z].notices,
            "price": -(writed[z].price),
            "pieces": -writed[z].pieces,
        };
        fetchNormal(JSON.stringify(sendText), '/productManagement/updateProduct', 'PUT');
    }
}
Array.prototype.sortBy = function(p) {
    return this.slice(0).sort(function(a, b) {
        return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
    });
}

function closeAlertWindow() {
    windowAlert.style.display = "none";
}
closeAlertWindow();

function openAlertWindow(heading, text) {
    headingAlertWindow.innerHTML = heading;
    textAlertWindow.innerHTML = text;
    windowAlert.style.display = "block";
    setTimeout(function() {
        closeAlertWindow();
    }, 4000);
}

function showLicens() {
    licens.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
    licens.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        licens.style.display = "none";
    }
}

sortTable = (n, num) => {
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = tableProducts.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (num == false) {
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            } else if (num == true) {
                if (dir == "asc") {
                    if (Number(x.innerHTML) > Number(y.innerHTML)) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (Number(x.innerHTML) < Number(y.innerHTML)) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}