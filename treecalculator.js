let TREE_CALCULATOR_SPECIES = document.getElementById('treeCalculatorSpecies');
let TREE_CALCULATOR_AGE = document.getElementById('treeCalculatorAge');
let TREE_CALCULATOR_PERIMETER = document.getElementById('treeCalculatorPerimeter');
let TREE_CALCULATOR_CONDITION = document.getElementById('treeCalculatorCondition');
let TREE_CALCULATOR_LOCATION = document.getElementById("treeCalculatorLocation");
let TREE_RESULT_BLOCK = document.getElementById('resultTreeBlock');
let TREE_RESULT_VALUE = document.getElementById('treeValue');
let TREE_RESULT_POLLINATION = document.getElementById('pollination');
let TREE_RESULT_SPREADING = document.getElementById('spreading');
let TREE_RESULT_LIFESPAN = document.getElementById('lifespan');
let TREE_RESULT_BENEFITS = document.getElementById('benefits');

function showTreeResult(value, species)
{
    if (TREE_RESULT_BLOCK.classList.contains("d-none")) {
        TREE_RESULT_BLOCK.classList.remove("d-none");
    }
    TREE_RESULT_VALUE.innerHTML = String(value).replace(".", ",") + " zł";
    TREE_RESULT_POLLINATION.innerHTML = species.pollination;
    TREE_RESULT_SPREADING.innerHTML = species.spreading;
    TREE_RESULT_LIFESPAN.innerHTML = species.lifeSpan;
    TREE_RESULT_BENEFITS.innerHTML = species.benefits;
}

function clearTreeCalculator()
{
    TREE_CALCULATOR_SPECIES.value = "none";
    TREE_CALCULATOR_AGE.value = "";
    TREE_CALCULATOR_PERIMETER.value = "";
    TREE_CALCULATOR_CONDITION.value = "none";
}

class Tree 
{
    constructor(json)
    {
        let key;
        for (key in json) {
            this[key] = json[key];
        }
    }
}


let TREES_TYPES = {};

TREES_TYPES["brzoza"] = new Tree({
    avgPrice: 1045,
    pollination: "roślina wiatropylna",
    spreading: "barochoria, zoochoria",
    lifeSpan: "Brzoza rośnie szybko i dożywa do 120 lat.",
    benefits: "Brzozy emitują fitoncydy, czyli substancje o właściwościach bakteriobójczych. Dlatego wokół drzew tworzy się przestrzeń wolna od bakterii i sprzyjająca odpoczynku. Rosnąc, brzozy stają się bardziej skuteczne w regulacji wilgotności gleby i dostarczają więcej materiału do kompostowania.",
    agesByDiameter: [4, 9, 15, 25, 35, 45, 52, 60, 67, 75, 85]
});

TREES_TYPES["buk"] = new Tree({
    avgPrice: 1582,
    pollination: "roślina wiatropylna",
    spreading: "zoochoria",
    lifeSpan: "Buk osiąga wiek ok. 300 lat.",
    benefits: "Starsze buki dostarczają cienia, który pomaga w chłodzeniu otoczenia, a także stanowią siedlisko dla wielu gatunków roślin i zwierząt. Buki są znane z eleganckiej urody. Ich gładka, srebrno-szara kora oraz zimozielone liście nadają im wyjątkowy wygląd przez cały rok.",
    agesByDiameter: [4, 9, 16, 25, 33, 40, 46, 52, 58, 65, 75]
});

TREES_TYPES["dab"] = new Tree({
    avgPrice: 1283,
    pollination: "roślina wiatropylna",
    spreading: "anemochoria, zoochoria",
    lifeSpan: "Dąb średnio uzyskuje wiek od 200 do 600 lat.",
    benefits: "W miarę upływu lat dęby dostarczają stabilności glebie, a ich liście i kora stanowią cenną materię organiczną. Duże liście dębu zapewniają bujną koronę, co sprawia, że są atrakcyjne pod względem krajobrazowym. Ponadto, korony dębów dostarczają gęstego cienia, co jest pożądane w obszarach miejskich i w parkach. Mają zdolność do magazynowania dużej ilości dwutlenku węgla, co wpływa pozytywnie na absorpcję tego gazu, będącego jednym z czynników wpływających na zmiany klimatyczne.",
    agesByDiameter: [4, 10, 16, 26, 37, 45, 54, 64, 72, 81, 88]
});

TREES_TYPES["grab"] = new Tree({
    avgPrice: 1568,
    pollination: "roślina wiatropylna",
    spreading: "anemochoria",
    lifeSpan: "Grab może przetrwać od 100 do 200 lat.",
    benefits: "Wraz z wiekiem, grab dostarcza stabilności glebie, a ich liście i gałęzie stanowią cenny materiał organiczny. Gęste korzenie grabu mają zdolność do zatrzymywania erozji gleby, co jest szczególnie korzystne w obszarach o nierównej topografii.",
    agesByDiameter: [4, 9, 20, 30, 40, 50, 58, 65, 71, 76, 84]
});

TREES_TYPES["jesion"] = new Tree({
    avgPrice: 1128,
    pollination: "roślina wiatropylna",
    spreading: "anemochoria, hydrochoria",
    lifeSpan: "Jesion żyje aż do 250 lat.",
    benefits: "Ekstrakty z kory i liści jesionu zawierają związki, takie jak flawonoidy, które wykazują działanie przeciwzapalne. Może to być przydatne w łagodzeniu objawów stanów zapalnych w organizmie. W miarę starzenia się, jesiony utrzymują swoją zdolność do absorpcji CO2 i dostarczają cienia na obszarach miejskich.",
    agesByDiameter: [4, 7, 16, 24, 30, 37, 45, 54, 61, 68, 73]
});

TREES_TYPES["jodla"] = new Tree({
    avgPrice: 1159,
    pollination: "roślina wiatropylna",
    spreading: "anemochoria, zoochoria",
    lifeSpan: "Jodła mogą żyć nawet 500 lat.",
    benefits: "Rosnące jodły dostarczają cienia i są istotnym elementem lasów iglastych. Korzenie jodłowe pomagają w utrzymaniu struktury gleby, zapobiegając erozji i stabilizując teren.",
    agesByDiameter: [4, 8, 20, 25, 32, 0, 0, 0, 0, 0, 0]
});

TREES_TYPES["kasztanowiec"] = new Tree({
    avgPrice: 1107,
    pollination: "roślina owadopylna",
    spreading: "",
    lifeSpan: "Kasztanowce mogą żyć od 150 do 250 lat.",
    benefits: "Kasztanowiec zawiera substancje przeciwutleniające, takie jak flawonoidy, które pomagają w neutralizowaniu wolnych rodników w organizmie, co może wpływać korzystnie na zdrowie. Starsze kasztanowce oferują rosnące korzyści, w tym bogate źródło cienia, kwiaty przyciągające owady zapylające oraz liście, które dostarczają składników organicznych dla gleby.",
    agesByDiameter: [4, 7, 13, 20, 26, 33, 40, 46, 52, 59, 65]
});

TREES_TYPES["klon"] = new Tree({
    avgPrice: 1342,
    pollination: "roślina owadopylna",
    spreading: "anemochoria",
    lifeSpan: "Klon może żyć od 100 do 300 lat.",
    benefits: "W miarę upływu lat klon dostarcza coraz więcej cienia, co przyczynia się do chłodzenia otoczenia, a także zwiększa swoją zdolność do absorpcji dwutlenku węgla.",
    agesByDiameter: [4, 8, 15, 20, 30, 40, 50, 55, 65, 70, 80]
});

TREES_TYPES["lipa"] = new Tree({
    avgPrice: 1103,
    pollination: "roślina owadopylna",
    spreading: "anemochoria",
    lifeSpan: "Lipa dożywa ok. 500 lat.",
    benefits: "Rosnące lipy dostarczają cienia, a ich kwiaty są istotne dla pszczół i innych owadów zapylających. Słodki nektar, pyłek i kleista spadź, wydzielane przez lipy, przyciągają do siebie rzesze pszczół. Istotna rola w dziedzinie lecznictwa podkreśla także znaczenie dla zdrowia ludzi.",
    agesByDiameter: [4, 7, 15, 24, 32, 39, 47, 56, 64, 70, 76]
});

TREES_TYPES["olsza"] = new Tree({
    avgPrice: 1850,
    pollination: "roślina wiatropylna",
    spreading: "anemochoria, hydrochoria, zoochoria",
    lifeSpan: "Olsza zazwyczaj żyje od 80 do 150 lat.",
    benefits: "W miarę starzenia się olsza wzmacnia zdolność retencji wody, a także dostarcza schronienia dla różnych gatunków ptaków. Olsza łączy się w symbiozę z bakteriami Frankia, które osiedlają się na jej korzeniach, tworząc brodawki korzeniowe. Współpraca umożliwia drzewu efektywne pobieranie azotu z atmosfery i wzbogacanie gleby w ten pierwiastek. Działa to jako naturalny mechanizm, korzystnie wpływając na rozwój olszy oraz wspomagając inne rośliny w jej otoczeniu.",
    agesByDiameter: [4, 8, 15, 23, 31, 40, 48, 56, 64, 71, 85]
});

TREES_TYPES["sosna"] = new Tree({
    avgPrice: 656,
    pollination: "roślina wiatropylna",
    spreading: "",
    lifeSpan: "Sosna żyje średnio od 200 do 600 lat.",
    benefits: "Starsze sosny dostarczają cienia i są istotne dla regulacji wilgotności gleby. Sosna (60 letnia) produkuje w ciągu doby tlen, zapewniający dobowe zapotrzebowanie na pierwiastek dla 3 osób ( 1350-1800 litrów). ",
    agesByDiameter: [3, 7, 12, 20, 28, 37, 46, 55, 64, 73, 80]
});

TREES_TYPES["swierk"] = new Tree({
    avgPrice: 740,
    pollination: "roślina wiatropylna",
    spreading: "anemochoria, zoochoria",
    lifeSpan: "Świerk może żyć od 200 do 500 lat.",
    benefits: "Świerki pełnią kluczową rolę w ekosystemach, zapewniając siedlisko dla wielu gatunków roślin, zwierząt i mikroorganizmów. Są często miejscem lęgów dla ptaków i schronieniem dla dzikich zwierząt. W miarę wzrostu, świerki dostarczają cienia, a ich igły są cennym źródłem organicznej materii.",
    agesByDiameter: [3, 6, 13, 30, 40, 48, 56, 64, 71, 77, 85]
});

TREES_TYPES["wierzba"] = new Tree({
    avgPrice: 1633,
    pollination: "roślina owadopylna",
    spreading: "",
    lifeSpan: "Wierzba zazwyczaj żyje od 30 do 50 lat.",
    benefits: "Kora wierzby zawiera związki chemiczne, takie jak salicyna, które mają działanie przeciwbólowe i przeciwzapalne. Dzięki prozdrowotnym właściwościom, ekstrakty z kory wierzby były używane tradycyjnie do łagodzenia bólów związanych z chorobami reumatycznymi. Pomimo krótkiej długości życia, wierzby są skuteczne w regulacji poziomu wody i dostarczaniu cienia na obszarach wilgotnych.",
    agesByDiameter: [4, 10, 17, 24, 31, 39, 46, 55, 63, 70, 76]
});

TREES_TYPES["inne"] = new Tree({
    avgPrice: 930,
    pollination: "",
    spreading: "",
    lifeSpan: "",
    benefits: "Niezależnie od gatunku, każde drzewo przyczynia się dla zdrowego ekosystemu, a w miarę wzrostu korzyści są coraz większe.",
    agesByDiameter: [4, 8, 16, 24, 33, 41, 49, 57, 64, 71, 79]
});

const TREE_CONDITION_VALUE = [0.10, 0.25, 0.50, 0.75, 1.00];

const TREE_AGE_VALUE = [0, 5, 6, 8, 16, 30, 50, 70, 85, 100, 115, 128, 140, 152, 163, 173, 181, 187, 192, 197, 200];

function getAgeByDiameter(perimeter, species)
{
    let diameter = perimeter / Math.PI;
    let index;
    let lower;
    let higher;
    if (diameter < 6) {
        index = 0;
        lower = 0;
        higher = 5;
        return ((species.agesByDiameter[0]) * ((diameter - (lower - 1)) / (higher - (lower - 1)))); 
    } else if (diameter >= 6 && diameter < 11) {
        index = 1;
        lower = 6;
        higher = 10;
    } else if (diameter >= 11 && diameter < 21) {
        index = 2;
        lower = 11;
        higher = 20;
    } else if (diameter >= 21 && diameter < 31) {
        index = 3;
        lower = 21;
        higher = 30;
    } else if (diameter >= 31 && diameter < 41) {
        index = 4;
        lower = 31;
        higher = 40;
    } else if (diameter >= 41 && diameter < 51) {
        index = 5;
        lower = 41;
        higher = 50;
    } else if (diameter >= 51 && diameter < 61) {
        index = 6;
        lower = 51;
        higher = 60;
    } else if (diameter >= 61 && diameter < 71) {
        index = 7;
        lower = 61;
        higher = 70;
    } else if (diameter >= 71 && diameter < 81) {
        index = 8;
        lower = 71;
        higher = 80;
    } else if (diameter >= 81 && diameter < 91) {
        index = 9;
        lower = 81;
        higher = 90;
    } else if (diameter >= 91) {
        return species.agesByDiameter[10] * (diameter / 90);
    }
    let baseValue = species.agesByDiameter[index - 1];
    let extraValue = species.agesByDiameter[index] - baseValue;
    return baseValue + ((extraValue) * ((diameter - (lower - 1)) / (higher - (lower - 1)))); 
}

function calculateTreeValue()
{
    if ((TREE_CALCULATOR_AGE.value === "" && TREE_CALCULATOR_PERIMETER.value === "") || TREE_CALCULATOR_CONDITION.value === "none" || TREE_CALCULATOR_SPECIES.value === "none") {
        alert("Aby uzyskać wartość drzewa należy wypełnić wszystkie pola!");
    } else {
        if ((TREE_CALCULATOR_LOCATION.value === "")) {
            alert("Kliknij w wybrane drzewo na mapie aby wybrać jego lokalizację!");
            return ;
        }
        const CHOSEN_TREE = TREE_CALCULATOR_SPECIES.value;
        let value;
        let age;
        if ((TREE_CALCULATOR_AGE.value === "" || TREE_CALCULATOR_AGE.value === undefined) && (TREE_CALCULATOR_PERIMETER.value !== "" && TREE_CALCULATOR_PERIMETER.value !== undefined)) {
            age = getAgeByDiameter(TREE_CALCULATOR_PERIMETER.value, TREES_TYPES[CHOSEN_TREE]) / 10;
        } else if ((TREE_CALCULATOR_AGE.value !== "" && TREE_CALCULATOR_AGE.value !== undefined)) { 
            age = Number(TREE_CALCULATOR_AGE.value) / 10;
        }
        let lowerValue = TREE_AGE_VALUE[Math.floor(age)];
        let higherValue = TREE_AGE_VALUE[Math.ceil(age)];
        let ageValue = lowerValue + ((higherValue - lowerValue) * (age - Math.floor(age)));
        value = TREES_TYPES[CHOSEN_TREE].avgPrice * 1.23 * TREE_CONDITION_VALUE[Number(TREE_CALCULATOR_CONDITION.value) - 1] * ageValue * TREE_CALCULATOR_LOCATION.value;
        value = value.toFixed(2);
        showTreeResult(value, TREES_TYPES[CHOSEN_TREE]);
    }
}

