module.exports = {

validateUser: (username, password) => {
    const credentials = JSON.parse(process.env.CREDENTIALS);
    const storedPassword = getObjectInArray(credentials,username);
    return password == storedPassword
    }
}

function getObjectInArray(arr, key) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].hasOwnProperty(key)) return arr[i][key];
    }
}
