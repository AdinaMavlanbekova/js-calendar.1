const ruMomentCustomization = {
    week: {
        dow: 1
    },
    weekdaysShort: ["Пон", "Втр", "Срд", "Чтв", "Птн", "Сбт", "Вск"]
}
const enMomentCustomization = {
    week: {
        dow: 1 //monday
    },
    weekdaysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
}
const kgMomentCustomization = {
    week: {
        dow: 1 //monday
    },
    weekdaysShort: ["Дуй", "Шей", "Шар", "Бей", "Жум", "Ише", "Жек"],
    //////////////dz
    months: ["Учтун айы", "бирдин айы", "жалган куран", "чын куран", "бугу", "кулжа", "теке", "баш оона", "аяк оона", "тогуздун айы", "жетинин айы", "бештин айы"],

}

String.prototype.capitalize = function (){
    return this[0].toUpperCase()  + this.slice(1).toLowerCase();
}

let currentCulture = "en";
moment.updateLocale(currentCulture, getCustomizationByCulture())
let currentDate = moment(); //.locale(currentCulture, getCustomizationByCulture());
let currentTheme = "dark";

function getCustomizationByCulture() {
    switch (currentCulture){
        case "en": return enMomentCustomization;
        case "ru": return ruMomentCustomization;
        case "kg": return kgMomentCustomization;
    }
}

moment.updateLocale(currentCulture, {
    week : {
        dow : 1,
    }
});
function getWeekdaysNames() {
    return moment
        .updateLocale(currentCulture, getCustomizationByCulture())
        .weekdaysShort();
}

function changeLanguageHandler(event) {
    const selectedLanguage = event.target.dataset.language;
    currentCulture = selectedLanguage;
    moment.updateLocale(currentCulture, getCustomizationByCulture());
    renderCalendar();
}
function renderLanguages() {
    const languagesButtons = document.querySelectorAll("input[type=radio]");

    const [ruButton, kgButton, enButton] = [...languagesButtons];

    switch (currentCulture) {
        case "en":
            enButton.checked = true;
            break;
        case "ru":
            ruButton.checked = true;
            break;
        case "kg":
            kgButton.checked = true;
            break;
    }

    languagesButtons.forEach((button) => {
        button.removeEventListener("change", changeLanguageHandler);
        button.addEventListener("change", changeLanguageHandler)
    });
}

function renderWeekdays() {
    const weekdays = getWeekdaysNames();

    //for(const weekday of weekdays){
      //  const li = document.createElement("li");
        //li.innerText = weekday;
    //}

    const htmlElements = weekdays.map(function (weekday){
        const li = document.createElement("li");
        li.innerText = weekday.capitalize();
        return li;
    });

    const calendarWeekdaysContainer = document.querySelector(".calendar-weekdays");
    calendarWeekdaysContainer.innerHTML = "";
    calendarWeekdaysContainer.append(...htmlElements);
}

function renderCurrentDate() {
   const calendarCurrentDate = document.querySelector(".calendar-current-date");
    calendarCurrentDate.innerText = currentDate.locale(currentCulture, getCustomizationByCulture()).format("MMMM YYYY").capitalize();
    //////////////////////dz
    if (currentCulture === "kg"){
        calendarCurrentDate.innerText = currentDate.locale(currentCulture, getCustomizationByCulture()).format("MMMM YYYY").capitalize();
    }
}

function renderDays() {

    const daysInMonth = currentDate.daysInMonth();
    const calendarDatesContainer = document.querySelector(".calendar-dates");
    calendarDatesContainer.innerHTML = "";

    const firstDayInMonth = currentDate.set("date", 1);
    const skipDaysCount = firstDayInMonth.weekday();

    for (let i = 0; i < skipDaysCount; i++){
        const li = document.createElement("li");
        li.innerText = "";
        calendarDatesContainer.append(li);
    }

    const dateNow = moment().locale(currentCulture, getCustomizationByCulture());

    for(let i = 1; i <= daysInMonth; i++){
        const li = document.createElement("li");
        li.innerText = i.toString();

        if (currentDate.format("MM-YYYY") === dateNow.format("MM-YYYY") && dateNow.date() === i){
            li.className = "active";
        }

        const currentDay = currentDate.clone().date(i);
        if (currentDay.day() === 6 || currentDay.day() === 0) {
            li.classList.add("weekend");
        }

        calendarDatesContainer.append(li);
    }

}


function changeThemeHandler(event) {
    const isDarkMode = event.target.checked;
    currentTheme = isDarkMode ? "dark" : "light";
    renderCalendar();
}
function renderTheme() {
    const calendarContainer = document.querySelector(".calendar-container");
    const themeContainer = document.querySelector(".theme__container");
    const themeIcon = themeContainer.querySelector("img");

    if (currentTheme === "dark"){
        calendarContainer.classList.add("dark__theme");
        themeContainer.classList.add("dark__theme");
        themeIcon.style.content = `url('images/light.png')`;
    }else {
        calendarContainer.classList.remove("dark__theme");
        themeContainer.classList.remove("dark__theme");
        themeIcon.style.content = `url('images/dark-mode.png')`;
    }

    const themeInput = themeContainer.querySelector("input[type=checkbox]");
    themeInput.removeEventListener("change", changeThemeHandler);
    themeInput.addEventListener("change", changeThemeHandler);

}

function renderCalendar() {
    renderWeekdays();
    renderCurrentDate();
    renderDays();
    getSeasonBackground();
    renderLanguages();
    renderTheme();
}

const [prevBtn, nextBtn] = [...document.querySelectorAll(".calendar-navigation span")];

prevBtn.onclick = () => {
    currentDate.subtract(1, "month");
    renderCalendar();
}

nextBtn.onclick = () => {
    currentDate.add(1, "month");
    renderCalendar();
}

function getSeasonBackground() {
    const body = document.body;
    const currentMonth = currentDate.month();

    let seasonClass = '';

    if (currentMonth >= 2 && currentMonth <= 4) {
        seasonClass = 'spring';
    } else if (currentMonth >= 5 && currentMonth <= 7) {
        seasonClass = 'summer';
    } else if (currentMonth >= 8 && currentMonth <= 10) {
        seasonClass = 'autumn';
    } else {
        seasonClass = 'winter';
    }
    body.className = seasonClass;
}

renderCalendar();
