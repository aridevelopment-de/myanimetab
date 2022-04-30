/* eslint-disable no-undef */
describe("Settings form prepare", () => {
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


describe("Check the time zone dropdown", () => {
    beforeEach(() => {
        cy
            .get(".settings_item__form_item_label")
            .contains("Time Zone")
            .parent()
            .as("settings_parent")
    })
    it("Clicks the dropdown", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
    it("Checks if it's dropped down", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .should("have.class", "choosing_item")

        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__options")
            .should("have.class", "selected")
    })
    it("Checks if the selected label is an existing label", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .children("span.settings_select__current_item__text")
            .text()
            .then((text) => {
                cy
                    .get("@settings_parent")
                    .children(".settings_item__form_item_content")
                    .children(".settings_select")
                    .children(".settings_select__options")
                    .contains(`${text}`)
            })
    })
    it("Deselects the dropdown", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
})

describe("Check the time format dropdown", () => {
    beforeEach(() => {
        cy
            .get(".settings_item__form_item_label")
            .contains("Time Format")
            .parent()
            .as("settings_parent")
    })
    it("Clicks the dropdown", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
    it("Checks if it's dropped down", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .should("have.class", "choosing_item")

        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__options")
            .should("have.class", "selected")
    })
    it("Checks if the selected label is an existing label", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .children("span.settings_select__current_item__text")
            .text()
            .then((text) => {
                cy
                    .get("@settings_parent")
                    .children(".settings_item__form_item_content")
                    .children(".settings_select")
                    .children(".settings_select__options")
                    .contains(`${text}`)
            })
    })
    it("Deselects the dropdown", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
})

describe("Check the autohiding dropdown", () => {
    beforeEach(() => {
        cy
            .get(".settings_item__form_item_label")
            .contains("When Autohiding")
            .parent()
            .as("settings_parent")
    })
    it("Clicks the dropdown", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
    it("Checks if it's dropped down", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .should("have.class", "choosing_item")

        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__options")
            .should("have.class", "selected")
    })
    it("Checks if the selected label is an existing label", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .children("span.settings_select__current_item__text")
            .text()
            .then((text) => {
                cy
                    .get("@settings_parent")
                    .children(".settings_item__form_item_content")
                    .children(".settings_select")
                    .children(".settings_select__options")
                    .contains(`${text}`)
            })
    })
    it("Deselects the dropdown", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
})

describe("Check the positioning dropdown", () => {
    beforeEach(() => {
        cy
            .get(".settings_item__form_item_label")
            .contains("Positioning")
            .parent()
            .as("settings_parent")
    })
    it("Clicks the dropdown", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
    it("Checks if it's dropped down", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .should("have.class", "choosing_item")

        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__options")
            .should("have.class", "selected")
    })
    it("Checks if the selected label is an existing label", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .children("span.settings_select__current_item__text")
            .text()
            .then((text) => {
                cy
                    .get("@settings_parent")
                    .children(".settings_item__form_item_content")
                    .children(".settings_select")
                    .children(".settings_select__options")
                    .contains(`${text}`)
            })
    })
    it("Deselects the dropdown", () => {
        cy
            .get("@settings_parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
})