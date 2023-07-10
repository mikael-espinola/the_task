const loginButton = document.querySelector(".loginButton");

const data = [
    {
        id: "00-002-547-dfe-b52t-01",
        name: "Mikael da Costa Espínola",
        email: "mikaelespinolaa@gmail.com",
        age: "23",
        password: "mikael99"
    },
    {
        id: "00-002-547-dfe-b52t-02",
        name: "Thiago Benevides Espínola",
        email: "thiagobenevides2112@gmail.com",
        age: "21",
        password: "97082047"
    },
    {
        id: "00-002-547-dfe-b52t-03",
        name: "user",
        email: "user",
        age: "21",
        password: "user"
    },
    {
        id: "00-002-547-dfe-b52t-04",
        name: "admin",
        email: "admin",
        age: "21",
        password: "admin"
    }
];

const validLogin = () => {

    const currentUser = document.querySelector("#loginInputText").value;
    const pass = document.querySelector("#loginInputKey").value;
    let validedlogin = false;

    data.forEach((user) => {
        if(currentUser === user.email && pass === user.password){
            validedlogin = true;
            sessionStorage.setItem("user", user.email);
            console.log(user.id)
            alert(`Welcome ${user.name}!`);
            location.href = "./components/pages/todoPage.html";
        };
    });
    if(!validedlogin) {
        alert("Login or Password wrong! ");
    };
};

loginButton.addEventListener("click", validLogin);