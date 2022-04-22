describe("Clock Settings prepare", () => {
    it("Visits the page", () => {
        cy.visit("http://localhost:3000")
    })
    it("Opens the settings page", () => {
        cy.get(".settings").click()
    })
    it("Installs the clock widget", () => {
        cy.get(".settings_labels").contains("Widgets").click()
        cy
            .get(".widget_header")
            .contains("Clock")
            .parent()
            .children("button")
            .click()
        cy.get(".settings_labels").contains("Settings").click()
    })
})
describe("Test the 24h time format", () => {
    it("Clicks the dropdown", () => {
        cy
            .get(".settings_item__form_item_label")
            .contains("Time Format")
            .parent()
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
    it("Selects the 24h option", () => {
        cy
            .get(".settings_item__form_item_label")
            .contains("Time Format")
            .parent()
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__options")
            .contains("24h")
            .click()
    })
    it("Closes the settings page", () => {
        cy
            .get(".settings_menu__close_icon__wrapper")
            .children("svg")
            .click()
    })
    it("Checks for the right time format", () => {
        let time = new Date();
        let hours = time.getHours();
        let minutes = time.getMinutes();

        // make hours and minutes zero padded
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        cy.log("Time: ${hours}:${minutes}")

        cy
            .get(".clock.widget")
            .children(".time__wrapper")
            .children("#time_full")
            .contains(`${hours}:${minutes}`)
    })
})
describe("Test the 12h time format", () => {
    it("Opens the settings page", () => {
        cy.get(".settings").click()
    })
    it("Clicks the dropdown", () => {
        cy
            .get(".settings_item__form_item_label")
            .contains("Time Format")
            .parent()
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
    it("Selects the 12h option", () => {
        cy
            .get(".settings_item__form_item_label")
            .contains("Time Format")
            .parent()
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__options")
            .contains("12h")
            .click()
    })
    it("Closes the settings page", () => {
        cy
            .get(".settings_menu__close_icon__wrapper")
            .children("svg")
            .click()
    })
    it("Checks for the right time format", () => {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;

        cy.log(`Time: ${hours}:${minutes} ${ampm}`)

        cy
            .get(".clock.widget")
            .children(".time__wrapper")
            .children("#time")
            .contains(`${hours}:${minutes}`)
        
        cy
            .get(".clock.widget")
            .children(".time__wrapper")
            .children("#time__period")
            .contains(`${ampm}`)
    })
})
describe("Test the weekday, date and year", () => {
    it("Checks the weekday", () => {
        let date = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        cy.log("Weekday: " + date)

        cy
            .get(".clock.widget")
            .children(".date__wrapper")
            .children("#week-day")
            .contains(date)
    })
})