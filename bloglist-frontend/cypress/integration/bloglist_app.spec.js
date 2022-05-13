describe("Bloglist app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    const user = {
      username: "dimitri",
      name: "Dimitri",
      password: "TechTonicShift513",
    };

    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is displayed", function () {
    cy.contains("Log in to Bloglist");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.login({ username: "dimitri", password: "TechTonicShift513" });
      cy.contains("Dimitri logged in");
    });

    it("Fails with wrong credentials", function () {
      cy.get("#input-username").type("dimitri");
      cy.get("#input-password").type("TecktonicShift512");
      cy.get("#button-login").click();

      cy.get(".notification")
        .should("contain", "Wrong credentials")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "fontSize", "25px");
    });
  });
});
