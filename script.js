const fromText = document.querySelector('.from-text')
const toText = document.querySelector('.to-text')
const exchangeIcon = document.querySelector('.exchange')
const selectTag = document.querySelectorAll('select')
const icons = document.querySelectorAll('.row i')
const translateBtn = document.querySelector('button')


selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "de-DE" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

exchangeIcon.addEventListener("click", () =>{
    let textTemp = fromText.value
    let langTemp = selectTag[0].value

    fromText.value = toText.value
    toText.value = textTemp
    selectTag[0].value = selectTag[1].value
    selectTag[1].value = langTemp
})

fromText.addEventListener("keyup", () =>{
    if(!fromText.value){
        toText.value = "";
    }
});

fromText.addEventListener("keydown", (e) =>{
    if(e.key === 'Enter'){
        e.preventDefault()
        translate()
    }
})


translateBtn.addEventListener("click", () =>{
    translate()
})

function translate() {
    let text = fromText.value.trim()
    let translateFrom = selectTag[0].value
    let translateTo = selectTag[1].value

    if(!text) return;
    toText.setAttribute("placeholder", "Translating...")

    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`
    fetch(apiUrl).then(res => res.json()).then(data =>{
        toText.value = data.responseData.translatedText
        data.matches.forEach(data => {
            if (data.id === 0) {
                toText.value = data.translation
            }
        })
        toText.setAttribute("placeholder", "Translation")
    })
}

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if(!fromText.value || !toText.value) return;
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value)
            } else {
                navigator.clipboard.writeText(toText.value)
            }
        } else {
            let utter;
            if(target.id == "from") {
                utter = new SpeechSynthesisUtterance(fromText.value)
                utter.lang = selectTag[0].value
            } else{
                utter = new SpeechSynthesisUtterance(toText.value)
                utter.lang = selectTag[1].value
            }
            speechSynthesis.speak(utter)
        }
    })
})