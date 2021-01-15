import validator from "validator";

class FormValidator {
  private form: HTMLFormElement;

  private ids?: Array<string> = [];

  private min?: number;

  private max?: number;

  constructor(
    form: HTMLFormElement,
    min?: number,
    max?: number,
    ...ids: string[]
  ) {
    this.form = form;

    if (min !== undefined) {
      this.min = min;
    }

    if (max !== undefined) {
      this.max = max;
    }

    ids.forEach((id) => this.ids?.push(id));
  }

  init(): void {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      this.removeMessage();

      if (this.fieldsAreValid()) {
        alert("Form submitted");
      }

      if (
        this.min !== undefined &&
        this.max !== undefined &&
        this.ids !== undefined
      ) {
        this.contentSize(this.min, this.max);
      }
    });
  }

  fieldsAreValid(): boolean {
    const emptyInputsText = this.verifyEmptyInputs("text");
    const emptyInputsEmail = this.verifyEmptyInputs("email");
    const emptyInputsPassword = this.verifyEmptyInputs("password");
    const validEmailInput = this.verifyEmailInputs();
    const validRadioInput = this.verifyRadioInputs();
    const validCheckBoxInput = this.verifyCheckBoxInputs();

    if (
      emptyInputsText &&
      emptyInputsEmail &&
      emptyInputsPassword &&
      validEmailInput &&
      validRadioInput &&
      validCheckBoxInput
    ) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  verifyEmptyInput(input: HTMLInputElement): boolean {
    if (validator.isEmpty(input.value)) {
      return true;
    }
    return false;
  }

  verifyEmailInputs(): boolean {
    let valid = true;
    const inputs: NodeListOf<HTMLInputElement> = this.form.querySelectorAll(
      `input[type='email']`,
    );

    inputs.forEach((input) => {
      if (validator.isEmail(input.value)) {
        valid = true;
      } else {
        this.addMessage("This email is not valid", input);
        valid = false;
      }
    });

    return valid;
  }

  // eslint-disable-next-line class-methods-use-this
  verifyRadioInputs(): boolean {
    const radios: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      "input[type='radio']",
    );

    let radioValid = false;
    let i = 0;

    while (!radioValid && i < radios.length) {
      if (radios[i].checked) radioValid = true;
      i += 1;
    }

    if (!radioValid) alert("must check some option");
    return radioValid;
  }

  // eslint-disable-next-line class-methods-use-this
  verifyCheckBoxInputs(): boolean {
    const checkboxs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      "input[type='checkbox']",
    );
    let checked = false;

    checkboxs.forEach((checkbox) => {
      checked = !!(checkbox.checked || checked === true);
    });

    if (checked === false) alert("must check some option");

    return checked;
  }

  verifyEmptyInputs(type: string): boolean {
    let empty = true;
    const inputs: NodeListOf<HTMLInputElement> = this.form.querySelectorAll(
      `input[type='${type}']`,
    );

    inputs.forEach((input) => {
      if (this.verifyEmptyInput(input)) {
        empty = false;
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
        empty = true;
      }
    });

    return empty;
  }

  // eslint-disable-next-line class-methods-use-this
  contentSize(min: number, max: number): void {
    this.ids?.forEach((id) => {
      const input = document.querySelector(`#${id}`) as HTMLInputElement;
      if (!(input.value.length >= min && input.value.length <= max)) {
        if (input.previousElementSibling !== null) {
          this.addMessage(
            `${input.previousElementSibling.innerHTML.replace(
              ":",
              "",
            )} must be between ${min} and ${max} characters`,
            input,
          );
        }
      }
    });
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
const formValidator = new FormValidator(
  form,
  5,
  10,
  "name",
  "password",
  "surname",
);
formValidator.init();
