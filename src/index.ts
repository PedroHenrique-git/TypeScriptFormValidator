import validator from "validator";

class FormValidator {
  private form: HTMLFormElement;

  constructor(form: HTMLFormElement) {
    this.form = form;
  }

  init(): void {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.removeMessage();
      this.verifyEmptyInputs("text");
      this.verifyEmptyInputs("email");
      this.verifyEmptyInputs("password");
      this.verifyRadioInputs();
      this.verifyCheckBoxInputs();
      this.verifyEmailInputs();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  verifyEmptyInput(input: HTMLInputElement): boolean {
    if (!validator.isEmpty(input.value)) return false;
    return true;
  }

  verifyEmailInputs(): void {
    const inputs: NodeListOf<HTMLInputElement> = this.form.querySelectorAll(
      `input[type='email']`,
    );

    inputs.forEach((input) => {
      if (!validator.isEmail(input.value)) {
        this.addMessage("This email is not valid", input);
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  verifyRadioInputs(): void {
    const radios: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      "input[type='radio']",
    );

    let radioValid = false;
    let i = 0;

    while (!radioValid && i < radios.length) {
      if (radios[i].checked) radioValid = true;
      if (!radioValid) this.addMessage("must check some option", radios[i]);
      i += 1;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  verifyCheckBoxInputs(): void {
    const checkboxs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      "input[type='checkbox']",
    );
    let checked = false;

    checkboxs.forEach((checkbox) => {
      checked = !!(checkbox.checked || checked === true);
      if (checked === false) {
        this.addMessage("must check some option", checkbox);
      }
    });
  }

  verifyEmptyInputs(type: string): boolean {
    let empty = false;
    const inputs: NodeListOf<HTMLInputElement> = this.form.querySelectorAll(
      `input[type='${type}']`,
    );

    inputs.forEach((input) => {
      if (this.verifyEmptyInput(input)) {
        empty = true;
        if (input.previousElementSibling !== null) {
          this.addMessage(
            `${input.previousElementSibling.innerHTML.replace(
              ":",
              "",
            )} cannot be empty`,
            input,
          );
        }
      } else {
        empty = false;
      }
    });

    return empty;
  }

  // eslint-disable-next-line class-methods-use-this
  private addMessage(msg: string, input: HTMLElement): void {
    const span: HTMLSpanElement = document.createElement("span");
    span.classList.add("error-message");
    span.innerText = msg;
    input.insertAdjacentElement("afterend", span);
  }

  // eslint-disable-next-line class-methods-use-this
  private removeMessage(): void {
    const errors: NodeListOf<HTMLSpanElement> = this.form.querySelectorAll(
      ".error-message",
    );

    errors.forEach((error) => error.remove());
  }
}

const form = document.querySelector("form") as HTMLFormElement;
new FormValidator(form).init();
