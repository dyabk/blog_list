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

    it("The user who created a blog can delete it", function () {
      cy.createBlog({
        title: "test title",
        author: "test author",
        url: "test url",
      });
      cy.contains("view").click();
      cy.contains("delete").click();
      cy.get("html").should("not.contain", "test title");
    });

    it("Only the user who created a blog can delete it", function () {
      cy.createBlog({
        title: "test title",
        author: "test author",
        url: "test url",
      });
      cy.contains("logout").click();

      const user = {
        username: "santiago",
        name: "Santiago",
        password: "ProgressGuaranteed622",
      };
      cy.request("POST", "http://localhost:3003/api/users", user);

      cy.login({ username: "santiago", password: "ProgressGuaranteed622" });
      cy.get("html").should("not.contain", "test title");
      cy.contains("view").click();
      cy.contains("delete").should("not.exist");
    });

    it("Blogs are ordered according to likes", function () {
      cy.createBlog({
        title: "test title1",
        author: "test author1",
        url: "test url1",
        likes: 8,
      });
      cy.createBlog({
        title: "test title2",
        author: "test author2",
        url: "test url2",
        likes: 2,
      });
      cy.createBlog({
        title: "test title3",
        author: "test author3",
        url: "test url3",
        likes: 22,
      });

      cy.get(".button-view")
        .click({ multiple: true })
        .then(() =>
          cy.get(".blog").then((blogs) => {
            cy.wrap(blogs[0]).contains("test title3");
            cy.wrap(blogs[1]).contains("test title1");
            cy.wrap(blogs[2]).contains("test title2");
          })
        );
    });
  });
});
