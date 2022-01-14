import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const header = screen.queryByText(/contact form/i);
  expect(header).toHaveTextContent(/contact form/i);
  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const firstNameField = screen.getByLabelText(/First Name*/i);
  userEvent.type(firstNameField, "123");

  const errorMessages = await screen.findAllByTestId("error");
  expect(errorMessages).toHaveLength(1);
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(3);
  });
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const firstNameField = screen.getByLabelText(/first name*/i);
  userEvent.type(firstNameField, "leahmarie");

  const lastNameField = screen.getByLabelText(/last name*/i);
  userEvent.type(lastNameField, "baller");

  const button = screen.getByRole("button");
  userEvent.click(button);

  const errorMessages = await screen.findAllByTestId("error");
  expect(errorMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const emailField = screen.getByLabelText(/email*/i);
  userEvent.type(emailField, "ghhgmmyh@");

  const errorMessage = await screen.findByText(
    /email must be a valid email address/i
  );
  expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  const errorMessage = await screen.findByText(/lastName is a required field/i);
  expect(errorMessage).toBeInTheDocument();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);
  const firstNameField = screen.getByLabelText(/first name*/i);
  const lastNameField = screen.getByLabelText(/last name*/i);
  const emailField = screen.getByLabelText(/email*/i);

  userEvent.type(firstNameField, "leahmarie");
  userEvent.type(lastNameField, "baller");
  userEvent.type(emailField, "leahmarie@gmail.com");

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  await waitFor(() => {
    const firstNameDisplay = screen.queryByText("leahmarie");
    const lastNameDisplay = screen.queryByText("baller");
    const emailDisplay = screen.queryByText("leahmarie@gmail.com");
    const messageDisplay = screen.queryByTestId("messageDisplay");

    expect(firstNameDisplay).toBeInTheDocument();
    expect(lastNameDisplay).toBeInTheDocument();
    expect(emailDisplay).toBeInTheDocument();
    expect(messageDisplay).not.toBeInTheDocument();
  });
});

test("renders all fields text when all fields are submitted.", async () => {
  //Arrange
  render(<ContactForm />);

  //Act: Do a complete submission.
  //1. Select the firstName input.
  const firstName = screen.getByPlaceholderText(/edd/i);
  //2. Type in your firstName:
  userEvent.type(firstName, "Eddie");
  //3. Select the lastName input.
  const lastName = screen.getByPlaceholderText(/burke/i);
  //4. Type in your lastName.
  userEvent.type(lastName, "Baller");
  //5. Select the email input.
  const email = screen.getByLabelText(/email*/i);
  //6. Type in your email.
  userEvent.type(email, "bluebill1049@hotmail.com");
  //7. Select the message input.
  const message = screen.getByLabelText(/message/i);
  //8. Type in your message.
  userEvent.type(message, "This is a message");
  //9. Click your submit button.
  const button = screen.getByRole("button");
  userEvent.click(button);

  //Assert:
  //Shows our Contact info on list.
  const output = await screen.findByText("Eddie");
  expect(output).toBeInTheDocument();
  expect(output).toBeTruthy();
  expect(output).not.toBeNull();
});
