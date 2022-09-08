var otherRoles = document.getElementById("otherRoles");
var rolesNewUser = document.getElementById("rolesNewUser");
var table = document.getElementById("overview");
var userName = document.getElementById("name");
var jsonData = document.getElementById("jsonData")
var body = document.getElementById("body");
var buttonsMap = new Map();
var dataUsers, dataUser;
var dataRoles = [],
    rightsRows = { "user": 0, "admin": 1, "owner": 2 };

fetchNormal = (bodyHere, url, method) => {
    fetch(url, {
        body: bodyHere,
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
        },
        keepalive: true,
        method: method
    }).then(function (res) {
        window.location.reload();
    })
        .catch(function (res) {
            console.log(res);
        });
};

const getHighestRole = (RoleMyUser) => {
    var highRole = "";
    for (let x = 0; x < RoleMyUser.length; x++) {
        const element = RoleMyUser[x];
        if (element == "owner")
            return 3;
        if (element == "admin")
            highRole = 2;
        if (element == "user")
            if (highRole == "")
                highRole = 1;
    }
    return highRole;
};
createRole = () => {
    var nameNewRole = document.getElementById("nameNewRole").value,
        textNewRole = document.getElementById("textNewRole").value,
        includedRoles = [];

    for (let x = 0; x < dataRoles.length; x++) {
        const element = dataRoles[x];
        var rolesIncluded = document.getElementById("rolesIncluded" + String(x));
        if (rolesIncluded.checked == true)
            includedRoles.push(element.name);
    }

    const send = {
        name: nameNewRole,
        notices: textNewRole,
        includes: includedRoles
    }
    fetchNormal(JSON.stringify(send), '/login/newRole', 'POST');
};
fetchRoles = (data) => {
    let roles = document.createElement("p");
    roles.innerHTML = JSON.stringify(data);
    document.getElementById("modalInfo").appendChild(roles);
    for (let x = 0; x < data.length; x++) {
        const element = data[x];
        if (getHighestRole(dataUser.roles) >= getHighestRole([element.name])) {
            // create new role
            var role = document.createElement("a"),
                roleSelect = document.createElement("input");
            roleSelect.type = "checkbox";
            roleSelect.id = "rolesIncluded" + String(x);
            role.innerHTML = element.name;
            role.appendChild(roleSelect);
            otherRoles.appendChild(role);
            // use role by new user
            var roleNewUser = document.createElement("a"),
                roleSelectNewUser = document.createElement("input");
            roleSelectNewUser.type = "checkbox";
            roleSelectNewUser.id = "rolesNewUser" + String(x);
            roleNewUser.innerHTML = element.name;
            roleNewUser.appendChild(roleSelectNewUser);
            rolesNewUser.appendChild(roleNewUser);
        }
    }
}

signUp = () => {
    var nameUser = document.getElementById("nameNewUser").value,
        emailUser = document.getElementById("emailNewUser").value,
        pwdUser = document.getElementById("pwdNewUser").value,
        pwdUserRpe = document.getElementById("pwdNewUserRpe").value;

    var includedRoles = [];
    for (let x = 0; x < dataRoles.length; x++) {
        const element = dataRoles[x];
        var rolesIncluded = document.getElementById("rolesNewUser" + String(x));
        if (rolesIncluded.checked == true) {
            includedRoles.push(element.name);

        }
    }
    if (pwdUser == pwdUserRpe) {
        const send = {
            name: nameUser,
            email: emailUser,
            pwd: pwdUser,
            roles: includedRoles,
        }
        fetchNormal(JSON.stringify(send), '/login/newUser', 'POST');
    } else {
        confirm("Your password isnt correct");
    }
}

fetch("/login/fetchdata").then(function (response) {
    return response.json();
}).then(function (data) {
    let sortJSON = data;
    dataUsers = data;
    writeOverview(data);
}).catch(function (error) {
    console.log("error: " + error);
});

writeOverview = (data) => {
    fetch("/login/fetchdataUser").then(function (response) {
        return response.json();
    }).then(function (dataUserHere) {
        dataUser = dataUserHere;
        userName.innerText = dataUserHere.name;
        var inString = false,
            JSONval = false;
        let jsonS = JSON.stringify(dataUserHere, null, 4);
        for (let x = 0; x < jsonS.length; x++) {
            const element = jsonS[x];
            var createSpan = document.createElement("span");
            createSpan.innerText = element;
            if (element == '"') {
                createSpan.style = "color: red";
                if (inString == true && JSONval == true)
                    JSONval = false;
                inString = !inString;
            }
            if (inString == true && JSONval == false)
                createSpan.style = "color: brown";
            if (JSONval == true && inString == true)
                createSpan.style = "color: blue";
            if (element == ":")
                JSONval = true;
            if (inString == false && JSONval == true && element != " " && Number(element) == 0) {
                createSpan.style = "color: darkgreen";
                JSONval = false;
            }
            if (inString == false && JSONval == true && jsonS[x] + (jsonS[x + 1] + jsonS[x + 2] + jsonS[x + 3] + jsonS[x + 4]) == "false") {
                createSpan.style = "color: darkorange";
                createSpan.innerText = jsonS[x] + (jsonS[x + 1] + jsonS[x + 2] + jsonS[x + 3] + jsonS[x + 4]);
                JSONval = false;
                x = x + 4;
            }
            jsonData.appendChild(createSpan);
        }
        for (let x = 0; x < data.length; x++) {
            const element = data[x];
            // elements search
            buttonsMap.set(x * 200, x);
            const f = x * 200;
            dataUsers[x].buttonCreated = false;
            // create row 
            var row = document.createElement("tr");
            // user
            var user = document.createElement("td");
            user.innerText = element.name;
            row.appendChild(user);
            // email
            var emailColum = document.createElement("td");
            var email = document.createElement("span");
            email.innerText = element.email + " ";
            emailColum.appendChild(email);
            for (let y = 0; y < element.roles.length; y++) {
                const elementHere = element.roles[y];
                var rolesHere = document.createElement("span");
                rolesHere.innerHTML = elementHere + " ";
                rolesHere.style = "color: green;";
                emailColum.appendChild(rolesHere);
            }
            row.appendChild(emailColum);
            // password
            var fieldPWD = document.createElement("input");
            fieldPWD.onkeyup = () => { focusPwd(buttonsMap.get(f)); };
            fieldPWD.id = "pwd" + String(x);
            var pwd = document.createElement("td");
            pwd.id = "inputField" + String(x);
            fieldPWD.placeholder = element.pwd;
            pwd.appendChild(fieldPWD);
            row.appendChild(pwd);
            //
            var op = document.createElement("td");
            if (getHighestRole(element.roles) < getHighestRole(dataUser.roles)) {
                //  if (element.roles.includes("owner") == false) {
                // options
                var opField = document.createElement("button");
                opField.className = "options";
                opField.innerText = "...";
                // button
                opField.onclick = function () {
                    openMenu(buttonsMap.get(f));
                };
                op.appendChild(opField);
                // use buttons
                var useableOp = document.createElement("div");
                useableOp.id = "dropDown" + String(x);
                useableOp.className = "dropdown-content";
                var deleteUserBtn = document.createElement("a");
                deleteUserBtn.innerHTML = "L&ouml;schen Benutzer";
                useableOp.id = "div" + String(x);
                deleteUserBtn.onclick = function () {
                    deleteUser(buttonsMap.get(f));
                };
                useableOp.appendChild(deleteUserBtn);
                // Benutzer deaktivieren
                var deaktivateUserBtn = document.createElement("a");
                if (element.deaktivated == true) {
                    deaktivateUserBtn.innerHTML = "Benutzer aktivieren";
                    deaktivateUserBtn.onclick = function () { deaktivateUser(buttonsMap.get(f), false); };
                    row.className = "deaktivated";
                }
                if (element.deaktivated == false) {
                    deaktivateUserBtn.innerHTML = "Benutzer deaktivieren";
                    deaktivateUserBtn.onclick = function () { deaktivateUser(buttonsMap.get(f), true); };
                }
                useableOp.appendChild(deaktivateUserBtn);
                op.appendChild(useableOp);
            } else {
                var opField = document.createElement("button");
                opField.className = "options admin";
                opField.innerText = "A";
                opField.title = "This is an admin";
                op.appendChild(opField);
            }
            row.appendChild(op);
            // add row to table
            table.appendChild(row);

        }
        fetch("/login/fetchRoles").then(function (response) {
            return response.json();
        }).then(function (dataNew) {
            fetchRoles(dataNew);
            dataRoles = dataNew;
        }).catch(function (error) {
            console.log("error: " + error);
        });
    }).catch(function (error) {
        console.log("error: " + error);
    });
}
openMenu = (x) =>
    document.getElementById("div" + String(x)).classList.toggle("show");

deleteUser = (x) => {
    const send = {
        email: dataUsers[x].email,
    }
    fetchNormal(JSON.stringify(send), '/login/deleteUser', 'DELETE');
}
deaktivateUser = (x, state) => {
    const send = {
        email: dataUsers[x].email,
        roles: dataUsers[x].roles,
        deaktivate: state
    }
    fetchNormal(JSON.stringify(send), '/login/updateAble', 'POST');
};
focusPwd = (x) => {
    // console.log(x);
    var y = new Map();
    y.set("now", x)
    if (dataUsers[x].buttonCreated == false) {
        dataUsers[x].buttonCreated = true;
        var field = document.getElementById("inputField" + String(x)),
            button = document.createElement("button");
        button.className = "pwdChange";
        button.innerText = "Change";
        button.onclick = () => {
            changePwd(y.get("now"));
        };
        field.appendChild(button);
    }
}
changePwd = (which) => {
    const send = {
        email: dataUsers[which].email,
        pwd: document.getElementById("pwd" + String(which)).value
    };
    if (confirm("Change Password") == true)
        fetchNormal(JSON.stringify(send), '/login/updatePWD', 'PUT');
}

openNewUserTools = () => {
    if (getHighestRole(dataUser.roles) > 1) {
        document.getElementById('id01').style.display = 'block';
    }
}
openNewRoleTools = () => {
    if (getHighestRole(dataUser.roles) > 2) {
        document.getElementById('id03').style.display = 'block';
    }
}

var modeNow = true;
modes = () => {
    var mode = document.getElementById("mode");
    if (modeNow == true) {
        mode.innerText = "Lightmode";
        table.className = "darkmodeTable";
        body.className = "bodyDarkmode";
    } else {
        mode.innerText = "Darkmode";
        table.className = "lightmodeTable";
        body.className = "bodyLightmode";
    }
    modeNow = !modeNow;
};

logout = () => {
    fetch("/login/logout", {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
        },
        keepalive: false,
        method: 'GET'
    }).then(function (res) {
        preventBack();
        window.location.reload();

    })
        .catch(function (res) {
            console.log(res);
        });
}

function preventBack() {
    window.history.forward();
}

window.onunload = function () {
    null
};


fetch("https://ipinfo.io/json?token=162056640cac1f").then(
    (response) => response.json()
).then((jsonReponse) => {
    fetch("/logger/userInfos", {
        body: JSON.stringify({
            "sys": navigator.userAgent,
            "lang": navigator.languages,
            "dev": navigator.mediaDevices,
            "mediasessons": navigator.mediaSession,
            "worker": navigator.serviceWorker,
            "storage": navigator.storage,
            "webdriver": navigator.webdriver,
            "ip": jsonReponse,
            "hacker": false
        }),
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
        },
        method: 'POST'
    }).then(function (res) {
        // console.log(res.json());
    })
        .catch(function (res) {
            console.log(res);
        });
})