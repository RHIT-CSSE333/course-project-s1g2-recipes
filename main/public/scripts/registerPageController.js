class RegisterPageController{
    constructor(){
        let btn = document.querySelector('#loginButton');
        let usernameBox = document.querySelector('#username');
        let passwordBox = document.querySelector('#password');
        let nameBox = document.querySelector('#name');
        
        btn.addEventListener('click', ()=>{
            let username = usernameBox.value;
            let password = passwordBox.value;
        
            if(!username || !password){
                alert('Please enter a valid username and password');
                return;
            }
            let obj = {
                'username': username,
                'password': password
            };
            let action = '';
            if(nameBox){
                action = '/register';
                let name = nameBox.value;
                if(!name){
                    alert('Please enter a valid name')
                    return;
                }
                obj.name = name;
            }
            else
                action = '/login';        
            fetch(action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                if(data.val == 4)
                    alert('Username Already Taken');
                else if(data.val != 0)
                    alert('Invalid Fields');
                else{
                    rhit.auth.signIn();
                }
            })
        })
    }
}
