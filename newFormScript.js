let tree;
let centimeters;
let comp;
let cons;
let bComp
let bCons
let spec;
let byNature;
let form = document.getElementById('form');

function clearForm()
{
    form.innerHTML = "";
}

function updateValue(id, value)
{
    let chosenSelect = document.getElementById(id);
    chosenSelect.value = value;
    chosenSelect.dispatchEvent(new Event('change'));
}

function generateLinkToWebsiteShort(url, colorClass) 
{
    let paragraph = document.createElement("p");
    paragraph.appendChild(document.createTextNode("Więcej informacji o procedurze wycinki znajdziesz na "));
    paragraph.classList.add("h5");
    paragraph.classList.add(colorClass);
    paragraph.id = "link-to-website";
    let linkToWebsite = document.createElement("a");
    linkToWebsite.href = url;
    linkToWebsite.appendChild(document.createTextNode("stronie"));
    paragraph.appendChild(linkToWebsite);
    paragraph.appendChild(document.createTextNode("."));
    return paragraph;
}

function generateLinkToWebsiteLong(url, colorClass) 
{
    let paragraph = document.createElement("p");
    paragraph.appendChild(document.createTextNode("Formularz dostępny na "));
    paragraph.classList.add("h5");
    paragraph.classList.add(colorClass);
    paragraph.id = "link-to-website";
    let linkToWebsite = document.createElement("a");
    linkToWebsite.href = url;
    linkToWebsite.appendChild(document.createTextNode("stronie"));
    paragraph.appendChild(linkToWebsite);
    paragraph.appendChild(document.createTextNode(" wraz z niezbędnymi informacjami. Do formularza, pośród innych załącznikówi, należy załączyć rysunek, mapę albo projekt zagospodarowania działki lub terenu."));
    return paragraph;
}

function generateLinkToCalculator() 
{
    let paragraph = document.createElement("p");
    paragraph.id = "link-to-calculator";
    paragraph.appendChild(document.createTextNode("Jeśli chcesz dowiedzieć się więcej o wartości drzew, zapraszamy do skorzystania z "));
    let linkToCalculator = document.createElement("a");
    linkToCalculator.href = "#";
    linkToCalculator.onclick = ""; // doSthOnClick
    linkToCalculator.classList.add("link-offset-1");
    linkToCalculator.appendChild(document.createTextNode("kalkulatora"));
    paragraph.appendChild(linkToCalculator);
    paragraph.appendChild(document.createTextNode("!"));
    return paragraph;
}

function warnAboutCutting (output, colorClass)
{
    let ouputDiv = document.createElement("div");
    ouputDiv.id = "outputBlock";
    ouputDiv.classList.add(colorClass);
    ouputDiv.classList.add("h5")
    let paragraph = document.createElement("p");
        paragraph.classList.add("h5");
    paragraph.appendChild(document.createTextNode("Miej jednak na uwadze, że zieleń wokół domu nie tylko przysparza uroku estetycznego, ale również wnosi liczne korzyści dla środowiska i jakości życia. Kilka kluczowych aspektów to:"));
    ouputDiv.appendChild(paragraph);
    let aspects = document.createElement("ol");
        let elements = ["Poprawa jakości powietrza", "Ochrona przed hałasem", "Regulacja temperatury", "Wspieranie bioróżnorodności", "Estetyka i wartość nieruchomości", "Poprawa zdrowia psychicznego", "Ochrona gleby"];
        elements.forEach((element) => {
            let listElement = document.createElement("li");
            listElement.appendChild(document.createTextNode(element));
            aspects.appendChild(listElement);
        });
        ouputDiv.appendChild(aspects);
        let paragraph2 = document.createElement("p");
        paragraph2.classList.add("h5");
        paragraph2.appendChild(document.createTextNode("Zachęcamy do dbania o zieleń na Waszych działkach. Pamiętajmy, że każdy z nas ma wpływ na otaczające nas środowisko, a roślinność stanowi istotny element tej harmonii. Roztropnie planujmy prace porządkowe na nieruchomości!"));
        paragraph = document.createElement("p");
        paragraph.classList.add("h5");
        paragraph.appendChild(document.createTextNode("Czy wiesz, że? Ekonomiści wyliczyli, że średnia wartość usług ekosystemowych świadczonych przez jedno duże drzewo to korzyść rzędu aż 15-20 tys. złotych!i Drzewa w naszym mieście dają nam to za darmo!"));
        ouputDiv.appendChild(paragraph);
        ouputDiv.appendChild(generateLinkToCalculator());
        ouputDiv.appendChild(paragraph2);
        output.appendChild(ouputDiv);
}

function warnWithoutLink (output, colorClass) 
{
    let ouputDiv = document.createElement("div");
    ouputDiv.id = "outputBlock";
    ouputDiv.classList.add(colorClass);
    ouputDiv.classList.add("h5")
    let paragraph = document.createElement("p");
        paragraph.classList.add("h5");
    paragraph.appendChild(document.createTextNode("Miej jednak na uwadze, że zieleń wokół domu nie tylko przysparza uroku estetycznego, ale również wnosi liczne korzyści dla środowiska i jakości życia. Kilka kluczowych aspektów to:"));
    ouputDiv.appendChild(paragraph);
    let aspects = document.createElement("ol");
        let elements = ["Poprawa jakości powietrza", "Ochrona przed hałasem", "Regulacja temperatury", "Wspieranie bioróżnorodności", "Estetyka i wartość nieruchomości", "Poprawa zdrowia psychicznego", "Ochrona gleby"];
        elements.forEach((element) => {
            let listElement = document.createElement("li");
            listElement.appendChild(document.createTextNode(element));
            aspects.appendChild(listElement);
        });
        ouputDiv.appendChild(aspects);
        let paragraph2 = document.createElement("p");
        paragraph2.classList.add("h5");
        paragraph2.appendChild(document.createTextNode("Zachęcamy do dbania o zieleń na Waszych działkach. Pamiętajmy, że każdy z nas ma wpływ na otaczające nas środowisko, a roślinność stanowi istotny element tej harmonii. Roztropnie planujmy prace porządkowe na nieruchomości!"));
        ouputDiv.appendChild(paragraph2);
        output.appendChild(ouputDiv);
}

function setToDefault(id) 
{
    document.getElementById(id)[0].selected = true;
    document.querySelectorAll(`input[name=${id}]`).forEach((element) => {
        element.checked = false;
    })
}

function hide(element) 
{
    if (!element.classList.contains("d-none")) {
        element.classList.add("d-none");
    }
}

function hideParagraph(element) 
{
    if (element != undefined && element != null) {
        document.getElementById('form').removeChild(element);
    }
}

document.getElementById('byNature').addEventListener('change', ()=> {
    hide(document.getElementById('sBushesConservating'));
    hide(document.getElementById('sBushesSize'));
    hide(document.getElementById('sBushesCompany'));
    hide(document.getElementById('chooseSpecies'));
    hide(document.getElementById('sPerimeter'));
    hide(document.getElementById('sCompany'));
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    hideParagraph(document.getElementById('outputBlock'));
    if (document.getElementById('link-to-calculator') != null) {
        hideParagraph(document.getElementById('link-to-calculator'));
    }
    if (document.getElementById('link-to-website') != null) {
        hideParagraph(document.getElementById('link-to-website'));
    }
    byNature = document.getElementById('byNature').value;
    if (byNature == "nie" ) {
        document.getElementById('chooseSpecies').classList.remove("d-none");
        setToDefault('species');
    } else if (byNature == "tak") {
        let paragraph = document.createElement("p");
        paragraph.classList.add("h5");
        paragraph.classList.add("text-success");
        paragraph.classList.add("p-2");
        paragraph.id = "out";
        paragraph.appendChild(document.createTextNode("Zadzwoń do urzędu celem zgłoszenia złamanego lub wywróconego drzewa pod numerem telefonu 22 76-06-255 i uzyskaj dalsze informacje."));
        form.appendChild(paragraph);
    }
})

document.getElementById('byBushes').addEventListener('change', ()=> {
    hide(document.getElementById('sBushesConservating'));
    hide(document.getElementById('sByNature'));
    hide(document.getElementById('sBushesSize'));
    hide(document.getElementById('sBushesCompany'));
    hide(document.getElementById('chooseSpecies'));
    hide(document.getElementById('sPerimeter'));
    hide(document.getElementById('sCompany'));
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    hideParagraph(document.getElementById('outputBlock'));
    if (document.getElementById('link-to-calculator') != null) {
        hideParagraph(document.getElementById('link-to-calculator'));
    }
    if (document.getElementById('link-to-website') != null) {
        hideParagraph(document.getElementById('link-to-website'));
    }
    byBushes = document.getElementById('byBushes').value;
    if (byBushes == "drzewa/drzew" ) {
        document.getElementById('sByNature').classList.remove("d-none");
        setToDefault('byNature');
    } else if (byBushes == "krzewów") {
        document.getElementById('sBushesSize').classList.remove("d-none");
        setToDefault('bushesSize');
    }

});


document.getElementById('bushesSize').addEventListener('change', ()=> {
    hide(document.getElementById('sBushesCompany'));
    hide(document.getElementById('sBushesConservating'));
    hide(document.getElementById('chooseSpecies'));
    hide(document.getElementById('sPerimeter'));
    hide(document.getElementById('sCompany'));
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    hideParagraph(document.getElementById('outputBlock'));
    if (document.getElementById('link-to-calculator') != null) {
        hideParagraph(document.getElementById('link-to-calculator'));
    }
    if (document.getElementById('link-to-website') != null) {
        hideParagraph(document.getElementById('link-to-website'));
    }
    byBushes = document.getElementById('bushesSize').value;
    if (byBushes == "poniżej 25 mkw") {
        let ouputDiv = document.createElement("div");
        ouputDiv.classList.add("text-warning");
        ouputDiv.classList.add("h5");
        ouputDiv.id = "out";
        let paragraph = document.createElement("p");
        paragraph.classList.add("h5");
        firstParagraph = document.createElement("p");
        firstParagraph.classList.add("h5");
        firstParagraph.appendChild(document.createTextNode("Możesz dokonać wycinki bez formalności"));
        paragraph.appendChild(document.createTextNode("Miej jednak na uwadze, że zieleń wokół domu nie tylko przysparza uroku estetycznego, ale również wnosi liczne korzyści dla środowiska i jakości życia. Kilka kluczowych aspektów to:"));
        let aspects = document.createElement("ol");
        let elements = ["Poprawa jakości powietrza", "Ochrona przed hałasem", "Regulacja temperatury", "Wspieranie bioróżnorodności", "Estetyka i wartość nieruchomości", "Poprawa zdrowia psychicznego", "Ochrona gleby"];
        elements.forEach((element) => {
            let listElement = document.createElement("li");
            listElement.appendChild(document.createTextNode(element));
            aspects.appendChild(listElement);
        });
        let paragraph2 = document.createElement("p");
        paragraph2.classList.add("h5");
        paragraph2.appendChild(document.createTextNode("Zachęcamy do dbania o zieleń na Waszych działkach. Pamiętajmy, że każdy z nas ma wpływ na otaczające nas środowisko, a roślinność stanowi istotny element tej harmonii. Roztropnie planujmy prace porządkowe na nieruchomości!"));
        ouputDiv.appendChild(firstParagraph);
        ouputDiv.appendChild(paragraph);
        ouputDiv.appendChild(aspects);
        paragraph = document.createElement("p");
        paragraph.classList.add("h5");
        paragraph.appendChild(document.createTextNode("Czy wiesz, że? Ekonomiści wyliczyli, że średnia wartość usług ekosystemowych świadczonych przez jedno duże drzewo to korzyść rzędu aż 15-20 tys. złotych!i Drzewa w naszym mieście dają nam to za darmo!"));
        ouputDiv.appendChild(paragraph);
        ouputDiv.appendChild(generateLinkToCalculator());
        ouputDiv.appendChild(paragraph2);
        form.appendChild(ouputDiv);


    } else if (byBushes == "powyżej 25 mkw") {
        document.getElementById('sBushesCompany').classList.remove("d-none");
        setToDefault('bushesCompany');
    }

});

document.getElementById('bushesCompany').addEventListener('change', ()=> {
    hide(document.getElementById('sBushesConservating'));
    hide(document.getElementById('chooseSpecies'));
    hide(document.getElementById('sPerimeter'));
    hide(document.getElementById('sCompany'));
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    hideParagraph(document.getElementById('outputBlock'));
    if (document.getElementById('link-to-calculator') != null) {
        hideParagraph(document.getElementById('link-to-calculator'));
    }
    if (document.getElementById('link-to-website') != null) {
        hideParagraph(document.getElementById('link-to-website'));
    }
    bComp = document.getElementById('bushesCompany').value;
    if (bComp != "none") {
        document.getElementById('sBushesConservating').classList.remove("d-none");
        setToDefault('bushesConservating');
    }
        // let paragraph = document.createElement("p");
        // paragraph.classList.add("h5");
        // paragraph.classList.add("text-success");
        // paragraph.classList.add("p-1");
        // paragraph.id = "out";
        // paragraph.appendChild(document.createTextNode(bComp == "tak" ? "Musisz mieć zezwolenie" : "Musisz zgłosić usunięcie krzewów" ));
        // form.appendChild(paragraph);
        // let paragraph2 = document.createElement("p");
        // paragraph2.classList.add("h5");
        // paragraph2.classList.add("text-success");
        // paragraph2.classList.add("p-1");
        // paragraph2.id = "out2";
        // let link = document.createElement("a");
        // let link2 = document.createElement("a");
        // let link3 = document.createElement("a");
        // if (bComp == "tak") {
        // paragraph2.appendChild(document.createTextNode("wzory formularzy do pobrania:"));
        // paragraph2.appendChild(document.createElement("br"));
        // link.href = "https://www.sulejowek.pl/plik,12346,oswiadczenie-wspolnoty-mieszkaniowej.docx";
        // link.download = "plik,12346,oswiadczenie-wspolnoty-mieszkaniowej.docx";
        // link.appendChild(document.createTextNode("Oświadczenie wspólnoty mieszkaniowej (.docx)"));
        // link2.href = "https://www.sulejowek.pl/plik,12047,wniosek-na-usuniecie-drzew-i-lub-krzewow-4-doc.doc";
        // link2.download = "plik,12047,wniosek-na-usuniecie-drzew-i-lub-krzewow-4-doc.doc";
        // link2.appendChild(document.createTextNode("	Wniosek_na_usuniecie_drzew_i_lub_krzewow(4) (.doc)"));
        // link3.href = "https://www.sulejowek.pl/plik,6907,oswiadczenie-spoldzielni-mieszkaniowej.docx";
        // link3.download = "plik,6907,oswiadczenie-spoldzielni-mieszkaniowej.docx";
        // link3.appendChild(document.createTextNode("	Oświadczenie spółdzielni mieszkaniowej (.docx)"));
        // paragraph2.appendChild(document.createElement("br"));
        // paragraph2.appendChild(link);
        // paragraph2.appendChild(document.createElement("br"));
        // paragraph2.appendChild(link2);
        // paragraph2.appendChild(document.createElement("br"));
        // paragraph2.appendChild(link3);
        // } else {
        // paragraph2.appendChild(document.createTextNode("wzory formularzy do pobrania:"));
        // paragraph2.appendChild(document.createElement("br"));
        // link.href = "https://www.sulejowek.pl/plik,6914,zgloszenie-zamiaru-usuniecia-drzew-lub-krzewow.doc";
        // link.download = "plik,6914,zgloszenie-zamiaru-usuniecia-drzew-lub-krzewow.doc";
        // link.appendChild(document.createTextNode("Zgłoszenie zamiaru usunięcia drzew lub krzewów (.doc)"));
        // paragraph2.appendChild(document.createElement("br"));
        // paragraph2.appendChild(link);
        // }
        // warnWithoutLink(form, "text-success");
        // form.appendChild(paragraph2);

});

document.getElementById('bushesConservating').addEventListener('change', ()=> {
    hide(document.getElementById('chooseSpecies'));
    hide(document.getElementById('sPerimeter'));
    hide(document.getElementById('sCompany'));
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    hideParagraph(document.getElementById('outputBlock'));
    if (document.getElementById('link-to-calculator') != null) {
        hideParagraph(document.getElementById('link-to-calculator'));
    }
    if (document.getElementById('link-to-website') != null) {
        hideParagraph(document.getElementById('link-to-website'));
    }
    bCons = document.getElementById('bushesConservating').value;
    let paragraph = document.createElement("p");
    paragraph.id = "out";
    paragraph.classList.add("h5");
    if (bCons != "none") {
        if (bComp == "tak" && bCons == "tak") {
            paragraph.classList.add("text-danger");
            paragraph.appendChild(document.createTextNode("Możesz dokonać wycinki po uprzednim uzyskaniu zezwolenia od Wojewódzkiego Konserwatora Zabytków. "));
            form.appendChild(paragraph);
            warnWithoutLink(form, "text-danger");
            form.appendChild(generateLinkToWebsiteShort("https://www.gov.pl/web/gdos/wycinka-drzew-lub-krzewow-na-nieruchomosciach-objetych-ochrona-konserwatora-zabytkow", "text-danger"))
        } else if (bComp == "tak" && bCons == "nie") {
            paragraph.classList.add("text-danger");
            paragraph.appendChild(document.createTextNode("Możesz dokonać wycinki po uprzednim uzyskaniu zezwolenia od Burmistrza miasta Sulejówek. "));
            form.appendChild(paragraph);
            warnWithoutLink(form, "text-danger");
            form.appendChild(generateLinkToWebsiteLong("https://www.sulejowek.pl/1463,zezwolenie-na-usuniecie-drzew-i-lub-krzewow", "text-danger"))
        } else if (bComp == "nie" && bCons == "nie") {
            paragraph.classList.add("text-warning");
            paragraph.appendChild(document.createTextNode("Możesz dokonać wycinki po uprzednim zgłoszeniu zamiaru wycinki do Burmistrza miasta Sulejówek. "));
            form.appendChild(paragraph);
            warnWithoutLink(form, "text-warning");
            form.appendChild(generateLinkToWebsiteLong("https://www.sulejowek.pl/1464,zgloszenie-zamiaru-usuniecia-drzew-i-lub-krzewow", "text-warning"))
        } else if (bComp == "nie" && bCons == "tak") {
            paragraph.classList.add("text-warning");
            paragraph.appendChild(document.createTextNode("Możesz dokonać wycinki po uprzednim zgłoszeniu zamiaru wycinki do Wojewódzkiego Konserwatora Zabytków."));
            form.appendChild(paragraph);
            warnWithoutLink(form, "text-warning");
            form.appendChild(generateLinkToWebsiteShort("https://www.gov.pl/web/gdos/wycinka-drzew-lub-krzewow-na-nieruchomosciach-objetych-ochrona-konserwatora-zabytkow", "text-warning"))
        }
    }

});

document.getElementById('species').addEventListener('change', ()=> {
    hide(document.getElementById('sPerimeter'));
    hide(document.getElementById('sCompany'));
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    hideParagraph(document.getElementById('outputBlock'));
    if (document.getElementById('link-to-calculator') != null) {
        hideParagraph(document.getElementById('link-to-calculator'));
    }
    if (document.getElementById('link-to-website') != null) {
        hideParagraph(document.getElementById('link-to-website'));
    }
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
    hideParagraph(document.getElementById('outputBlock'));
    if (document.getElementById('link-to-calculator') != null) {
        hideParagraph(document.getElementById('link-to-calculator'));
    }
    if (document.getElementById('link-to-website') != null) {
        hideParagraph(document.getElementById('link-to-website'));
    }
     centimeters = Number(document.getElementById('perimeter').value); 
     if (centimeters < spec) {
        let paragraph = document.createElement("p");
        paragraph.classList.add("h5");
        paragraph.classList.add("text-success");
        paragraph.classList.add("p-2");
        paragraph.id = "out";
        paragraph.appendChild(document.createTextNode("Możesz dokonać wycinki bez formalności."));
        form.appendChild(paragraph);
        warnAboutCutting(form, "text-success");
    } else {
        setToDefault('company');
        document.getElementById('sCompany').classList.remove("d-none");
    }
});

document.getElementById('company').addEventListener('change', ()=> {
    hide(document.getElementById('sConservating'));
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    hideParagraph(document.getElementById('outputBlock'));
    if (document.getElementById('link-to-calculator') != null) {
        hideParagraph(document.getElementById('link-to-calculator'));
    }
    if (document.getElementById('link-to-website') != null) {
        hideParagraph(document.getElementById('link-to-website'));
    }
    comp = document.getElementById('company').value;
    if (comp != "none") {
        setToDefault('conservating');
        document.getElementById('sConservating').classList.remove("d-none");
    }
})

document.getElementById('conservating').addEventListener('change', ()=> {
    hideParagraph(document.getElementById('out'));
    hideParagraph(document.getElementById('out2'));
    hideParagraph(document.getElementById('outputBlock'));
    if (document.getElementById('link-to-calculator') != null) {
        hideParagraph(document.getElementById('link-to-calculator'));
    }
    if (document.getElementById('link-to-website') != null) {
        hideParagraph(document.getElementById('link-to-website'));
    }
    cons = document.getElementById('conservating').value;
    if (document.getElementById('out') != undefined) {
        document.getElementById('out').classList.add("d-none"); 
    }
    if (document.getElementById('out2') != undefined) {
        document.getElementById('out2').classList.add("d-none"); 
    }
    if (cons != "none") {
        let paragraph = document.createElement("p");
        paragraph.classList.add("h5");
        paragraph.classList.add( comp == "tak" ? "text-danger" : "text-warning");
        paragraph.classList.add("p-1");
        paragraph.id = "out";
        // paragraph.appendChild(document.createTextNode(comp == "tak" ? "Musisz mieć zezwolenie" : "Musisz zgłosić usunięcie drzewa" ));
        // form.appendChild(paragraph);
        let paragraph2 = document.createElement("p");
        paragraph2.classList.add("h5");
        paragraph2.classList.add( comp == "tak" ? "text-danger" : "text-warning");
        paragraph2.classList.add("p-1");
        paragraph2.id = "out2";
        let link = document.createElement("a");
        let link2 = document.createElement("a");
        let link3 = document.createElement("a");
        if (comp == "tak") {
        paragraph2.appendChild(document.createTextNode((cons == "tak" ? "Możesz dokonać wycinki po uprzednim uzyskaniu zezwolenia od Wojewódzkiego Konserwatora Zabytków. " : "Możesz dokonać wycinki po uprzednim uzyskaniu zezwolenia od Burmistrza miasta Sulejówek. ") ));
        // paragraph2.appendChild(document.createElement("br"));
        // paragraph2.appendChild(document.createElement("br"));
        // paragraph2.appendChild(document.createTextNode("wzory formularzy do pobrania:"));
        // paragraph2.appendChild(document.createElement("br"));
        // link.href = "https://www.sulejowek.pl/plik,12346,oswiadczenie-wspolnoty-mieszkaniowej.docx";
        // link.download = "plik,12346,oswiadczenie-wspolnoty-mieszkaniowej.docx";
        // link.appendChild(document.createTextNode("Oświadczenie wspólnoty mieszkaniowej (.docx)"));
        // link2.href = "https://www.sulejowek.pl/plik,12047,wniosek-na-usuniecie-drzew-i-lub-krzewow-4-doc.doc";
        // link2.download = "plik,12047,wniosek-na-usuniecie-drzew-i-lub-krzewow-4-doc.doc";
        // link2.appendChild(document.createTextNode("	Wniosek_na_usuniecie_drzew_i_lub_krzewow(4) (.doc)"));
        // link3.href = "https://www.sulejowek.pl/plik,6907,oswiadczenie-spoldzielni-mieszkaniowej.docx";
        // link3.download = "plik,6907,oswiadczenie-spoldzielni-mieszkaniowej.docx";
        // link3.appendChild(document.createTextNode("	Oświadczenie spółdzielni mieszkaniowej (.docx)"));
        // paragraph2.appendChild(document.createElement("br"));
        // paragraph2.appendChild(link);
        // paragraph2.appendChild(document.createElement("br"));
        // paragraph2.appendChild(link2);
        // paragraph2.appendChild(document.createElement("br"));
        // paragraph2.appendChild(link3);
        form.appendChild(paragraph2);
        warnAboutCutting(form,  comp == "tak" ? "text-danger" : "text-warning");
        form.appendChild( cons == "tak" ? generateLinkToWebsiteShort("https://www.gov.pl/web/gdos/wycinka-drzew-lub-krzewow-na-nieruchomosciach-objetych-ochrona-konserwatora-zabytkow", comp == "tak" ? "text-danger" : "text-warning") : generateLinkToWebsiteLong("https://www.sulejowek.pl/1463,zezwolenie-na-usuniecie-drzew-i-lub-krzewow", comp == "tak" ? "text-danger" : "text-warning"))
        } else {
        paragraph2.appendChild(document.createTextNode((cons == "tak" ? "Możesz dokonać wycinki po uprzednim zgłoszeniu zamiaru wycinki do Wojewódzkiego Konserwatora Zabytków. " : "Możesz dokonać wycinki po uprzednim zgłoszeniu zamiaru wycinki do Burmistrza miasta Sulejówek. ") ));
        // paragraph2.appendChild(document.createElement("br"));
        // paragraph2.appendChild(document.createElement("br"));
        // paragraph2.appendChild(document.createTextNode("wzory formularzy do pobrania:"));
        // paragraph2.appendChild(document.createElement("br"));
        // link.href = "https://www.sulejowek.pl/plik,6914,zgloszenie-zamiaru-usuniecia-drzew-lub-krzewow.doc";
        // link.download = "plik,6914,zgloszenie-zamiaru-usuniecia-drzew-lub-krzewow.doc";
        // link.appendChild(document.createTextNode("Zgłoszenie zamiaru usunięcia drzew lub krzewów (.doc)"));
        // paragraph2.appendChild(document.createElement("br"));
        // paragraph2.appendChild(link);
        form.appendChild(paragraph2);
        warnAboutCutting(form, comp == "tak" ? "text-danger" : "text-warning");
        form.appendChild( cons == "tak" ? generateLinkToWebsiteShort("https://www.gov.pl/web/gdos/wycinka-drzew-lub-krzewow-na-nieruchomosciach-objetych-ochrona-konserwatora-zabytkow", comp == "tak" ? "text-danger" : "text-warning") : generateLinkToWebsiteLong("https://www.sulejowek.pl/1464,zgloszenie-zamiaru-usuniecia-drzew-i-lub-krzewow", comp == "tak" ? "text-danger" : "text-warning"))
        }
        }  
    });

    function clearForm() 
    {
        hide(document.getElementById('sBushesConservating'));
        hide(document.getElementById('sByNature'));
        hide(document.getElementById('sBushesSize'));
        hide(document.getElementById('sBushesCompany'));
        hide(document.getElementById('chooseSpecies'));
        hide(document.getElementById('sPerimeter'));
        hide(document.getElementById('sCompany'));
        hide(document.getElementById('sConservating'));
        hideParagraph(document.getElementById('out'));
        hideParagraph(document.getElementById('out2'));
        hideParagraph(document.getElementById('outputBlock'));
        if (document.getElementById('link-to-calculator') != null) {
            hideParagraph(document.getElementById('link-to-calculator'));
        }
        if (document.getElementById('link-to-website') != null) {
            hideParagraph(document.getElementById('link-to-website'));
        }
        document.getElementById('byNature').selectedIndex = 0;
    }