var toView;
var isBeingUpdated;
var offset = 0;
var DataToUpdate = new Map();

callAll = ()=>{
    fetch("http://localhost:8080/api/kunde/getAll")
    .then(res => res.json())
    .then(posts => viewCostumers(posts));
}

viewCostumers = (json)=>{
    deleteElements("costumer");
    deleteElements("costumer");
    deleteElements("costumer");
    deleteElements("costumer");
    var costumersTable = document.getElementById('costumers');
    isBeingUpdated = new Array(json.length);
    for(let i = 0; i < json.length; i++){
        let imgDrop = document.createElement('img');
        imgDrop.src = "rubbish.png";
        imgDrop.className="img";

        let imgUpdate = document.createElement('img');
        imgUpdate.src ="pen.png";
        imgUpdate.className = "img";

        let id = document.createTextNode(json[i].kundeid);
        let vorname = document.createTextNode(json[i].vorname);
        let nachname = document.createTextNode(json[i].nachname);
        let adresseid = document.createTextNode(json[i].adresseid);
        let messlokationid = document.createTextNode(json[i].messlokationid);

        let idtd = document.createElement('td');
        let vornametd = document.createElement('td');
        let nachnametd = document.createElement('td');
        let adresseidtd = document.createElement('td');
        let messlokationidtd = document.createElement('td');
        let drop = document.createElement('td');
        let update = document.createElement('td');

        update.innerHTML = '<button id="u'+i+'" class = "Bimg" ' + '" onclick="Update(this)" ><img  src="pen.png" class="img" ></button>';
        drop.innerHTML = '<button id="d'+i+'" class = "Bimg" ' + '" onclick="Delete(this)" ><img  src="rubbish.png" class="img" ></button>';

        idtd.appendChild(id);
        vornametd.appendChild(vorname);
        nachnametd.appendChild(nachname);
        adresseidtd.appendChild(adresseid);
        messlokationidtd.appendChild(messlokationid);

        let tr = document.createElement('tr');
        tr.className = "costumer";

        tr.appendChild(idtd);
        tr.appendChild(vornametd);
        tr.appendChild(nachnametd);
        tr.appendChild(adresseidtd);
        tr.appendChild(messlokationidtd);
        tr.appendChild(update);
        tr.appendChild(drop);

        tr.id = i;

        costumersTable.appendChild(tr);

        isBeingUpdated[i] = false;
    }
}

Delete = async (button)=>{
    let elementid = parseInt(button.id.substring(1));
    let kundeid1 = document.getElementById(elementid).children[0].innerHTML;
    console.log(kundeid1);
    let toPost = {
        kundeid: kundeid1,
        vorname: null,
        nachname: null,
        messlokationid: null,
        adresseid: null                 
    }
    console.log(JSON.stringify(toPost));
    makeRequest("delete","http://localhost:8080/api/kunde/",toPost);

   setTimeout(() =>callAll(), 500);
}

Update = async (button)=>{
    let id = parseInt(button.id.substring(1));
    let operation = button.id.substring(0,1);

    
    let td = document.getElementById(id).children;
    if( isBeingUpdated[id] == false){
        isBeingUpdated[id] = !isBeingUpdated[id]; 
        DataToUpdate.set(id, {
            kundeid: td[0].innerHTML,
            vorname: td[1].innerHTML,
            nachname: td[2].innerHTML,
            messlokationid: td[4].innerHTML,
            adresseid: td[3].innerHTML, 
        });

        console.log(JSON.stringify(DataToUpdate.get(id)));

        for(let i = 0; i <5; i++){
            console.log(td[i].offsetWidth);
            let textfield = document.createElement('input');
            textfield.type = "text";
            textfield.className = "updateTextField";
            textfield.style.width = (td[i].offsetWidth-18)+"px";
            textfield.value = td[i].innerHTML;
            td[i].innerHTML = "";
            td[i].appendChild(textfield);
        }

        td[5].children[0].style.boxShadow = "inset 0px 2px 6px 1px rgba(49, 45, 45, 0.2)";

        var t = document.createElement("td");
        t.style.textAlign = "center";
        t.colSpan = "6";
        t.id = "p"+id;
        
        t.innerHTML ='<button onclick = "Update(this)" class = "saveButton" id="s'+id +'" >speichern</button>';      
        document.getElementById("costumers").insertBefore(t, document.getElementById("costumers").children[id+2+offset]);

        offset++;
    }else{
        console.log(operation);
        if(operation  == "u"){
            console.log("save operation.................................................")
            isBeingUpdated[id] = !isBeingUpdated[id]; 
            let CostumerData = DataToUpdate.get(id);
            td[0].innerHTML = CostumerData.kundeid;
            td[1].innerHTML = CostumerData.vorname;
            td[2].innerHTML = CostumerData.nachname;
            td[3].innerHTML = CostumerData.adresseid;
            td[4].innerHTML = CostumerData.messlokationid;
                
            
                
            td[5].children[0].style.boxShadow = " 0px 2px 6px 1px rgba(49, 45, 45, 0.2)";
            document.getElementById("p"+(id)).remove();
            offset--;
        }else{

            isBeingUpdated[id] = !isBeingUpdated[id]; 

            updatedData = {
                kundeid: translateS(td[0].children[0].value),
                vorname: translateS(td[1].children[0].value),
                nachname: translateS(td[2].children[0].value),
                messlokationid: translateS(td[4].children[0].value),
                adresseid: translateS(td[3].children[0].value) 
            }

            for(let i = 0; i <5; i++){
                let text = document.createTextNode(td[i].children[0].value);
                td[i].innerHTML = "";
                td[i].appendChild(text);
            }

            makeRequest("put","http://localhost:8080/api/kunde/",[
                {
                    kundeid : DataToUpdate.get(id).kundeid
                }, updatedData
            ]);

            td[5].children[0].style.boxShadow = " 0px 2px 6px 1px rgba(49, 45, 45, 0.2)";
            document.getElementById("p"+(id)).remove();
            offset--;
        }
       
    }
   
}

deleteElements = (className) =>{
    var elements = document.getElementsByClassName(className);
    for(let i = 0; i < elements.length; i++){
        console.log(elements[i]);
        elements[i].remove();
    }
}

makeRequest = ( reqmethod, url, toPost)=>{
    const options = {
        method: reqmethod,
        body: JSON.stringify(toPost),
        headers: new Headers({
            'Content-Type' : 'application/json'
        })
    };
    console.log(options.body)
    fetch(url,options)
    .then(res => res.json())
    .then(res => console.log(res));
    

    
}

async function updateSearch(){
    let vornameT = document.getElementById('vorname').value;
    let nachnameT = document.getElementById('nachname').value;
    let id = document.getElementById('kundeid').value;
    let adresseidT = document.getElementById('adresseid').value;
    let messlokationidT = document.getElementById('messlokationid').value;

    let addRadio = document.getElementById('addRadio');

    let toPost = {
        kundeid: translateS(id),
        vorname: translateS(vornameT),
        nachname: translateS(nachnameT),
        messlokationid: translateS(messlokationidT),
        adresseid: translateS(adresseidT)                 
    }
    console.log(toPost.vorname)
    
    if(addRadio.checked){
        let add = true;
        if(toPost.vorname == null ){
            document.getElementById('vorname').style.boxShadow = "inset 0px 0px 1px 3px #ee5253"
            add = false;
            console.log("unexpected value")
        }else{
            document.getElementById('vorname').style.boxShadow = "none";
        }
        if(toPost.nachname == null ){
            document.getElementById('nachname').style.boxShadow = "inset 0px 0px 1px 3px #ee5253"
            add = false;
            console.log("unexpected value")
        }else{
            document.getElementById('nachname').style.boxShadow = "none";
        }
        if(add){
            console.log("zufügen")
            makeRequest('post','http://localhost:8080/api/kunde/add',toPost);
            setTimeout(() =>callAll(), 500);
        }
        
        
    }else{
        
        const options = {
            method: "put",
            body: JSON.stringify(toPost),
            headers: new Headers({
                'Content-Type' : 'application/json'
            })
        };
        console.log(options.body)
        fetch('http://localhost:8080/api/kunde/getKunde',options)
        .then(res => (res.json()))
        .then(res => viewCostumers(res))
        .catch(error => console.log(error));
    }
}

notRed = ()=>{
    document.getElementById('nachname').style.boxShadow = "none";
    document.getElementById('vorname').style.boxShadow = "none";
}

translateN = (n)=>{
    if(Number.isInteger(n)){
        return n;
    }else{
        return null;
    }
}

translateS = (s)=>{
    s +="";
    if(s == "" || s == " "|| s== 0 || s=="0" || s == "   " || s == "  "){
        return null;
    }else{
        return s;
    }
}

callAll();

Deelete = ()=>{
    makeRequest('post','http://localhost:8080/api/kunde/add',{
        "kundeid": 42,
        "adresseid": 5,
        "messlokationid": null,
        "vorname": "Clara",
        "nachname": "Langer"
    })
}

