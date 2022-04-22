describe("Clock settings prepare", () => {
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

const clock_positions = {
    left_upper_corner: "one",
    right_upper_corner: "two",
    right_lower_corner: "three",
    left_lower_corner: "four"
}

describe("Test the left upper corner position", () => {
    beforeEach(() => {
        cy
            .get(".settings_item__title_text")
            .contains("Clock")
            .parent()
            .parent()
            .children(".settings_item__content")
            .within(($form) => {
                cy
                    .get(".settings_item__form_item_label")
                    .contains("Positioning")
                    .parent()
                    .as("parent")
            })
    })
    it("Clicks the dropdown", () => {
        cy
            .get("@parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
    it("Selects the left upper corner option", () => {
        cy
            .get("@parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__options")
            .contains("Left upper corner")
            .click()
    })
    it("Closes the settings page", () => {
        cy
            .get(".settings_menu__close_icon__wrapper")
            .children("svg")
            .click()
    })
    it("Checks for the right positioning", () => {
        cy
            .get(".clock__wrapper")
            .should("have.class", clock_positions.left_upper_corner)
    })
})

describe("Test the right upper corner position", () => {
    beforeEach(() => {
        cy
            .get(".settings_item__title_text")
            .contains("Clock")
            .parent()
            .parent()
            .children(".settings_item__content")
            .within(($form) => {
                cy
                    .get(".settings_item__form_item_label")
                    .contains("Positioning")
                    .parent()
                    .as("parent")
            })
    })
    it("Opens the settings page", () => {
        cy.get(".settings").click()
    })
    it("Clicks the dropdown", () => {
        cy
            .get("@parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
    it("Selects the right upper corner option", () => {
        cy
            .get("@parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__options")
            .contains("Right upper corner")
            .click()
    })
    it("Closes the settings page", () => {
        cy
            .get(".settings_menu__close_icon__wrapper")
            .children("svg")
            .click()
    })
    it("Checks for the right positioning", () => {
        cy
            .get(".clock__wrapper")
            .should("have.class", clock_positions.right_upper_corner)
    })
})

describe("Test the right lower corner position", () => {
    beforeEach(() => {
        cy
            .get(".settings_item__title_text")
            .contains("Clock")
            .parent()
            .parent()
            .children(".settings_item__content")
            .within(($form) => {
                cy
                    .get(".settings_item__form_item_label")
                    .contains("Positioning")
                    .parent()
                    .as("parent")
            })
    })
    it("Opens the settings page", () => {
        cy.get(".settings").click()
    })
    it("Clicks the dropdown", () => {
        cy
            .get("@parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
    it("Selects the right lower corner option", () => {
        cy
            .get("@parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__options")
            .contains("Right lower corner")
            .click()
    })
    it("Closes the settings page", () => {
        cy
            .get(".settings_menu__close_icon__wrapper")
            .children("svg")
            .click()
    })
    it("Checks for the right positioning", () => {
        cy
            .get(".clock__wrapper")
            .should("have.class", clock_positions.right_lower_corner)
    })
})

describe("Test the left lower corner position", () => {
    beforeEach(() => {
        cy
            .get(".settings_item__title_text")
            .contains("Clock")
            .parent()
            .parent()
            .children(".settings_item__content")
            .within(($form) => {
                cy
                    .get(".settings_item__form_item_label")
                    .contains("Positioning")
                    .parent()
                    .as("parent")
            })
    })
    it("Opens the settings page", () => {
        cy.get(".settings").click()
    })
    it("Clicks the dropdown", () => {
        cy
            .get("@parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__current_item")
            .click()
    })
    it("Selects the left lower corner option", () => {
        cy
            .get("@parent")
            .children(".settings_item__form_item_content")
            .children(".settings_select")
            .children(".settings_select__options")
            .contains("Left lower corner")
            .click()
    })
    it("Closes the settings page", () => {
        cy
            .get(".settings_menu__close_icon__wrapper")
            .children("svg")
            .click()
    })
    it("Checks for the right positioning", () => {
        cy
            .get(".clock__wrapper")
            .should("have.class", clock_positions.left_lower_corner)
    })
})