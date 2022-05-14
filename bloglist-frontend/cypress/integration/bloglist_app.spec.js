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

      cy.get("html").should("not.contain", "Dimitri logged in");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "dimitri", password: "TechTonicShift513" });
    });

    it("A blog can be created", function () {
      cy.contains("create new post").click();
      cy.get("#input-title").type("test title");
      cy.get("#input-author").type("test author");
      cy.get("#input-url").type("https://www.cypress.io/");
      cy.get("#button-create").click();
      cy.contains("test title test author");
    });

    it("The user can like a blog", function () {
      cy.createBlog({
        title: "test title1",
        author: "test author1",
        url: "test url1",
      });
      cy.createBlog({
        title: "test title2",
        author: "test author2",
        url: "test url2",
      });
      cy.createBlog({
        title: "test title3",
        author: "test author3",
        url: "test url3",
      });

      cy.contains("title2").parent().find("button").as("theButton");
      cy.get("@theButton").click();
      cy.contains("like").click();
      cy.contains("Likes: 1");
    });
  });
});
