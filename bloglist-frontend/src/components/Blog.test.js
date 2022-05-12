import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog /> component", () => {
  const blog = {
    id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: {
      username: "Dimitri",
      name: "Dimitri",
      id: "627c22052faf6e5c58c82e47",
    },
  };

  let component;
  let handleLike;

  beforeEach(() => {
    handleLike = jest.fn();
    component = render(<Blog blog={blog} handleLike={handleLike} user={{}} />);
  });

  test("at start displays the blog's title and author are rendered", () => {
    const div = component.container.querySelector(".blog");

    expect(div).toHaveTextContent("Go To Statement Considered Harmful");
    expect(div).toHaveTextContent("Edsger W. Dijkstra");
  });

  test("at start the blog's URL and number of likes are not displayed", () => {
    const div = component.container.querySelector(".blog");

    expect(div).not.toHaveTextContent(
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html"
    );
    expect(div).not.toHaveTextContent("likes");
  });

  test("after the button click, the blog's url and number of likes are displayed", () => {
    const div = component.container.querySelector(".blog");
    const button = component.getByText("view");
    fireEvent.click(button);

    expect(div).toHaveTextContent(
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html"
    );
    expect(div).toHaveTextContent("Likes: ");
  });

  test("when the like button is clicked twice, the like handler is called twice", () => {
    const viewButton = component.getByText("view");
    fireEvent.click(viewButton);

    const likeButton = component.getByText("like");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(handleLike.mock.calls).toHaveLength(2);
  });
});
