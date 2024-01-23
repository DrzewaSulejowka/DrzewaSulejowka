let tree;
let centimeters;
let comp;
let cons;
let spec;
let byNature;
let form = document.getElementById('form');

function setToDefault(id) 
{
    document.getElementById(id)[0].selected = true;
}

function hide(element) 
{
    if (!element.classList.contains("d-none")) {
        element.classList.add("d-none");
    }
}

function hideParagraph(element) 
{
    if (element != undefined) {
        document.getElementById('form').removeChild(element);
    }
}

document.getElementById('byNature').addEventListener('change', ()=> {
    hide(document.getElementById('sByBushes'));
    hide(document.getElementById('sBushesSize'));
    hide(document.getElementById('sBushesCompany'));
    hide(document.getElementById('chooseSpecies'));
    hide(document.getElementById('sPerimeter'));
    hide(document.getElementById('sCompany'));
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    byNature = document.getElementById('byNature').value;
    if (byNature == "nie" ) {
        document.getElementById('sByBushes').classList.remove("d-none");
        setToDefault('byBushes');
    } else if (byNature == "tak") {
        let paragraph = document.createElement("p");
        paragraph.classList.add("h3");
        paragraph.classList.add("text-success");
        paragraph.classList.add("p-2");
        paragraph.id = "out";
        paragraph.appendChild(document.createTextNode("Zadzwoń do urzędu celem zgłoszenia wiatrołomu pd numerem telefonu ... i uzyskaj dalsze informacje."));
        form.appendChild(paragraph);
    }
})

document.getElementById('byBushes').addEventListener('change', ()=> {
    hide(document.getElementById('sBushesSize'));
    hide(document.getElementById('sBushesCompany'));
    hide(document.getElementById('chooseSpecies'));
    hide(document.getElementById('sPerimeter'));
    hide(document.getElementById('sCompany'));
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    byBushes = document.getElementById('byBushes').value;
    if (byBushes == "drzewa/drzew" ) {
        document.getElementById('chooseSpecies').classList.remove("d-none");
        setToDefault('species');
    } else if (byBushes == "krzewów") {
        document.getElementById('sBushesSize').classList.remove("d-none");
        setToDefault('bushesSize');
    }

});


document.getElementById('bushesSize').addEventListener('change', ()=> {
    hide(document.getElementById('sBushesCompany'));
    hide(document.getElementById('chooseSpecies'));
    hide(document.getElementById('sPerimeter'));
    hide(document.getElementById('sCompany'));
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    byBushes = document.getElementById('bushesSize').value;
    if (byBushes == ">25 m kw") {
        let ouputDiv = document.createElement("div");
        ouputDiv.classList.add("text-warning");
        ouputDiv.id = "out";
        let paragraph = document.createElement("p");
        paragraph.classList.add("h3");
        paragraph.appendChild(document.createTextNode("Możesz dokonać wycinki bez formalności, jednak miej na uwadze, że zieleń wokół domu nie tylko przysparza uroku estetycznego, ale również wnosi liczne korzyści dla środowiska i jakości życia. Poniżej przedstawiamy kilka kluczowych aspektów:"));
        let aspects = document.createElement("ol");
        let elements = ["Poprawa jakości powietrza", "Ochrona przed hałasem", "Regulacja temperatury", "Wspieranie bioróżnorodności", "Estetyka i wartość nieruchomości", "Poprawa zdrowia psychicznego", "Ochrona gleby"];
        elements.forEach((element) => {
            let listElement = document.createElement("li");
            listElement.appendChild(document.createTextNode(element));
            aspects.appendChild(listElement);
        });
        let paragraph2 = document.createElement("p");
        paragraph2.classList.add("h3");
        paragraph2.appendChild(document.createTextNode("Zachęcamy do dbania o zieleń na Waszych działkach. Pamiętajmy, że każdy z nas ma wpływ na otaczające nas środowisko, a roślinność stanowi istotny element tej harmonii. Zachęcamy do roztropnego planowania prac porządkowych na nieruchomości!"));
        ouputDiv.appendChild(paragraph);
        ouputDiv.appendChild(aspects);
        ouputDiv.appendChild(paragraph2);
        form.appendChild(ouputDiv);


    } else if (byBushes == "<25 m kw") {
        document.getElementById('sBushesCompany').classList.remove("d-none");
        setToDefault('bushesCompany');
    }

});

document.getElementById('bushesCompany').addEventListener('change', ()=> {
    hide(document.getElementById('chooseSpecies'));
    hide(document.getElementById('sPerimeter'));
    hide(document.getElementById('sCompany'));
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    let bComp = document.getElementById('bushesCompany').value;
    if (bComp != "none") {
    let paragraph = document.createElement("p");
    paragraph.classList.add("h3");
    paragraph.classList.add("text-success");
    paragraph.classList.add("p-2");
    paragraph.id = "out";
    paragraph.appendChild(document.createTextNode(bComp == "tak" ? "pusty formularz wniosku do pobrania" : "pusty formularz zgłoszenia do pobrania"));
    form.appendChild(paragraph);
    }
});

document.getElementById('species').addEventListener('change', ()=> {
    hide(document.getElementById('sPerimeter'));
    hide(document.getElementById('sCompany'));
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    tree = document.getElementById('species').value;
    if (tree !== "none" ) {
        document.getElementById('sPerimeter').classList.remove("d-none");
        if (tree == "Topola" || tree == "Wierzba" || tree == "Klon jesionolistny" || tree == "Klon srebrzysty") {
            spec = 80;
        } else if (tree == "Kasztanowiec zwyczajny" || tree == "Robinia akacjowa" || tree == "Plantan klonolistny") {
            spec = 65;
        } else {
            spec = 50;
        }
    }
})

document.getElementById('psubmit').addEventListener('click', ()=> {
    hide(document.getElementById('sCompany'));
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
     centimeters = Number(document.getElementById('perimeter').value); 
     if (centimeters < spec) {
        let paragraph = document.createElement("p");
        paragraph.classList.add("h3");
        paragraph.classList.add("text-success");
        paragraph.classList.add("p-2");
        paragraph.id = "out";
        paragraph.appendChild(document.createTextNode("Nie musisz mieć zezwolenia ani dokonywać zgłoszenia"));
        form.appendChild(paragraph);
    } else {
        setToDefault('company');
        document.getElementById('sCompany').classList.remove("d-none");
    }
});

document.getElementById('company').addEventListener('change', ()=> {
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    comp = document.getElementById('company').value;
    if (comp != "none") {
        setToDefault('conservating');
        document.getElementById('sConservating').classList.remove("d-none");
    }
})

document.getElementById('conservating').addEventListener('change', ()=> {
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    cons = document.getElementById('conservating').value;
    if (document.getElementById('out') != undefined) {
        document.getElementById('out').classList.add("d-none"); 
    }
    if (document.getElementById('out2') != undefined) {
        document.getElementById('out2').classList.add("d-none"); 
    }
    if (cons != "none") {
        let paragraph = document.createElement("p");
        paragraph.classList.add("h3");
        paragraph.classList.add( comp == "tak" ? "text-danger" : "text-warning");
        paragraph.classList.add("p-1");
        paragraph.id = "out";
        paragraph.appendChild(document.createTextNode(comp == "tak" ? "Musisz mieć zezwolenie" : "Musisz zgłosić usunięcie drzewa" ));
        form.appendChild(paragraph);
        let paragraph2 = document.createElement("p");
        paragraph2.classList.add("h3");
        paragraph2.classList.add( comp == "tak" ? "text-danger" : "text-warning");
        paragraph2.classList.add("p-1");
        paragraph2.id = "out2";
        let link = document.createElement("a");
        if(comp == "tak"){
        link.href="https://www.sulejowek.pl/1463,zezwolenie-na-usuniecie-drzew-i-lub-krzewow";
        paragraph2.appendChild(document.createTextNode((cons == "tak" ? "Wniosek o zezwolenie należy złożyć do wojewódzkiego konserwatora zabytków" : "Wniosek o zezwolenie należy złożyć do Wójta/Burmistrza/Prezydenta") ));
        link.appendChild(document.createTextNode("szczegółowe informacje dotyczące wniosku o zezwolenie na usunięcie drzewa"));
        }else{
        link.href="https://www.sulejowek.pl/1464,zgloszenie-zamiaru-usuniecia-drzew-i-lub-krzewow";
        link.appendChild(document.createTextNode("szczegółowe informacje dotyczące zgłoszenia usunięcia drzewa"));
        paragraph2.appendChild(document.createTextNode((cons == "tak" ? "Zgłoszenie należy złożyć do wojewódzkiego konserwatora zabytków" : "Zgłoszenie należy złożyć do Wójta/Burmistrza/Prezydenta") ));
        }
        paragraph2.appendChild(document.createElement("br"));
        paragraph2.appendChild(link);
        form.appendChild(paragraph2);
        }  
    });